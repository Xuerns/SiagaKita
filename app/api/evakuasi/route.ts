import { NextRequest, NextResponse } from 'next/server';
import { connection } from 'next/server';
import { DEMO_EVACUATION_POINTS, DEMO_REGION } from '@/lib/data/demo';

export async function GET(request: NextRequest) {
  await connection();
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id') || DEMO_REGION.id;

    return NextResponse.json({
      region_id: regionId,
      titik_evakuasi: DEMO_EVACUATION_POINTS,
      total: DEMO_EVACUATION_POINTS.length,
      diunduh_pada: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API /api/evakuasi Error:', error);
    return NextResponse.json(
      { error: 'Gagal memuat data titik evakuasi' },
      { status: 500 }
    );
  }
}
