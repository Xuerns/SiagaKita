import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { confirmReportSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/security';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    if (!reportId) {
      return NextResponse.json(
        { error: 'ID laporan tidak valid.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Pastikan pengguna telah terautentikasi
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Harap masuk terlebih dahulu untuk memberikan konfirmasi laporan.' },
        { status: 401 }
      );
    }

    // 2. Rate Limiting: Maksimal 20 konfirmasi per menit per user
    const rateCheck = checkRateLimit(`confirm:${user.id}`, 20, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Terlalu banyak permintaan konfirmasi. Silakan coba lagi dalam ${rateCheck.resetSeconds} detik.` },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetSeconds),
          },
        }
      );
    }

    // 3. Validasi vote jika ada di body
    let voteValue = 1;
    try {
      const body = await request.json();
      const parsed = confirmReportSchema.safeParse(body);
      if (parsed.success) {
        voteValue = parsed.data.vote;
      }
    } catch {
      // Body opsional, default vote = 1 (konfirmasi benar)
    }

    const adminClient = createAdminClient();

    // 4. Ambil data laporan
    const { data: report, error: reportErr } = await adminClient
      .from('community_reports')
      .select('*')
      .eq('id', reportId)
      .maybeSingle();

    if (reportErr || !report) {
      return NextResponse.json(
        { error: 'Laporan tidak ditemukan.' },
        { status: 404 }
      );
    }

    // 5. Pengguna tidak diperbolehkan mengonfirmasi laporannya sendiri
    if (report.user_id === user.id) {
      return NextResponse.json(
        { error: 'Anda tidak dapat mengonfirmasi laporan yang Anda buat sendiri.' },
        { status: 400 }
      );
    }

    // 6. Cek apakah pengguna sudah pernah memberikan suara untuk laporan ini
    const { data: existingVote } = await adminClient
      .from('report_confirmations')
      .select('*')
      .eq('report_id', reportId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingVote) {
      return NextResponse.json(
        { error: 'Anda sudah pernah memberikan konfirmasi untuk laporan ini.' },
        { status: 409 }
      );
    }

    // 7. Simpan rekaman konfirmasi ke report_confirmations
    const { error: insertVoteErr } = await adminClient
      .from('report_confirmations')
      .insert({
        report_id: reportId,
        user_id: user.id,
        vote: voteValue,
      });

    if (insertVoteErr) {
      console.error('Insert report_confirmations error:', insertVoteErr);
      return NextResponse.json(
        { error: `Gagal mencatat konfirmasi: ${insertVoteErr.message}` },
        { status: 500 }
      );
    }

    // 8. Hitung jumlah konfirmasi terbaru dan perbarui status laporan jika mencapai threshold >= 3
    const newCount = Math.max(0, (report.konfirmasi_count || 0) + voteValue);
    const shouldVerify = newCount >= 3 && report.status === 'belum_terverifikasi';
    const newStatus = shouldVerify ? 'terverifikasi' : report.status;

    await adminClient
      .from('community_reports')
      .update({
        konfirmasi_count: newCount,
        status: newStatus,
      })
      .eq('id', reportId);

    return NextResponse.json({
      success: true,
      message: shouldVerify
        ? 'Laporan kini TERVERIFIKASI oleh komunitas karena telah mencapai ≥ 3 konfirmasi!'
        : 'Konfirmasi Anda berhasil dicatat.',
      report_id: reportId,
      konfirmasi_count: newCount,
      status: newStatus,
    });
  } catch (error) {
    console.error('API /api/laporan/[id]/konfirmasi Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memproses konfirmasi laporan.' },
      { status: 500 }
    );
  }
}
