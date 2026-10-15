import { NextRequest, NextResponse } from 'next/server';
import { connection } from 'next/server';
import { 
  getBMKGLatestEarthquake, 
  getBMKGRecentFeltEarthquakes 
} from '@/lib/gempa';
import { INDONESIA_REGIONS } from '@/lib/bmkg';

export async function GET(request: NextRequest) {
  try {
    await connection();
  } catch {
    // Mengabaikan error saat dijalankan di lingkungan pengujian (unit test)
  }

  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng') || searchParams.get('lon');
    const locationParam = searchParams.get('location');
    const type = searchParams.get('type') || 'latest'; // 'latest' | 'felt' | 'all'

    let userLat: number | undefined;
    let userLng: number | undefined;
    let locationName: string | undefined = locationParam || undefined;

    // 1. Koordinat langsung
    if (latParam && lngParam) {
      const parsedLat = parseFloat(latParam);
      const parsedLng = parseFloat(lngParam);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        userLat = parsedLat;
        userLng = parsedLng;
      }
    }

    // 2. Jika hanya lokasi teks yang diberikan (mis. "Kota Bandung")
    if (userLat === undefined && locationParam) {
      const cleanLoc = locationParam.toLowerCase().replace(/^(kota|kab\.|kabupaten)\s+/i, '').trim();
      const matched = INDONESIA_REGIONS.find((r) => {
        const cleanR = r.name.toLowerCase().replace(/^(kota|kab\.|kabupaten)\s+/i, '').trim();
        return cleanR === cleanLoc || r.name.toLowerCase().includes(cleanLoc);
      });
      if (matched) {
        userLat = matched.lat;
        userLng = matched.lon;
        locationName = matched.name;
      }
    }

    if (type === 'felt') {
      const feltList = await getBMKGRecentFeltEarthquakes(userLat, userLng, 15);
      return NextResponse.json({
        success: true,
        source: 'BMKG',
        total: feltList.length,
        earthquakes: feltList,
        user_location: userLat !== undefined ? { name: locationName, lat: userLat, lng: userLng } : null,
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    }

    const { data: latest, source } = await getBMKGLatestEarthquake(userLat, userLng);

    let feltList = undefined;
    if (type === 'all') {
      feltList = await getBMKGRecentFeltEarthquakes(userLat, userLng, 5);
    }

    return NextResponse.json({
      success: true,
      source,
      latest,
      recent_felt: feltList,
      user_location: userLat !== undefined ? { name: locationName, lat: userLat, lng: userLng } : null,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('API /api/gempa Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data gempa bumi resmi BMKG' },
      { status: 500 }
    );
  }
}
