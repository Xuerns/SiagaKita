import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.warn('Supabase signInAnonymously failed:', error.message);
      return NextResponse.json(
        {
          error:
            error.message.includes('disabled') || error.message.includes('Anonymous')
              ? 'Anonymous sign-in belum diaktifkan di dashboard Supabase (Authentication -> Providers -> Anonymous).'
              : error.message,
        },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Gagal membuat sesi tamu' },
        { status: 400 }
      );
    }

    const guestName = 'Tamu ' + data.user.id.substring(0, 6).toUpperCase();

    // Pastikan entri profil dibuat di tabel profiles
    try {
      const adminClient = createAdminClient();
      await adminClient.from('profiles').upsert(
        {
          id: data.user.id,
          nama: guestName,
          role: 'warga',
        },
        { onConflict: 'id' }
      );
    } catch (profileErr) {
      console.warn('Gagal upsert profile tamu via admin client:', profileErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Berhasil masuk sebagai Tamu',
      isGuest: true,
      user: {
        id: data.user.id,
        email: null,
        nama: guestName,
        role: 'warga',
        is_anonymous: true,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('API /api/auth/guest Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat membuat sesi tamu' },
      { status: 500 }
    );
  }
}
