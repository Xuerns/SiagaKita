import webpush from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    url?: string;
    level?: string;
    hazard?: string;
    alertId?: string;
    [key: string]: unknown;
  };
}

let isVapidConfigured = false;

export function configureVapid(): boolean {
  if (isVapidConfigured) return true;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@siagakita.id';

  if (!publicKey || !privateKey) {
    console.warn('[WebPush] VAPID keys belum diatur lengkap di environment variables.');
    return false;
  }

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    isVapidConfigured = true;
    return true;
  } catch (err) {
    console.warn('[WebPush] Gagal menginisialisasi VAPID details:', err);
    return false;
  }
}

/**
 * Mengirim Web Push Notification ke satu langganan (subscription)
 */
export async function sendPushNotification(
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  },
  payload: PushPayload
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  if (!configureVapid()) {
    return { success: false, error: 'VAPID keys not configured' };
  }

  try {
    const pushSub = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };

    const payloadString = JSON.stringify({
      title: payload.title || 'SiagaKita — Peringatan Dini',
      body: payload.body,
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/icon-192x192.png',
      data: payload.data || { url: '/' },
    });

    const response = await webpush.sendNotification(pushSub, payloadString);
    return { success: true, statusCode: response.statusCode };
  } catch (err: any) {
    const statusCode = err?.statusCode;
    return {
      success: false,
      statusCode,
      error: err?.message || 'Gagal mengirim push notification',
    };
  }
}

/**
 * Mengirim notifikasi push ke seluruh pengguna terdaftar di wilayah tertentu
 * Menggunakan service role Supabase dan otomatis membersihkan token kedaluwarsa (410/404)
 */
export async function sendPushToRegion(
  regionId?: string | null,
  payload: PushPayload = {
    title: 'Peringatan Dini Cuaca Ekstrem',
    body: 'Terdeteksi peningkatan risiko di wilayah Anda.',
  }
): Promise<{ total: number; sent: number; failed: number; removed: number }> {
  if (!configureVapid()) {
    return { total: 0, sent: 0, failed: 0, removed: 0 };
  }

  try {
    const admin = createAdminClient();
    let query = admin.from('push_subscriptions').select('id, endpoint, p256dh, auth, region_id');

    if (regionId) {
      query = query.eq('region_id', regionId);
    }

    const { data: subs, error } = await query;
    if (error || !subs || subs.length === 0) {
      return { total: 0, sent: 0, failed: 0, removed: 0 };
    }

    let sent = 0;
    let failed = 0;
    let removed = 0;

    const expiredIds: string[] = [];

    await Promise.allSettled(
      subs.map(async (sub) => {
        const result = await sendPushNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );

        if (result.success) {
          sent++;
        } else {
          failed++;
          // HTTP 410 Gone atau 404 Not Found berarti subscription sudah tidak valid lagi di browser
          if (result.statusCode === 410 || result.statusCode === 404) {
            expiredIds.push(sub.id);
          }
        }
      })
    );

    // Hapus subscription yang sudah kedaluwarsa dari database
    if (expiredIds.length > 0) {
      const { error: delErr } = await admin.from('push_subscriptions').delete().in('id', expiredIds);
      if (!delErr) {
        removed = expiredIds.length;
      }
    }

    return { total: subs.length, sent, failed, removed };
  } catch (err) {
    console.warn('[WebPush] Error saat mengirim push massal:', err);
    return { total: 0, sent: 0, failed: 0, removed: 0 };
  }
}
