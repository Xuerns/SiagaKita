import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getBMKGWeather } from '@/lib/bmkg';
import { DEMO_REGION } from '@/lib/data/demo';

export async function GET(request: NextRequest) {
  try {
    // Verifikasi CRON_SECRET
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

    const adm4 = searchParams.get('adm4') || '32.71.01.1001';
    const bmkgData = await getBMKGWeather(adm4);

    const adminClient = createAdminClient();
    const condition = bmkgData.weather.condition;

    let alertCreated = null;
    // Jika BMKG mendeteksi Hujan Lebat / Hujan Petir / Ekstrem
    if (condition.includes('Lebat') || condition.includes('Petir')) {
      const alertPayload = {
        sumber: 'bmkg',
        hazard: 'cuaca_ekstrem',
        level: condition.includes('Petir') ? 'siaga' : 'waspada',
        region_id: DEMO_REGION.id,
        apa: `Peringatan Dini Cuaca BMKG: ${condition}`,
        di_mana: bmkgData.weather.location,
        seberapa_parah: `Potensi hujan intensitas tinggi disertai angin kencang (${bmkgData.weather.windSpeed} km/j).`,
        lakukan_ini: 'Hindari berteduh di bawah pohon rindang/reklame dan waspadai genangan air mendadak.',
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
        raw: { bmkg_weather: bmkgData.weather },
      };

      const { data } = await adminClient.from('alerts').insert(alertPayload).select().maybeSingle();
      alertCreated = data;
    }

    return NextResponse.json({
      success: true,
      message: 'Sinkronisasi peringatan cuaca BMKG selesai.',
      weather: bmkgData.weather,
      alert_dibuat: alertCreated,
    });
  } catch (error) {
    console.error('API /api/cron/peringatan Error:', error);
    return NextResponse.json(
      { error: 'Gagal melakukan sinkronisasi peringatan BMKG' },
      { status: 500 }
    );
  }
}
