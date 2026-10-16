import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockGetUser = vi.fn();
const mockAdminInsert = vi.fn();
const mockAdminUpdate = vi.fn();
const mockAdminSelect = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'rep-1',
            user_id: 'other-user',
            tipe: 'Banjir',
            deskripsi: 'Air naik 30cm',
            foto_urls: ['https://example.com/foto.jpg'],
            status: 'belum_terverifikasi',
            konfirmasi_count: 1,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 3600000).toISOString(),
          },
        ],
        error: null,
      }),
      in: vi.fn().mockResolvedValue({ data: [{ id: 'other-user', nama: 'Siti' }], error: null }),
    })),
  })),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      insert: mockAdminInsert,
      update: mockAdminUpdate,
      select: mockAdminSelect,
    })),
  })),
}));

import { GET as getReportsHandler, POST as createReportHandler } from '@/app/api/laporan/route';
import { POST as confirmReportHandler } from '@/app/api/laporan/[id]/konfirmasi/route';

describe('Community Reports API (/api/laporan & konfirmasi)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // GET /api/laporan
  // ==========================================
  describe('GET /api/laporan', () => {
    it('Good Route: Berhasil memuat daftar laporan dengan koordinat yang disamarkan', async () => {
      const req = new NextRequest('http://localhost:3000/api/laporan?lat=-6.234&lng=106.864&radius_km=5', {
        method: 'GET',
      });

      const res = await getReportsHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.reports)).toBe(true);
      if (json.reports.length > 0) {
        expect(json.reports[0].lat).toBeDefined();
        // Memastikan koordinat dibulatkan maksimal 3 desimal
        expect(String(json.reports[0].lat).split('.')[1]?.length ?? 0).toBeLessThanOrEqual(3);
      }
    });
    it('Good Route: Mengembalikan array kosong jika laporan di DB telah dihapus (tidak fallback ke data demo)', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValueOnce({
        auth: { getUser: mockGetUser },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          neq: vi.fn().mockReturnThis(),
          gt: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        })),
      });

      const req = new NextRequest('http://localhost:3000/api/laporan', {
        method: 'GET',
      });

      const res = await getReportsHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.reports).toEqual([]);
      expect(json.total).toBe(0);
    });

    it('Good Route: Berhasil mem-parsing koordinat presisi dari PostGIS geom', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValueOnce({
        auth: { getUser: mockGetUser },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          neq: vi.fn().mockReturnThis(),
          gt: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'rep-bandung-1',
                user_id: 'user-bandung',
                tipe: 'Banjir',
                deskripsi: 'Banjir di Pasteur Bandung',
                foto_urls: [],
                geom: 'SRID=4326;POINT(107.6098 -6.9175)',
                status: 'belum_terverifikasi',
                konfirmasi_count: 0,
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 3600000).toISOString(),
              },
            ],
            error: null,
          }),
          in: vi.fn().mockResolvedValue({ data: [{ id: 'user-bandung', nama: 'Asep' }], error: null }),
        })),
      });

      const req = new NextRequest('http://localhost:3000/api/laporan', {
        method: 'GET',
      });

      const res = await getReportsHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.reports.length).toBe(1);
      expect(json.reports[0].lat).toBe(-6.917);
      expect(json.reports[0].lng).toBe(107.61);
    });
  });

  // ==========================================
  // POST /api/laporan
  // ==========================================
  describe('POST /api/laporan', () => {
    it('Good Route: Pengguna terautentikasi berhasil membuat laporan valid', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'user-reporter-1' } },
        error: null,
      });

      mockAdminInsert.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'rep-new-123',
              tipe: 'Banjir',
              deskripsi: 'Genangan air',
              foto_urls: [],
              status: 'belum_terverifikasi',
              konfirmasi_count: 0,
              created_at: new Date().toISOString(),
              expires_at: new Date().toISOString(),
            },
            error: null,
          }),
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipe: 'Banjir',
          deskripsi: 'Genangan setinggi mata kaki',
          foto_urls: ['https://example.com/valid-image.jpg'],
          lat: -6.234,
          lng: 106.864,
        }),
      });

      const res = await createReportHandler(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.report.tipe).toBe('Banjir');
    });

    it('Bad Route: Ditolak dengan 401 jika pengguna belum masuk', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Unauthorized' },
      });

      const req = new NextRequest('http://localhost:3000/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipe: 'Banjir',
          lat: -6.234,
          lng: 106.864,
        }),
      });

      const res = await createReportHandler(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toContain('Harap masuk terlebih dahulu');
    });

    it('Bad Route: Ditolak dengan 401 jika pengguna dalam mode tamu (is_anonymous: true)', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'guest-12345', is_anonymous: true } },
        error: null,
      });

      const req = new NextRequest('http://localhost:3000/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipe: 'Banjir',
          lat: -6.234,
          lng: 106.864,
        }),
      });

      const res = await createReportHandler(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toContain('Mode tamu tidak diizinkan membuat laporan');
    });

    it('Bad Route: Ditolak dengan 400 jika koordinat tidak valid', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'user-reporter-1' } },
        error: null,
      });

      const req = new NextRequest('http://localhost:3000/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipe: 'Banjir',
          lat: 999, // Latitude tidak valid (> 90)
          lng: 106.864,
        }),
      });

      const res = await createReportHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('latitude');
    });

    it('Bad Route: Ditolak dengan 400 jika format foto bukan gambar yang diizinkan', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'user-reporter-1' } },
        error: null,
      });

      const req = new NextRequest('http://localhost:3000/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipe: 'Banjir',
          foto_urls: ['data:application/pdf;base64,JVBERi0xLjQK...'], // PDF dilarang
          lat: -6.234,
          lng: 106.864,
        }),
      });

      const res = await createReportHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('JPEG, PNG, atau WebP');
    });
  });

  // ==========================================
  // POST /api/laporan/[id]/konfirmasi
  // ==========================================
  describe('POST /api/laporan/[id]/konfirmasi', () => {
    it('Good Route: Berhasil konfirmasi dan auto-verifikasi jika mencapai 3 suara', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'user-voter-2' } },
        error: null,
      });

      mockAdminSelect
        // Cek laporan: pemilik adalah user lain, konfirmasi saat ini = 2
        .mockReturnValueOnce({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: { id: 'rep-1', user_id: 'user-author-1', konfirmasi_count: 2, status: 'belum_terverifikasi' },
            error: null,
          }),
        })
        // Cek existing vote: belum pernah vote
        .mockReturnValueOnce({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: null,
            error: null,
          }),
        });

      mockAdminInsert.mockResolvedValueOnce({ error: null });
      mockAdminUpdate.mockReturnValueOnce({ eq: vi.fn().mockResolvedValueOnce({ error: null }) });

      const req = new NextRequest('http://localhost:3000/api/laporan/rep-1/konfirmasi', {
        method: 'POST',
        body: JSON.stringify({ vote: 1 }),
      });

      const res = await confirmReportHandler(req, { params: Promise.resolve({ id: 'rep-1' }) });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.konfirmasi_count).toBe(3);
      expect(json.status).toBe('terverifikasi');
    });

    it('Bad Route: Ditolak dengan 400 jika pembuat laporan mencoba mengonfirmasi laporannya sendiri', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'user-author-1' } },
        error: null,
      });

      mockAdminSelect.mockReturnValueOnce({
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValueOnce({
          data: { id: 'rep-1', user_id: 'user-author-1', konfirmasi_count: 1 },
          error: null,
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/laporan/rep-1/konfirmasi', {
        method: 'POST',
      });

      const res = await confirmReportHandler(req, { params: Promise.resolve({ id: 'rep-1' }) });
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('tidak dapat mengonfirmasi laporan yang Anda buat sendiri');
    });

    it('Bad Route: Ditolak dengan 409 jika pengguna sudah pernah memberikan suara', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'user-voter-2' } },
        error: null,
      });

      mockAdminSelect
        .mockReturnValueOnce({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: { id: 'rep-1', user_id: 'user-author-1' },
            error: null,
          }),
        })
        .mockReturnValueOnce({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValueOnce({
            data: { report_id: 'rep-1', user_id: 'user-voter-2' }, // Sudah pernah vote
            error: null,
          }),
        });

      const req = new NextRequest('http://localhost:3000/api/laporan/rep-1/konfirmasi', {
        method: 'POST',
      });

      const res = await confirmReportHandler(req, { params: Promise.resolve({ id: 'rep-1' }) });
      const json = await res.json();

      expect(res.status).toBe(409);
    });
  });

  // ==========================================
  // PATCH /api/laporan/[id] (Moderasi Pemilik Laporan)
  // ==========================================
  describe('PATCH /api/laporan/[id] (Moderasi)', () => {
    it('Good Route: Pemilik laporan berhasil memperbarui status laporannya', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'warga-pemilik' } },
        error: null,
      });

      mockAdminSelect.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValueOnce({
          data: { id: 'rep-1', user_id: 'warga-pemilik' },
          error: null,
        }),
      });

      mockAdminUpdate.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
      });

      const { PATCH: moderateReportHandler } = await import('@/app/api/laporan/[id]/route');

      const req = new NextRequest('http://localhost:3000/api/laporan/rep-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'disembunyikan', alasan: 'Situasi sudah kondusif' }),
      });

      const res = await moderateReportHandler(req, { params: Promise.resolve({ id: 'rep-1' }) });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.status).toBe('disembunyikan');
    });

    it('Bad Route: Pengguna lain ditolak 403 saat mencoba memoderasi laporan bukan miliknya', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'warga-lain' } },
        error: null,
      });

      mockAdminSelect.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValueOnce({
          data: { id: 'rep-1', user_id: 'warga-pemilik' },
          error: null,
        }),
      });

      const { PATCH: moderateReportHandler } = await import('@/app/api/laporan/[id]/route');

      const req = new NextRequest('http://localhost:3000/api/laporan/rep-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'disembunyikan' }),
      });

      const res = await moderateReportHandler(req, { params: Promise.resolve({ id: 'rep-1' }) });
      const json = await res.json();

      expect(res.status).toBe(403);
      expect(json.error).toContain('Akses ditolak');
    });
  });
});
