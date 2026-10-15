import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Berhasil keluar dari akun',
    });
  } catch (error) {
    console.error('API /api/auth/logout Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat keluar' },
      { status: 500 }
    );
  }
}
