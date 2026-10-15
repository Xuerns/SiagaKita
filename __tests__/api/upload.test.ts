import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockGetUser = vi.fn();
const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })),
    },
  })),
}));

import { POST as uploadHandler } from '@/app/api/upload/route';

describe('Photo Upload API (/api/upload)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false';

    // Default authenticated user
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-reporter-1' } },
      error: null,
    });

    mockUpload.mockResolvedValue({ error: null });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://storage.supabase.co/object/public/report-photos/reports/photo.webp' },
    });
  });

  // ==========================================
  // GOOD ROUTES
  // ==========================================
  describe('Good Routes (Sukses)', () => {
    it('berhasil mengunggah file WebP via multipart/form-data dan mengembalikan URL publik', async () => {
      const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
      const fileContent = 'RIFF....WEBPVP8 ...fake-image-bytes';
      
      const formData = new FormData();
      const blob = new Blob([fileContent], { type: 'image/webp' });
      formData.append('file', blob, 'kondisi_lapangan.webp');

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const response = await uploadHandler(request);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.url).toContain('https://storage.supabase.co');
      expect(json.mimeType).toBe('image/webp');
      expect(mockUpload).toHaveBeenCalledTimes(1);
    });

    it('berhasil mengunggah via JSON Data URI (Base64 WebP)', async () => {
      // 1x1 pixel WebP Base64 valid
      const validWebpBase64 =
        'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoBAAEAAQAcJaACdLoAAP7/2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: validWebpBase64,
          fileName: 'foto-banjir.webp',
        }),
      });

      const response = await uploadHandler(request);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.url).toContain('https://storage.supabase.co');
    });

    it('memberikan fallback data URI jika terjadi error storage saat mode demo aktif', async () => {
      process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
      mockUpload.mockResolvedValue({
        error: { message: 'Bucket not found on remote storage' },
      });

      const validWebpBase64 =
        'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoBAAEAAQAcJaACdLoAAP7/2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: validWebpBase64,
        }),
      });

      const response = await uploadHandler(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.storage).toBe('fallback_data_uri');
      expect(json.url).toContain('data:image/webp;base64');
    });
  });

  // ==========================================
  // BAD ROUTES
  // ==========================================
  describe('Bad Routes (Gagal / Validasi / Error)', () => {
    it('menolak (401) jika pengguna belum login dan demo mode nonaktif', async () => {
      process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const formData = new FormData();
      formData.append('file', new Blob(['fake'], { type: 'image/webp' }), 'foto.webp');

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const response = await uploadHandler(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toContain('Harap masuk terlebih dahulu');
    });

    it('menolak (400) file dengan format tidak diizinkan (misal PDF atau dokumen)', async () => {
      const formData = new FormData();
      formData.append(
        'file',
        new Blob(['%PDF-1.4...'], { type: 'application/pdf' }),
        'laporan.pdf'
      );

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const response = await uploadHandler(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toContain('Format file application/pdf tidak didukung');
    });

    it('menolak (400) jika ukuran file melebihi 5 MB', async () => {
      // 5.5 MB payload
      const largeBuffer = new Uint8Array(5.5 * 1024 * 1024);
      const formData = new FormData();
      formData.append(
        'file',
        new Blob([largeBuffer], { type: 'image/webp' }),
        'foto_raksasa.webp'
      );

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const response = await uploadHandler(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toContain('melebihi batas maksimal 5 MB');
    });

    it('menolak (400) jika payload JSON tidak memiliki field file', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherField: 'invalid' }),
      });

      const response = await uploadHandler(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toContain('Kirimkan field "file"');
    });

    it('menangani (500) jika Supabase Storage gagal upload dan bukan mode demo', async () => {
      process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
      mockUpload.mockResolvedValue({
        error: { message: 'Internal S3 connection timeout' },
      });

      const validWebpBase64 =
        'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoBAAEAAQAcJaACdLoAAP7/2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: validWebpBase64 }),
      });

      const response = await uploadHandler(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.error).toContain('Gagal mengunggah foto ke storage');
    });
  });
});
