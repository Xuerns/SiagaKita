import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/security';

/**
 * Endpoint Penghapusan Akun Permanen (Right to Erasure / Right to be Forgotten)
 * Sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP Pasal 8 & 43)
 * serta spesifikasi PRD Bagian 14.2.
 */
export async function DELETE(_request?: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Verifikasi Autentikasi Pengguna
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Harap masuk terlebih dahulu untuk menghapus akun.' },
        { status: 401 }
      );
    }

    // Pengguna mode tamu tidak memiliki akun permanen
    if (user.is_anonymous) {
      return NextResponse.json(
        { error: 'Mode tamu tidak memiliki akun terdaftar permanen. Silakan gunakan menu keluar untuk mengakhiri sesi tamu.' },
        { status: 400 }
      );
    }

    // 2. Rate Limiting: Maksimal 3 percobaan per jam
    const rateCheck = checkRateLimit(`delete-account:${user.id}`, 3, 3600);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Terlalu banyak permintaan. Silakan coba lagi dalam ${Math.ceil(
            rateCheck.resetSeconds / 60
          )} menit.`,
        },
        { status: 429 }
      );
    }

    // 3. Hapus akun pengguna dari auth.users via Admin Client
    // Karena tabel relasional (profiles, push_subscriptions, user_safety_status, reports)
    // memiliki klausa ON DELETE CASCADE, seluruh data pengguna akan terhapus otomatis secara permanen.
    const adminClient = createAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Gagal menghapus akun pengguna di Supabase:', deleteError);
      return NextResponse.json(
        { error: `Gagal menghapus akun: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // 4. Bersihkan cookie sesi lokal pengguna
    try {
      await supabase.auth.signOut();
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message:
          'Akun dan seluruh data pribadi Anda berhasil dihapus permanen dari sistem sesuai amanat UU No. 27 Tahun 2022 (UU PDP).',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API /api/auth/delete-account Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memproses penghapusan akun.' },
      { status: 500 }
    );
  }
}

// Alias POST untuk kemudahan kompatibilitas klien
export async function POST(request: NextRequest) {
  return DELETE(request);
}
