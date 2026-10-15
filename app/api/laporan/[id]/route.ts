import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';

const moderationSchema = z.object({
  status: z.enum(['terverifikasi', 'ditolak', 'disembunyikan']),
  alasan: z.string().max(300).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;
    if (!reportId) {
      return NextResponse.json({ error: 'ID laporan tidak valid.' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Harap masuk terlebih dahulu untuk melakukan moderasi.' },
        { status: 401 }
      );
    }

    // Periksa apakah pengguna memiliki hak akses Relawan atau Admin
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role || 'warga';
    if (role !== 'relawan' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Akses ditolak: Hanya Relawan atau Admin yang dapat memoderasi laporan.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = moderationSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Data moderasi tidak valid.' },
        { status: 400 }
      );
    }

    const { status } = parseResult.data;

    const { error: updateError } = await adminClient
      .from('community_reports')
      .update({ status })
      .eq('id', reportId);

    if (updateError) {
      return NextResponse.json(
        { error: `Gagal memperbarui status moderasi: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status laporan berhasil diperbarui menjadi ${status}.`,
      report_id: reportId,
      status,
    });
  } catch (error) {
    console.error('API PATCH /api/laporan/[id] Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memoderasi laporan.' },
      { status: 500 }
    );
  }
}
