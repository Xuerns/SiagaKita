import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: vi.fn((table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          region_id: '11111111-1111-1111-1111-111111111111',
          hazard: 'banjir',
          skor: 78,
          level: 'awas',
          faktor: { h24: 150, h3: 300 },
          computed_at: new Date().toISOString(),
        },
        error: null,
      }),
    })),
  })),
}));

import { GET as getRisikoHandler } from '@/app/api/risiko/route';
import { GET as getPeringatanHandler } from '@/app/api/peringatan/route';

describe('Risiko & Peringatan API (/api/risiko & /api/peringatan)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // GET /api/risiko
  // ==========================================
  describe('GET /api/risiko', () => {
    it('Good Route: Berhasil mengambil skor risiko dari database', async () => {
      const req = new NextRequest('http://localhost:3000/api/risiko', {
        method: 'GET',
      });

      const res = await getRisikoHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.hazard).toBe('banjir');
      expect(json.skor).toBeDefined();
      expect(json.level).toBeDefined();
    });

    it('Good Route: Berhasil menghitung skor risiko dengan parameter simulasi demo', async () => {
      const req = new NextRequest('http://localhost:3000/api/risiko?h24=150&h3=280&muka_air=80', {
        method: 'GET',
      });

      const res = await getRisikoHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.sumber).toBe('simulasi');
      expect(json.skor).toBeGreaterThan(60); // Hujan ekstrem memicu skor tinggi
      expect(json.rekomendasi).toBeDefined();
    });
  });

  // ==========================================
  // GET /api/peringatan
  // ==========================================
  describe('GET /api/peringatan', () => {
    it('Good Route: Berhasil memuat daftar peringatan aktif wilayah', async () => {
      const req = new NextRequest('http://localhost:3000/api/peringatan?aktif=true', {
        method: 'GET',
      });

      const res = await getPeringatanHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.alerts)).toBe(true);
      expect(json.alerts.length).toBeGreaterThan(0);
    });
  });
});
