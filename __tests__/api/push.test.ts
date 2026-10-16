import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockGetUser = vi.fn();
const mockAdminUpsert = vi.fn();
const mockAdminDelete = vi.fn();
const mockAdminSelect = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === 'push_subscriptions') {
        return {
          upsert: mockAdminUpsert,
          delete: mockAdminDelete,
          select: mockAdminSelect,
        };
      }
      return {};
    }),
  })),
}));

const mockWebPushSend = vi.fn();
vi.mock('web-push', () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn((sub, payload) => mockWebPushSend(sub, payload)),
  },
}));

import { POST as subscribeHandler, DELETE as unsubscribeHandler } from '@/app/api/push/subscribe/route';
import { sendPushNotification, sendPushToRegion } from '@/lib/push';

describe('Web Push Notification API (/api/push/subscribe) & Push Helper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = 'mock-public-key';
    process.env.VAPID_PRIVATE_KEY = 'mock-private-key';
    process.env.VAPID_SUBJECT = 'mailto:admin@siagakita.id';
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
  });

  // ==========================================
  // POST /api/push/subscribe (Good Routes)
  // ==========================================
  describe('POST /api/push/subscribe - Good Routes', () => {
    it('Good Route: Berhasil mendaftarkan langganan notifikasi push baru', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'user-push-123' } },
        error: null,
      });

      mockAdminUpsert.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({
            data: {
              id: 'sub-abc-123',
              endpoint: 'https://fcm.googleapis.com/fcm/send/abc123xyz',
              region_id: '123e4567-e89b-12d3-a456-426614174000',
              created_at: new Date().toISOString(),
            },
            error: null,
          }),
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'https://fcm.googleapis.com/fcm/send/abc123xyz',
          keys: {
            p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9t0P3oc8MlTXhgZbST3cHh8',
            auth: 'tBHItJI5svbpez7KI4CCXg',
          },
          region_id: '123e4567-e89b-12d3-a456-426614174000',
        }),
      });

      const res = await subscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.endpoint).toBe('https://fcm.googleapis.com/fcm/send/abc123xyz');
    });

    it('Good Route: Berhasil mendaftarkan langganan untuk pengguna tamu (tanpa login)', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });

      mockAdminUpsert.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({
            data: {
              id: 'sub-guest-123',
              endpoint: 'https://push.services.mozilla.com/v1/mock-endpoint',
              region_id: null,
              created_at: new Date().toISOString(),
            },
            error: null,
          }),
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'https://push.services.mozilla.com/v1/mock-endpoint',
          keys: {
            p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9t0P3oc8MlTXhgZbST3cHh8',
            auth: 'tBHItJI5svbpez7KI4CCXg',
          },
        }),
      });

      const res = await subscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });

  // ==========================================
  // POST /api/push/subscribe (Bad Routes)
  // ==========================================
  describe('POST /api/push/subscribe - Bad Routes', () => {
    it('Bad Route: Menolak jika body request bukan JSON valid', async () => {
      const req = new NextRequest('http://localhost:3000/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-not-json-string',
      });

      const res = await subscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('Format body request tidak valid');
    });

    it('Bad Route: Menolak jika format endpoint bukan URL yang valid', async () => {
      const req = new NextRequest('http://localhost:3000/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'not-a-valid-url',
          keys: {
            p256dh: 'valid-p256dh',
            auth: 'valid-auth',
          },
        }),
      });

      const res = await subscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBeDefined();
    });

    it('Bad Route: Menolak jika kunci p256dh atau auth tidak disertakan', async () => {
      const req = new NextRequest('http://localhost:3000/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
          keys: {
            p256dh: '',
            auth: '',
          },
        }),
      });

      const res = await subscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
    });

    it('Bad Route: Menolak jika format region_id bukan UUID', async () => {
      const req = new NextRequest('http://localhost:3000/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
          keys: {
            p256dh: 'some-key',
            auth: 'some-auth',
          },
          region_id: 'not-a-valid-uuid',
        }),
      });

      const res = await subscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('UUID');
    });

    it('Bad Route: Menangani kegagalan database Supabase (status 500) saat bukan demo mode', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });

      mockAdminUpsert.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({
            data: null,
            error: { message: 'Database connection timeout' },
          }),
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'https://fcm.googleapis.com/fcm/send/timeout-test',
          keys: {
            p256dh: 'some-p256dh-key',
            auth: 'some-auth-key',
          },
        }),
      });

      const res = await subscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toContain('Database connection timeout');
    });
  });

  // ==========================================
  // DELETE /api/push/subscribe
  // ==========================================
  describe('DELETE /api/push/subscribe', () => {
    it('Good Route: Berhasil menghapus langganan push melalui body request', async () => {
      mockAdminDelete.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
      });

      const req = new NextRequest('http://localhost:3000/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: 'https://fcm.googleapis.com/fcm/send/abc123xyz',
        }),
      });

      const res = await unsubscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toContain('berhasil dihentikan');
    });

    it('Good Route: Berhasil menghapus langganan push melalui query searchParams URL', async () => {
      mockAdminDelete.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
      });

      const req = new NextRequest('http://localhost:3000/api/push/subscribe?endpoint=https%3A%2F%2Ffcm.googleapis.com%2Ffcm%2Fsend%2Fquery-test', {
        method: 'DELETE',
      });

      const res = await unsubscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it('Bad Route: Menolak jika endpoint tidak disediakan', async () => {
      const req = new NextRequest('http://localhost:3000/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await unsubscribeHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBeDefined();
    });
  });

  // ==========================================
  // Push Helper: lib/push.ts
  // ==========================================
  describe('Push Helper (lib/push.ts)', () => {
    it('sendPushNotification: Berhasil mengirim notifikasi dengan webpush', async () => {
      mockWebPushSend.mockResolvedValueOnce({ statusCode: 201 });

      const res = await sendPushNotification(
        {
          endpoint: 'https://fcm.googleapis.com/fcm/send/test',
          keys: { p256dh: 'p256dh-key', auth: 'auth-key' },
        },
        {
          title: 'Siaga Banjir',
          body: 'Segera evakuasi ke tempat tinggi',
        }
      );

      expect(res.success).toBe(true);
      expect(res.statusCode).toBe(201);
      expect(mockWebPushSend).toHaveBeenCalledTimes(1);
    });

    it('sendPushNotification: Mengembalikan error jika webpush gagal mengirim', async () => {
      mockWebPushSend.mockRejectedValueOnce({
        statusCode: 410,
        message: 'Subscription has expired or is no longer valid',
      });

      const res = await sendPushNotification(
        {
          endpoint: 'https://fcm.googleapis.com/fcm/send/expired',
          keys: { p256dh: 'p256dh-key', auth: 'auth-key' },
        },
        {
          title: 'Test Error',
          body: 'Test Body',
        }
      );

      expect(res.success).toBe(false);
      expect(res.statusCode).toBe(410);
      expect(res.error).toContain('Subscription has expired');
    });

    it('sendPushToRegion: Berhasil mengirim notifikasi massal dan membersihkan token 410 kedaluwarsa', async () => {
      // Mock select 2 subscribers
      const mockEq = vi.fn().mockResolvedValueOnce({
        data: [
          {
            id: 'sub-active',
            endpoint: 'https://fcm.googleapis.com/fcm/send/active',
            p256dh: 'k1',
            auth: 'a1',
            region_id: 'reg-1',
          },
          {
            id: 'sub-expired',
            endpoint: 'https://fcm.googleapis.com/fcm/send/expired',
            p256dh: 'k2',
            auth: 'a2',
            region_id: 'reg-1',
          },
        ],
        error: null,
      });

      mockAdminSelect.mockReturnValueOnce({
        eq: mockEq,
      });

      // 1 berhasil (201), 1 gagal expired (410)
      mockWebPushSend
        .mockResolvedValueOnce({ statusCode: 201 })
        .mockRejectedValueOnce({ statusCode: 410, message: 'Gone' });

      // Mock delete expired
      const mockIn = vi.fn().mockResolvedValueOnce({ error: null });
      mockAdminDelete.mockReturnValueOnce({
        in: mockIn,
      });

      const stats = await sendPushToRegion('reg-1', {
        title: 'Status Awas Cuaca',
        body: 'Curah hujan ekstrem terdeteksi',
      });

      expect(stats.total).toBe(2);
      expect(stats.sent).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.removed).toBe(1);
      expect(mockIn).toHaveBeenCalledWith('id', ['sub-expired']);
    });
  });
});
