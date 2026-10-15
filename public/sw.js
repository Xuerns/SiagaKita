// SiagaKita PWA Service Worker (v1.0.0)
// Menyediakan Offline Caching, Offline Fallback Shell, dan Push Notifications

const CACHE_NAME = 'siagakita-cache-v1';

// Asset statis inti yang langsung dicache saat Service Worker diinstal
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-maskable-512.png',
  '/icon.svg',
  '/favicon.ico',
];

// Offline Fallback HTML jika user membuka aplikasi pertama kali saat benar-benar tidak ada internet
const OFFLINE_FALLBACK_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SiagaKita — Mode Offline</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #F5F7F6;
      color: #17211D;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      box-sizing: border-box;
      text-align: center;
    }
    .card {
      background: #ffffff;
      border: 1px solid #E6EBE8;
      border-radius: 20px;
      padding: 32px 24px;
      max-width: 420px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }
    .badge {
      display: inline-block;
      background: #E5F5EA;
      color: #176B4D;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 20px;
      margin: 0 0 12px 0;
      color: #17211D;
    }
    p {
      font-size: 14px;
      color: #68756E;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .btn {
      display: inline-block;
      background: #176B4D;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
      border: none;
    }
    .btn:hover { background: #0F3822; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">📡 SiagaKita Offline</div>
    <h1>Koneksi Internet Terputus</h1>
    <p>Aplikasi berada dalam mode darurat offline. Jika Anda sudah pernah mengunduh peta dan data evakuasi lokal sebelumnya, data tersebut tetap aman di penyimpanan perangkat.</p>
    <button class="btn" onclick="window.location.reload()">Coba Muat Ulang</button>
  </div>
</body>
</html>`;

// 1. INSTALL EVENT
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Simpan aset precache
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache partially failed:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE EVENT (Hapus Cache Versi Lama)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH EVENT (Stale-While-Revalidate & Network-First Offline Fallback)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Jangan cache API routes dinamis dan Supabase requests
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase.co') ||
    request.method !== 'GET'
  ) {
    return;
  }

  // Permintaan Navigasi Halaman HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Salin response ke cache untuk akses offline berikutnya
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          // Jika offline, cari di cache
          const cached = await caches.match(request);
          if (cached) return cached;

          // Jika halaman awal belum tercache, berikan offline fallback HTML
          return new Response(OFFLINE_FALLBACK_HTML, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        })
    );
    return;
  }

  // Aset statis (CSS, JS, Fonts, Images)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2|woff|ttf|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch latar belakang untuk memperbarui cache (Stale-While-Revalidate)
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return networkResponse;
        });
      })
    );
    return;
  }
});

// 4. PUSH NOTIFICATION EVENT
self.addEventListener('push', (event) => {
  let data = {
    title: 'SiagaKita — Peringatan Dini',
    body: 'Terdeteksi pembaruan risiko cuaca di wilayah pantauan Anda.',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: { url: '/' },
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/icon-192x192.png',
    vibrate: [200, 100, 200, 100, 400],
    data: data.data || { url: '/' },
    actions: [
      { action: 'open', title: 'Lihat Detail' },
      { action: 'close', title: 'Tutup' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 5. NOTIFICATION CLICK EVENT
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
