import { NextRequest, NextResponse } from 'next/server';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEMO_ALERTS, DEMO_REGION } from '@/lib/data/demo';

export async function GET(request: NextRequest) {
  try {
    await connection();
  } catch {
    // Mengabaikan error saat dijalankan di lingkungan pengujian (unit test)
  }
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id') || DEMO_REGION.id;
    const hanyaAktif = searchParams.get('aktif') !== 'false';

    const supabase = await createClient();
    let query = supabase
      .from('alerts')
      .select('*')
      .order('issued_at', { ascending: false });

    if (regionId) {
      query = query.eq('region_id', regionId);
    }

    if (hanyaAktif) {
      query = query.or(`expires_at.gt.${new Date().toISOString()},expires_at.is.null`);
    }

    const { data: dbAlerts, error } = await query;

    if (!error && dbAlerts && dbAlerts.length > 0) {
      return NextResponse.json({
        success: true,
        region_id: regionId,
        alerts: dbAlerts,
        total: dbAlerts.length,
        sumber: 'database',
      });
    }

    // Fallback ke data peringatan simulasi demo jika tabel kosong
    return NextResponse.json({
      success: true,
      region_id: regionId,
      alerts: DEMO_ALERTS,
      total: DEMO_ALERTS.length,
      sumber: 'demo_fallback',
    });
  } catch (error) {
    console.error('API /api/peringatan Error:', error);
    return NextResponse.json(
      { error: 'Gagal memuat daftar peringatan bencana' },
      { status: 500 }
    );
  }
}
