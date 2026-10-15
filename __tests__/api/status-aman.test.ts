import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockGetUser = vi.fn();
const mockAdminUpsert = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
      signInAnonymously: vi.fn().mockResolvedValue({
        data: { user: { id: 'anon-emergency-user' } },
        error: null,
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { status: 'aman', catatan: 'Di posko aman' },
        error: null,
      }),
    })),
  })),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: mockAdminUpsert,
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ count: 12, error: null }),
      }),
    })),
  })),
}));

import { GET as getSafetyHandler, POST as postSafetyHandler } from '@/app/api/status-aman/route';

describe('Safety Status API (/api/status-aman)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // GET /api/status-aman
  // ==========================================
  describe('GET /api/status-aman', () => {
    it('Good Route: Berhasil mengambil status pengguna dan ringkasan agregat', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'u-123' } },
        error: null,
      });

      const res = await getSafetyHandler();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.summary).toBeDefined();
    });
  });

  // ==========================================
  // POST /api/status-aman
  // ==========================================
  describe('POST /api/status-aman', () => {
    it('Good Route: Berhasil mencatat status aman dengan koordinat', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'u-123' } },
        error: null,
      });
      mockAdminUpsert.mockResolvedValueOnce({ error: null });

      const req = new NextRequest('http://localhost:3000/api/status-aman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'aman',
          lat: -6.234567,
          lng: 106.864321,
          catatan: 'Sudah di shelter posko RW 03',
        }),
      });

      const res = await postSafetyHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.status).toBe('aman');
      // Memastikan koordinat dikaburkan ke 3 desimal untuk privasi
      expect(json.lat).toBe(-6.235);
    });

    it('Good Route: Berhasil mencatat panggilan butuh bantuan darurat', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'u-123' } },
        error: null,
      });
      mockAdminUpsert.mockResolvedValueOnce({ error: null });

      const req = new NextRequest('http://localhost:3000/api/status-aman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'butuh_bantuan',
          catatan: 'Lansia butuh perahu karet',
        }),
      });

      const res = await postSafetyHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.status).toBe('butuh_bantuan');
      expect(json.pesan).toContain('DARURAT');
    });

    it('Bad Route: Ditolak dengan 400 jika status bukan "aman" atau "butuh_bantuan"', async () => {
      const req = new NextRequest('http://localhost:3000/api/status-aman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'invalid_status_value',
        }),
      });

      const res = await postSafetyHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBeDefined();
    });
  });
});
