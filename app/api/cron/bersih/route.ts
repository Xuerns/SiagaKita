import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');

    const isAuthorized =
      Boolean(cronSecret) &&
      (authHeader === `Bearer ${cronSecret}` || querySecret === cronSecret);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Kunci CRON_SECRET tidak valid.' },
        { status: 401 }
      );
    }

    const adminClient = createAdminClient();
    const nowIso = new Date().toISOString();

    // 1. Sembunyikan / tandai laporan yang sudah melewati masa kedaluwarsa (24 jam)
    const { data: expiredReports, error: reportError } = await adminClient
      .from('community_reports')
      .update({ status: 'disembunyikan' })
      .lt('expires_at', nowIso)
      .neq('status', 'disembunyikan')
      .select('id');

    if (reportError) {
      console.error('Pembersihan laporan kedaluwarsa gagal:', reportError);
      return NextResponse.json({ error: reportError.message }, { status: 500 });
    }

    // 2. Pembersihan akun tamu lama berbasis interval (Retensi default: 7 hari)
    const guestDaysParam = parseInt(searchParams.get('guest_days') || '7', 10);
    const guestRetentionDays = isNaN(guestDaysParam) || guestDaysParam < 1 ? 7 : guestDaysParam;
    const guestCutoffIso = new Date(Date.now() - guestRetentionDays * 24 * 60 * 60 * 1000).toISOString();

    let totalTamuDibersihkan = 0;
    try {
      // Hapus profil tamu yang terdaftar lebih lama dari batas retensi
      const { data: expiredGuests, error: guestError } = await adminClient
        .from('profiles')
        .delete()
        .like('nama', 'Tamu %')
        .lt('created_at', guestCutoffIso)
        .select('id');

      if (!guestError && expiredGuests) {
        totalTamuDibersihkan = expiredGuests.length;
        // Bersihkan juga dari auth.users via admin client jika tersedia
        if (adminClient.auth?.admin?.deleteUser) {
          await Promise.allSettled(
            expiredGuests.map((g) => adminClient.auth.admin.deleteUser(g.id))
          );
        }
      } else if (guestError) {
        console.warn('Pembersihan data profil tamu lama menemui kendala:', guestError);
      }
    } catch (guestErr) {
      console.warn('Gagal memproses pembersihan akun tamu:', guestErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Pembersihan berkala laporan dan akun tamu selesai.',
      total_dibersihkan: expiredReports?.length || 0,
      total_laporan_dibersihkan: expiredReports?.length || 0,
      total_tamu_dibersihkan: totalTamuDibersihkan,
      guest_retention_days: guestRetentionDays,
      timestamp: nowIso,
    });
  } catch (error) {
    console.error('API /api/cron/bersih Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat pembersihan berkala' },
      { status: 500 }
    );
  }
}

