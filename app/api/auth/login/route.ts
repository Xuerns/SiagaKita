import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp, filterSensitiveProfile } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting: Maksimal 5 percobaan login per menit per IP
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`login:${clientIp}`, 5, 60);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan masuk. Silakan coba lagi dalam ${rateCheck.resetSeconds} detik.`,
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
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const cleanEmail = email.trim().toLowerCase();

    const supabase = await createClient();

    let { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    // Jika terjadi error, cek apakah pengguna sudah terdaftar tetapi belum dikonfirmasi emailnya
    if (error) {
      try {
        const { createAdminClient } = await import('@/lib/supabase/admin');
        const adminClient = createAdminClient();
        if (typeof adminClient?.auth?.admin?.listUsers === 'function') {
          const { data: usersData } = await adminClient.auth.admin.listUsers();
          const existingUser = usersData?.users.find((u) => u.email?.toLowerCase() === cleanEmail);

          if (existingUser && !existingUser.email_confirmed_at && typeof adminClient.auth.admin.updateUserById === 'function') {
            await adminClient.auth.admin.updateUserById(existingUser.id, { email_confirm: true });
            const retry = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password,
            });
            if (!retry.error && retry.data) {
              data = retry.data;
              error = null;
            }
          }
        }
      } catch (adminErr) {
        console.warn('Gagal memverifikasi status email admin:', adminErr);
      }
    }

    if (error || !data?.user) {
      return NextResponse.json(
        { error: error?.message || 'Invalid login credentials' },
        { status: 401 }
      );
    }

    // Ambil data profil pengguna
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    // Saring data sensitif (misal kerentanan keluarga tanpa persetujuan)
    const safeProfile = filterSensitiveProfile(profile, true);

    return NextResponse.json({
      success: true,
      message: 'Berhasil masuk',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'warga',
        nama: profile?.nama || data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
      },
      profile: safeProfile,
    });
  } catch (error) {
    console.error('API /api/auth/login Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat proses masuk' },
      { status: 500 }
    );
  }
}
