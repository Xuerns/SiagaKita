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
    let gempaAlertCreated = null;

    // 1. Sinkronisasi Cuaca Ekstrem BMKG
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

    // 2. Sinkronisasi Gempa BMKG Real-Time
    try {
      const { getBMKGLatestEarthquake } = await import('@/lib/gempa');
      const { data: gempaData } = await getBMKGLatestEarthquake();

      // Buat peringatan jika gempa berstatus waspada/siaga/awas (M >= 5.0 atau potensi tsunami)
      if (gempaData.level !== 'Aman' || gempaData.magnitude >= 5.0) {
        const gempaPayload = {
          sumber: 'bmkg',
          hazard: 'gempa',
          level: gempaData.level.toLowerCase(),
          region_id: DEMO_REGION.id,
          apa: gempaData.rekomendasi.apa,
          di_mana: gempaData.rekomendasi.di_mana,
          seberapa_parah: gempaData.rekomendasi.seberapa_parah,
          lakukan_ini: gempaData.rekomendasi.lakukan_ini.join(' '),
          issued_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
          raw: { bmkg_gempa: gempaData },
        };

        const { data: gData } = await adminClient.from('alerts').insert(gempaPayload).select().maybeSingle();
        gempaAlertCreated = gData;
      }
    } catch (gErr) {
      console.warn('Gagal sinkronisasi gempa pada cron peringatan:', gErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Sinkronisasi peringatan cuaca & gempa BMKG selesai.',
      weather: bmkgData.weather,
      alert_dibuat: alertCreated,
      gempa_alert_dibuat: gempaAlertCreated,
    });
  } catch (error) {
    console.error('API /api/cron/peringatan Error:', error);
    return NextResponse.json(
      { error: 'Gagal melakukan sinkronisasi peringatan BMKG' },
      { status: 500 }
    );
  }
}
