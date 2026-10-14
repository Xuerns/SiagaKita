import { NextRequest, NextResponse } from 'next/server';
import { connection } from 'next/server';
import { hitungSkorBanjir } from '@/lib/risiko';
import { DEMO_REGION } from '@/lib/data/demo';

export async function GET(request: NextRequest) {
  await connection();
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id') || DEMO_REGION.id;

    // Parameter simulasi (jika dikirim oleh demo)
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
    });
  } catch (error) {
    console.error('API /api/risiko Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghitung skor risiko' },
      { status: 500 }
    );
  }
}
