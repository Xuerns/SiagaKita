import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/bmkg', () => ({
  getBMKGWeather: vi.fn(async (adm4: string) => {
    if (adm4 === 'error-adm4') {
      throw new Error('Kode wilayah BMKG tidak ditemukan');
    }
    return {
      weather: {
        temp: 28,
        condition: 'Hujan Ringan',
        location: 'Bogor Selatan',
        forecastRange: '24° – 31°',
        source: 'BMKG',
        lastUpdated: '14 Okt 2026',
        todaySummary: { condition: 'Hujan Ringan', range: '24° – 31°', timeWindow: '06:00 – 18:00' },
      },
      forecast: [],
      source: 'BMKG',
    };
  }),
}));

import { GET as getCuacaHandler } from '@/app/api/cuaca/route';
import { GET as getEvakuasiHandler } from '@/app/api/evakuasi/route';

describe('Cuaca & Evakuasi API (/api/cuaca & /api/evakuasi)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // GET /api/cuaca
  // ==========================================
  describe('GET /api/cuaca', () => {
    it('Good Route: Berhasil memuat data cuaca BMKG dengan kode adm4 valid', async () => {
      const req = new NextRequest('http://localhost:3000/api/cuaca?adm4=32.71.01.1001', {
        method: 'GET',
      });

      const res = await getCuacaHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.weather.temp).toBe(28);
      expect(json.source).toBe('BMKG');
    });

    it('Bad Route: Menangani kegagalan saat provider BMKG error', async () => {
      const req = new NextRequest('http://localhost:3000/api/cuaca?adm4=error-adm4', {
        method: 'GET',
      });

      const res = await getCuacaHandler(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });
  });

  // ==========================================
  // GET /api/evakuasi
  // ==========================================
  describe('GET /api/evakuasi', () => {
    it('Good Route: Berhasil memuat daftar titik evakuasi untuk wilayah demo', async () => {
      const req = new NextRequest('http://localhost:3000/api/evakuasi', {
        method: 'GET',
      });

      const res = await getEvakuasiHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.region_id).toBeDefined();
      expect(Array.isArray(json.titik_evakuasi)).toBe(true);
      expect(json.titik_evakuasi.length).toBeGreaterThan(0);
      expect(json.titik_evakuasi[0].nama).toBeDefined();
    });
  });
});
