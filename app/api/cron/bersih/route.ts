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

    // Sembunyikan / tandai laporan yang sudah melewati masa kedaluwarsa (24 jam)
    const { data: expiredReports, error } = await adminClient
      .from('community_reports')
      .update({ status: 'disembunyikan' })
      .lt('expires_at', nowIso)
      .neq('status', 'disembunyikan')
      .select('id');

    if (error) {
      console.error('Pembersihan laporan kedaluwarsa gagal:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pembersihan laporan kedaluwarsa selesai.',
      total_dibersihkan: expiredReports?.length || 0,
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
