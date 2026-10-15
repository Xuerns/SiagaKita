import { getBMKGWeather, findClosestBMKGRegion } from './bmkg';

export interface WeatherRainData {
  h24: number;
  h3: number;
  source: 'open-meteo' | 'bmkg' | 'fallback';
}

/**
 * Mengambil data akumulasi curah hujan 24 jam dan 3 hari dari Open-Meteo atau BMKG.
 */
export async function getRainfallData(lat: number, lng: number): Promise<WeatherRainData> {
  // 1. Coba Open-Meteo API terlebih dahulu
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=precipitation_sum&hourly=precipitation&timezone=Asia%2FJakarta&forecast_days=3`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 600 },
    });

    if (res.ok) {
      const data = await res.json();
      const dailySum: number[] = data.daily?.precipitation_sum || [];
      const hourlyRain: number[] = data.hourly?.precipitation || [];

      // Akumulasi 24 jam pertama
      const h24 = hourlyRain.length >= 24
        ? Math.round(hourlyRain.slice(0, 24).reduce((a, b) => a + (b || 0), 0) * 10) / 10
        : Math.round((dailySum[0] || 0) * 10) / 10;

      // Akumulasi 3 hari
      const h3 = dailySum.length > 0
        ? Math.round(dailySum.slice(0, 3).reduce((a, b) => a + (b || 0), 0) * 10) / 10
        : Math.round(h24 * 2.5);

      return {
        h24: Math.max(0, h24),
        h3: Math.max(h24, h3),
        source: 'open-meteo',
      };
    }
  } catch (err) {
    console.warn('Gagal mengambil data hujan dari Open-Meteo, mencoba BMKG:', err);
  }

  // 2. Fallback ke BMKG API jika Open-Meteo tidak tersedia
  try {
    const { region } = findClosestBMKGRegion(lat, lng);
    const bmkgResult = await getBMKGWeather(region.adm4);

    if (bmkgResult.source === 'BMKG') {
      const currentRain = bmkgResult.weather.precipitationMm || 0;
      // Estimasi akumulasi berdasarkan cuaca dan probabilitas hujan perkiraan 3 hari
      const rainChances = bmkgResult.forecast.slice(0, 3).map((f) => f.rainChance || 0);
      const avgRainChance = rainChances.reduce((a, b) => a + b, 0) / (rainChances.length || 1);

      const estimatedH24 = currentRain > 0 ? currentRain * 8 : Math.round(avgRainChance * 0.8);
      const estimatedH3 = Math.round(estimatedH24 * 2.2);

      return {
        h24: estimatedH24,
        h3: estimatedH3,
        source: 'bmkg',
      };
    }
  } catch (err) {
    console.warn('Gagal mengambil data hujan dari BMKG:', err);
  }

  // 3. Fallback terakhir ke data simulasi kondisional jika kedua provider jaringan offline
  return {
    h24: 85,
    h3: 175,
    source: 'fallback',
  };
}
