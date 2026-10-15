import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { registerSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp, sanitizeText } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting: Maksimal 3 pendaftaran per 10 menit per IP
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`register:${clientIp}`, 3, 600);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Terlalu banyak permintaan pendaftaran. Silakan coba lagi dalam ${rateCheck.resetSeconds} detik.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Data pendaftaran tidak valid' },
        { status: 400 }
      );
    }

    const { email, password, nama, role, region_id, location } = parseResult.data;
    const cleanEmail = email.trim().toLowerCase();
    const cleanNama = sanitizeText(nama, 100);

    // Validasi apakah region_id adalah format UUID valid untuk kolom Postgres profiles.region_id
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidUuid = region_id && UUID_REGEX.test(region_id.trim());
    const validRegionId = isValidUuid ? region_id.trim() : null;

    // Jika region_id bukan UUID (misal nama kota "Kota Bandung"), gunakan sebagai nama lokasi
    const detectedLocation = location || (!isValidUuid && region_id ? region_id.trim() : undefined);

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanNama,
          role: role,
          wilayah: detectedLocation,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Gagal membuat pengguna baru' },
        { status: 400 }
      );
    }

    // Auto-confirm email dan upsert profil di tabel profiles
    try {
      const adminClient = createAdminClient();
      if (typeof adminClient?.auth?.admin?.updateUserById === 'function') {
        await adminClient.auth.admin.updateUserById(data.user.id, { email_confirm: true });
      }
      await adminClient.from('profiles').upsert(
        {
          id: data.user.id,
          nama: cleanNama,
          role: role,
          region_id: validRegionId,
        },
        { onConflict: 'id' }
      );
    } catch (profileErr) {
      console.warn('Gagal upsert profile/confirm via admin client:', profileErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role,
        nama: cleanNama,
      },
    });
  } catch (error) {
    console.error('API /api/auth/register Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat proses pendaftaran' },
      { status: 500 }
    );
  }
}
