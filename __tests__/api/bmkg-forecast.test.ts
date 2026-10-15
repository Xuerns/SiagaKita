import { describe, it, expect } from 'vitest';
import { parseBMKGWeatherData, mapWmoToCondition, BMKGResponse } from '@/lib/bmkg';
import { getDynamicForecast5Days } from '@/data/mockDisasterData';

describe('BMKG Weather & 5-Day Forecast Processor', () => {
  it('Memetakan kode WMO ke kondisi cuaca berbahasa Indonesia secara akurat', () => {
    expect(mapWmoToCondition(0).condition).toBe('Cerah');
    expect(mapWmoToCondition(1).condition).toBe('Cerah Berawan');
    expect(mapWmoToCondition(3).condition).toBe('Berawan');
    expect(mapWmoToCondition(61).condition).toBe('Hujan Ringan');
    expect(mapWmoToCondition(63).condition).toBe('Hujan Sedang');
    expect(mapWmoToCondition(95).condition).toBe('Hujan Petir');
  });

  it('Menghasilkan 5 hari berturut-turut yang valid tanpa tanggal duplikat dari respons BMKG 3 harian', () => {
    // Simulasi data 3 hari dari API BMKG (struktur asli BMKG)
    const mockBMKGPayload: BMKGResponse = {
      lokasi: {
        kotkab: 'Kota Bogor',
        kecamatan: 'Bogor Selatan',
        lat: -6.6216,
        lon: 106.8087,
      },
      data: [
        {
          cuaca: [
            // Hari 1: 15 Okt 2026
            [
              {
                local_datetime: '2026-10-15 13:00:00',
                t: 29,
                weather_desc: 'Cerah Berawan',
                hu: 65,
                ws: 5,
                tp: 0,
              },
              {
                local_datetime: '2026-10-15 19:00:00',
                t: 25,
                weather_desc: 'Berawan',
                hu: 75,
                ws: 4,
                tp: 0,
              },
            ],
            // Hari 2: 16 Okt 2026
            [
              {
                local_datetime: '2026-10-16 07:00:00',
                t: 23,
                weather_desc: 'Cerah Berawan',
                hu: 80,
                ws: 3,
                tp: 0,
              },
              {
                local_datetime: '2026-10-16 13:00:00',
                t: 31,
                weather_desc: 'Hujan Ringan',
                hu: 70,
                ws: 5,
                tp: 2.5,
              },
            ],
            // Hari 3: 17 Okt 2026
            [
              {
                local_datetime: '2026-10-17 07:00:00',
                t: 22,
                weather_desc: 'Berawan',
                hu: 85,
                ws: 3,
                tp: 0,
              },
              {
                local_datetime: '2026-10-17 13:00:00',
                t: 28,
                weather_desc: 'Hujan Sedang',
                hu: 80,
                ws: 6,
                tp: 5,
              },
            ],
          ],
        },
      ],
    };

    const parsed = parseBMKGWeatherData(mockBMKGPayload);

    // Harus tepat 5 hari
    expect(parsed.forecast).toHaveLength(5);

    // Hari 1: Hari ini (15 Okt)
    expect(parsed.forecast[0].dayName).toBe('Hari ini');
    expect(parsed.forecast[0].dateStr).toBe('15 Okt');

    // Hari 2: Jum (16 Okt)
    expect(parsed.forecast[1].dayName).toBe('Jum');
    expect(parsed.forecast[1].dateStr).toBe('16 Okt');

    // Hari 3: Sab (17 Okt)
    expect(parsed.forecast[2].dayName).toBe('Sab');
    expect(parsed.forecast[2].dateStr).toBe('17 Okt');

    // Hari 4: Min (18 Okt) - Tidak boleh 'Kam' atau tanggal duplikat '17 Okt'
    expect(parsed.forecast[3].dayName).toBe('Min');
    expect(parsed.forecast[3].dateStr).toBe('18 Okt');

    // Hari 5: Sen (19 Okt)
    expect(parsed.forecast[4].dayName).toBe('Sen');
    expect(parsed.forecast[4].dateStr).toBe('19 Okt');

    // Pastikan semua tanggal unik
    const dateStrings = parsed.forecast.map((f) => f.dateStr);
    const uniqueDates = new Set(dateStrings);
    expect(uniqueDates.size).toBe(5);
  });

  it('getDynamicForecast5Days menghasilkan 5 hari berurutan dari tanggal acuan yang diberikan', () => {
    const baseDate = new Date(2026, 9, 15); // 15 Okt 2026
    const dynamicForecast = getDynamicForecast5Days(baseDate);

    expect(dynamicForecast).toHaveLength(5);
    expect(dynamicForecast[0].dayName).toBe('Hari ini');
    expect(dynamicForecast[0].dateStr).toBe('15 Okt');
    expect(dynamicForecast[1].dayName).toBe('Jum');
    expect(dynamicForecast[1].dateStr).toBe('16 Okt');
    expect(dynamicForecast[2].dayName).toBe('Sab');
    expect(dynamicForecast[2].dateStr).toBe('17 Okt');
    expect(dynamicForecast[3].dayName).toBe('Min');
    expect(dynamicForecast[3].dateStr).toBe('18 Okt');
    expect(dynamicForecast[4].dayName).toBe('Sen');
    expect(dynamicForecast[4].dateStr).toBe('19 Okt');
  });
});
