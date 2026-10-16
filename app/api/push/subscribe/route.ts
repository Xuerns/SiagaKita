import { NextRequest, NextResponse } from 'next/server';
import { pushSubscriptionSchema, deletePushSubscriptionSchema } from '@/lib/validations';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Format body request tidak valid atau bukan JSON' },
        { status: 400 }
      );
    }

    const validation = pushSubscriptionSchema.safeParse(body);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      return NextResponse.json(
        {
          error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Data langganan push tidak valid',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { endpoint, keys, region_id } = validation.data;

    // Coba ambil ID pengguna jika sedang terautentikasi (opsional bagi tamu)
    let userId: string | null = null;
    try {
      const supabaseUser = await createServerClient();
      const { data: { user } } = await supabaseUser.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // Tamu tidak memiliki sesi, biarkan userId null
    }

    try {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from('push_subscriptions')
        .upsert(
          {
            endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth,
            region_id: region_id || null,
            user_id: userId,
          },
          { onConflict: 'endpoint' }
        )
        .select('id, endpoint, region_id, created_at')
        .single();

      if (error) {
        // Fallback untuk mode demo lokal jika tabel database belum termigrasi
        if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
          return NextResponse.json({
            success: true,
            message: 'Langganan push berhasil disimpan (Mode Demo)',
            data: {
              id: 'demo-sub-' + Date.now(),
              endpoint,
              region_id: region_id || null,
              created_at: new Date().toISOString(),
            },
          });
        }
        return NextResponse.json(
          { error: 'Gagal menyimpan langganan push ke database: ' + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Berhasil mendaftarkan langganan notifikasi push',
        data,
      });
    } catch (dbErr: any) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        return NextResponse.json({
          success: true,
          message: 'Langganan push berhasil disimpan (Mode Demo)',
          data: {
            id: 'demo-sub-' + Date.now(),
            endpoint,
            region_id: region_id || null,
            created_at: new Date().toISOString(),
          },
        });
      }
      return NextResponse.json(
        { error: 'Koneksi database gagal: ' + (dbErr?.message || 'Internal Server Error') },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Terjadi kesalahan internal pada server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      // Jika tidak di body, coba cek searchParams query URL
      const { searchParams } = new URL(request.url);
      const queryEndpoint = searchParams.get('endpoint');
      if (queryEndpoint) {
        body = { endpoint: queryEndpoint };
      } else {
        return NextResponse.json(
          { error: 'Parameter endpoint tidak ditemukan' },
          { status: 400 }
        );
      }
    }

    const validation = deletePushSubscriptionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Endpoint tidak valid' },
        { status: 400 }
      );
    }

    const { endpoint } = validation.data;

    try {
      const admin = createAdminClient();
      const { error } = await admin
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', endpoint);

      if (error && process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
        return NextResponse.json(
          { error: 'Gagal menghapus langganan: ' + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Langganan push berhasil dihentikan',
      });
    } catch (dbErr: any) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        return NextResponse.json({
          success: true,
          message: 'Langganan push berhasil dihentikan (Mode Demo)',
        });
      }
      return NextResponse.json(
        { error: 'Koneksi database gagal: ' + (dbErr?.message || 'Internal Server Error') },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Terjadi kesalahan internal pada server' },
      { status: 500 }
    );
  }
}
