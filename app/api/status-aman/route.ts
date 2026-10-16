import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { safetyStatusSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp, sanitizeText, maskCoordinate } from '@/lib/security';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let myStatus = null;
    if (user) {
      const { data } = await supabase
        .from('safety_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        myStatus = {
          status: data.status,
          catatan: data.catatan,
          updated_at: data.updated_at,
        };
      }
    }

    // Statistik agregat keselamatan untuk ringkasan komunitas/lingkungan
    const adminClient = createAdminClient();
    const { count: amanCount } = await adminClient
      .from('safety_status')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'aman');

    const { count: butuhBantuanCount } = await adminClient
      .from('safety_status')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'butuh_bantuan');

    return NextResponse.json({
      success: true,
      my_status: myStatus,
      summary: {
        total_aman: amanCount || 0,
        total_butuh_bantuan: butuhBantuanCount || 0,
      },
    });
  } catch (error) {
    console.error('API GET /api/status-aman Error:', error);
    return NextResponse.json(
      { error: 'Gagal memuat status keselamatan' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    // Rate Limiting: Maksimal 10 perubahan status keselamatan per menit
    const rateCheck = checkRateLimit(`status_aman:${clientIp}`, 10, 60);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Terlalu banyak permintaan pembaruan status. Silakan coba lagi dalam ${rateCheck.resetSeconds} detik.` },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const parseResult = safetyStatusSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Status keselamatan tidak valid.' },
        { status: 400 }
      );
    }

    const { status, lat, lng, catatan } = parseResult.data;
    const cleanCatatan = catatan ? sanitizeText(catatan, 500) : null;

    const supabase = await createClient();
    let {
      data: { user },
    } = await supabase.auth.getUser();

    // Dalam situasi darurat, jika pengguna belum memiliki sesi, otomatis buat sesi tamu anonim
    if (!user) {
      const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
      if (!anonError && anonData.user) {
        user = anonData.user;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Gagal mengidentifikasi sesi pengguna untuk mencatat status keselamatan.' },
        { status: 401 }
      );
    }

    const adminClient = createAdminClient();
    const userLat = lat || -6.234;
    const userLng = lng || 106.864;

    const upsertPayload = {
      user_id: user.id,
      status,
      catatan: cleanCatatan,
      geom: `SRID=4326;POINT(${userLng} ${userLat})`,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await adminClient
      .from('safety_status')
      .upsert(upsertPayload, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Upsert safety_status error:', upsertError);
      return NextResponse.json(
        { error: `Gagal mencatat status keselamatan ke database: ${upsertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status,
      lat: maskCoordinate(userLat),
      lng: maskCoordinate(userLng),
      catatan: cleanCatatan,
      updated_at: new Date().toISOString(),
      pesan:
        status === 'aman'
          ? 'Status Anda berhasil dicatat AMAN di database dan dapat dipantau oleh sesama warga serta keluarga.'
          : 'Panggilan DARURAT BUTUH BANTUAN Anda telah dicatat di database! Koordinat Anda diprioritaskan untuk bantuan evakuasi terdekat.',
    });
  } catch (error) {
    console.error('API POST /api/status-aman Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memperbarui status keselamatan.' },
      { status: 500 }
    );
  }
}
