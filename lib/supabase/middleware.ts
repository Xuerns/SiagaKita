import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware untuk menyinkronkan dan menyegarkan (refresh) token sesi Supabase.
 * Token akses (access token) berumur pendek (~1 jam) dan diperbarui secara otomatis
 * menggunakan refresh token yang tersimpan aman di cookie browser.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        );
      },
    },
  });

  // PENTING: getUser() memvalidasi token JWT ke server Supabase secara berkala
  // dan memicu rotasi/penyegaran (refresh) token ke dalam cookie jika sudah kedaluwarsa.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isPublicRoute =
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/favicon.ico';

  // 1. Jika belum login dan mencoba mengakses dashboard atau rute terproteksi:
  if (!user && !isAuthPage && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    const redirectResponse = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value, c);
    });
    return redirectResponse;
  }

  // 2. Jika sudah login dan mencoba membuka halaman login atau register:
  if (user && isAuthPage) {
    const homeUrl = new URL('/', request.url);
    const redirectResponse = NextResponse.redirect(homeUrl);
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value, c);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
