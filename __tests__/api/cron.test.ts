import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockInsert = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({
    maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'alert-1' }, error: null }),
  }),
});

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      select: vi.fn().mockResolvedValue({
        data: [{ id: 'reg-1', nama: 'Kampung Melayu', kerentanan_banjir: 85 }],
        error: null,
      }),
      insert: mockInsert,
      update: vi.fn().mockReturnValue({
        lt: vi.fn().mockReturnValue({
          neq: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: 'rep-old' }], error: null }),
          }),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        like: vi.fn().mockReturnValue({
          lt: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: 'guest-old-1' }], error: null }),
          }),
        }),
      }),
    })),
    auth: {
      admin: {
        deleteUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
      },
    },
  })),
}));

vi.mock('@/lib/weather-ingest', () => ({
  getRainfallData: vi.fn().mockResolvedValue({
    h24: 120, // Hujan lebat memicu level Siaga/Awas
    h3: 240,
    source: 'open-meteo',
  }),
}));

vi.mock('@/lib/bmkg', () => ({
  getBMKGWeather: vi.fn().mockResolvedValue({
    weather: {
      temp: 26,
      condition: 'Hujan Petir',
      location: 'Bogor Selatan',
      windSpeed: 15,
      precipitationMm: 35,
    },
    forecast: [],
    source: 'BMKG',
  }),
}));

import { GET as cronGetHandler, POST as cronPostHandler } from '@/app/api/cron/risiko/route';

describe('Cron Ingest Cuaca & Risiko API (/api/cron/risiko)', () => {
  const TEST_SECRET = 'test-cron-secret-123';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = TEST_SECRET;
  });

  it('Good Route: Berhasil dijalankan dengan token secret di query parameter', async () => {
    const req = new NextRequest(`http://localhost:3000/api/cron/risiko?secret=${TEST_SECRET}`, {
      method: 'GET',
    });

    const res = await cronGetHandler(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.wilayah_diproses).toBeGreaterThan(0);
    expect(json.hasil[0].level).toBeDefined();
  });

  it('Good Route: Berhasil dijalankan melalui Authorization Bearer header', async () => {
    const req = new NextRequest('http://localhost:3000/api/cron/risiko', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${TEST_SECRET}`,
      },
    });

    const res = await cronPostHandler(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it('Bad Route: Ditolak dengan 401 jika secret tidak disertakan', async () => {
    const req = new NextRequest('http://localhost:3000/api/cron/risiko', {
      method: 'GET',
    });

    const res = await cronGetHandler(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toContain('Unauthorized');
  });

  it('Bad Route: Ditolak dengan 401 jika secret salah', async () => {
    const req = new NextRequest('http://localhost:3000/api/cron/risiko?secret=wrong-secret', {
      method: 'GET',
    });

    const res = await cronGetHandler(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toContain('Unauthorized');
  });

  // ==========================================
  // GET /api/cron/peringatan
  // ==========================================
  describe('GET /api/cron/peringatan', () => {
    it('Good Route: Berhasil memproses peringatan cuaca BMKG dengan token secret', async () => {
      const { GET: cronPeringatanHandler } = await import('@/app/api/cron/peringatan/route');

      const req = new NextRequest(`http://localhost:3000/api/cron/peringatan?secret=${TEST_SECRET}`, {
        method: 'GET',
      });

      const res = await cronPeringatanHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it('Bad Route: Ditolak dengan 401 jika secret tidak disertakan', async () => {
      const { GET: cronPeringatanHandler } = await import('@/app/api/cron/peringatan/route');

      const req = new NextRequest('http://localhost:3000/api/cron/peringatan', {
        method: 'GET',
      });

      const res = await cronPeringatanHandler(req);
      expect(res.status).toBe(401);
    });
  });

  // ==========================================
  // GET /api/cron/bersih
  // ==========================================
  describe('GET /api/cron/bersih', () => {
    it('Good Route: Berhasil membersihkan laporan kedaluwarsa dan akun tamu lama (> 7 hari)', async () => {
      const { GET: cronBersihHandler } = await import('@/app/api/cron/bersih/route');

      const req = new NextRequest(`http://localhost:3000/api/cron/bersih?secret=${TEST_SECRET}`, {
        method: 'GET',
      });

      const res = await cronBersihHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.total_dibersihkan).toBeDefined();
      expect(json.total_laporan_dibersihkan).toBe(1);
      expect(json.total_tamu_dibersihkan).toBe(1);
      expect(json.guest_retention_days).toBe(7);
    });

    it('Good Route: Mengizinkan kustomisasi rentang hari retensi tamu (?guest_days=14)', async () => {
      const { GET: cronBersihHandler } = await import('@/app/api/cron/bersih/route');

      const req = new NextRequest(`http://localhost:3000/api/cron/bersih?secret=${TEST_SECRET}&guest_days=14`, {
        method: 'GET',
      });

      const res = await cronBersihHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.guest_retention_days).toBe(14);
    });

    it('Bad Route: Ditolak dengan 401 jika secret tidak disertakan', async () => {
      const { GET: cronBersihHandler } = await import('@/app/api/cron/bersih/route');

      const req = new NextRequest('http://localhost:3000/api/cron/bersih', {
        method: 'GET',
      });

      const res = await cronBersihHandler(req);
      expect(res.status).toBe(401);
    });
  });
});
