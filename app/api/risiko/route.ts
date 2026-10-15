import { NextRequest, NextResponse } from 'next/server';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hitungSkorBanjir, getRekomendasi } from '@/lib/risiko';
import { DEMO_REGION } from '@/lib/data/demo';

export async function GET(request: NextRequest) {
  try {
    await connection();
  } catch {
    // Mengabaikan error saat dijalankan di lingkungan pengujian (unit test)
  }
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id') || DEMO_REGION.id;

    const hasCustomH24 = searchParams.get('h24') !== null;
    const hasCustomH3 = searchParams.get('h3') !== null;

    // Jika tidak ada parameter simulasi manual, coba ambil riwayat skor terbaru dari Supabase
    if (!hasCustomH24 && !hasCustomH3) {
      try {
        const supabase = await createClient();
        const { data: latestAssessment } = await supabase
          .from('risk_assessments')
          .select('*')
          .eq('region_id', regionId)
          .order('computed_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestAssessment) {
          const { rekomendasi, tindakanCepat } = getRekomendasi(latestAssessment.level);
          return NextResponse.json({
            region_id: regionId,
            region_nama: DEMO_REGION.nama,
            hazard: latestAssessment.hazard || 'banjir',
            skor: latestAssessment.skor,
            level: latestAssessment.level,
            faktor: latestAssessment.faktor,
            data_lengkap: latestAssessment.data_lengkap ?? true,
            computed_at: latestAssessment.computed_at,
            rekomendasi,
            tindakan_cepat: tindakanCepat,
            sumber: 'database',
          });
        }
      } catch (dbErr) {
        console.warn('Gagal membaca risk_assessments dari Supabase, fallback ke kalkulasi:', dbErr);
      }
    }

    // Parameter simulasi (jika dikirim oleh demo atau fallback)
    const h24 = Number(searchParams.get('h24')) || 110;
    const h3 = Number(searchParams.get('h3')) || 210;
    const mukaAir = searchParams.get('muka_air') !== null ? Number(searchParams.get('muka_air')) : 75;

    const result = hitungSkorBanjir({
      hujan24jMm: h24,
      hujan3hariMm: h3,
      muka_air: mukaAir,
      kerentanan: DEMO_REGION.kerentanan_banjir,
    });

    return NextResponse.json({
      region_id: regionId,
      region_nama: DEMO_REGION.nama,
      hazard: 'banjir',
      skor: result.skor,
      level: result.level,
      faktor: result.faktor,
      data_lengkap: true,
      computed_at: new Date().toISOString(),
      rekomendasi: result.rekomendasi,
      tindakan_cepat: result.tindakanCepat,
      sumber: hasCustomH24 ? 'simulasi' : 'kalkulasi_langsung',
    });
  } catch (error) {
    console.error('API /api/risiko Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghitung skor risiko' },
      { status: 500 }
    );
  }
}
