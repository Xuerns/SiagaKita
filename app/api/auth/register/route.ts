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

    const { email, password, nama, role, region_id } = parseResult.data;
    const cleanEmail = email.trim().toLowerCase();
    const cleanNama = sanitizeText(nama, 100);

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanNama,
          role: role,
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

    // Auto-insert atau perbarui profil pengguna di tabel profiles
    try {
      const adminClient = createAdminClient();
      await adminClient.from('profiles').upsert(
        {
          id: data.user.id,
          nama: cleanNama,
          role: role,
          region_id: region_id || null,
        },
        { onConflict: 'id' }
      );
    } catch (profileErr) {
      console.warn('Gagal upsert profile via admin client (mungkin trigger database sudah menangani):', profileErr);
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
