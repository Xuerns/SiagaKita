import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { filterSensitiveProfile } from '@/lib/security';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
        profile: null,
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const safeProfile = filterSensitiveProfile(profile, true);

    return NextResponse.json({
      isAuthenticated: true,
      isGuest: user.is_anonymous ?? false,
      user: {
        id: user.id,
        email: user.email,
        nama: safeProfile?.nama || user.user_metadata?.full_name || (user.is_anonymous ? 'Tamu' : 'Pengguna'),
        role: safeProfile?.role || 'warga',
      },
      profile: safeProfile || null,
    });
  } catch (error) {
    console.error('API /api/auth/me Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memeriksa sesi pengguna' },
      { status: 500 }
    );
  }
}
