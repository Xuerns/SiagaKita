// SiagaKita PWA Service Worker (v2.0.0)
// Menyediakan Offline Caching, Offline App Shell, Emergency Offline Evacuation Console, dan Push Notifications

const CACHE_NAME = 'siagakita-cache-v2';

// Asset statis inti yang langsung dicache saat Service Worker diinstal
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/logo.svg',
  '/logo-symbol.svg',
  '/favicon.ico',
  '/maplibre-gl-worker.mjs',
];

// Emergency Offline Evacuation Console jika App Shell belum tersimpan
const OFFLINE_FALLBACK_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SiagaKita — Peta & Evakuasi Darurat Offline</title>
  <style>
    :root {
      --primary: #176B4D;
      --primary-dark: #0F3822;
      --surface: #ffffff;
      --bg: #F5F7F6;
      --text-main: #17211D;
      --text-muted: #68756E;
      --border: #E6EBE8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      padding: 16px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container {
      width: 100%;
      max-width: 580px;
      margin: 0 auto;
    }
    .header-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 4px 20px -2px rgba(0,0,0,0.04);
      margin-bottom: 16px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FEF3C7;
      color: #92400E;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    .badge.gps {
      background: #E5F5EA;
      color: var(--primary);
    }
    h1 {
      font-size: 18px;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 6px;
    }
    p.desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 16px;
    }
    .gps-panel {
      background: #F8FAF9;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .btn-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--primary);
      color: #fff;
      padding: 10px 18px;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
      border: none;
      transition: background 0.15s;
    }
    .btn:hover { background: var(--primary-dark); }
    .btn-outline {
      background: transparent;
      color: var(--text-main);
      border: 1px solid var(--border);
    }
    .btn-outline:hover { background: #EAEFEA; }
    .shelter-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .shelter-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 10px -2px rgba(0,0,0,0.03);
    }
    .shelter-card.hospital {
      border-left: 4px solid #2563EB;
    }
    .shelter-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .shelter-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      background: #E5F5EA;
      color: var(--primary);
    }
    .shelter-addr {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }
    .shelter-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary);
      padding-top: 8px;
      border-top: 1px solid #F1F4F2;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-card">
      <div class="badge">📡 Mode Darurat Offline (Tanpa Internet)</div>
      <h1>Peta & Titik Evakuasi Tersimpan</h1>
      <p class="desc">Koneksi internet terputus. Sistem darurat membaca paket peta dan titik evakuasi yang tersimpan di memori perangkat (IndexedDB) serta mendeteksi posisi Anda via satelit GPS.</p>
      
      <div class="gps-panel">
        <div>
          <span style="display:block; font-size:10px; color:var(--text-muted); font-weight:600;">STATUS SATELIT GPS</span>
          <span id="gps-status" style="font-weight:700; color:var(--primary);">Mencari sinyal GPS satelit...</span>
        </div>
        <button class="btn btn-outline" style="padding:6px 12px; font-size:11px;" onclick="initGPS()">Segarkan GPS</button>
      </div>

      <div class="btn-row">
        <button class="btn" onclick="window.location.href='/'">Buka Aplikasi Penuh (App Shell)</button>
        <button class="btn btn-outline" onclick="window.location.reload()">Muat Ulang Halaman</button>
      </div>
    </div>

    <div style="font-size:13px; font-weight:700; margin-bottom:8px; color:var(--text-main); display:flex; justify-content:space-between; align-items:center;">
      <span>Daftar Posko & Shelter Evakuasi Lokal</span>
      <span id="point-count" style="font-size:11px; color:var(--text-muted); font-weight:normal;">Memuat data...</span>
    </div>

    <div id="shelter-container" class="shelter-list">
      <div style="text-align:center; padding:24px; font-size:12px; color:var(--text-muted);">
        Membaca titik evakuasi dari IndexedDB...
      </div>
    </div>
  </div>

  <script>
    let userLat = null;
    let userLng = null;
    let points = [];

    const defaultPoints = [
      { id: "1", name: "SMPN 5 Bogor", type: "Sekolah", address: "Jl. Dadali No. 35, Tanah Sareal, Kota Bogor", lat: -6.5782, lng: 106.7971, capacity: 1200 },
      { id: "2", name: "GOR Pajajaran Bogor", type: "GOR", address: "Jl. Pemuda No. 4, Tanah Sareal, Kota Bogor", lat: -6.5794, lng: 106.7995, capacity: 3000 },
      { id: "3", name: "RSUD Kota Bogor", type: "Rumah Sakit", address: "Jl. DR. Sumeru No. 120, Menteng, Bogor Barat", lat: -6.5841, lng: 106.7765, capacity: 500 },
      { id: "4", name: "GOR Saparua Bandung", type: "GOR", address: "Jl. Saparua No. 2, Bandung Wetan", lat: -6.9080, lng: 107.6180, capacity: 1800 },
      { id: "5", name: "RSUP Hasan Sadikin", type: "Rumah Sakit", address: "Jl. Pasteur No. 38, Sukajadi, Bandung", lat: -6.8924, lng: 107.5982, capacity: 450 }
    ];

    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3;
      const phi1 = lat1 * Math.PI/180;
      const phi2 = lat2 * Math.PI/180;
      const deltaPhi = (lat2-lat1) * Math.PI/180;
      const deltaLambda = (lon2-lon1) * Math.PI/180;
      const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return Math.round(R * c);
    }

    function calculateBearing(lat1, lon1, lat2, lon2) {
      const toRad = deg => deg * Math.PI / 180;
      const toDeg = rad => rad * 180 / Math.PI;
      const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
      const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
                Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
      const b = (toDeg(Math.atan2(y, x)) + 360) % 360;
      const dirs = ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"];
      return dirs[Math.round(b / 45) % 8];
    }

    function renderPoints() {
      const container = document.getElementById("shelter-container");
      const countEl = document.getElementById("point-count");
      countEl.innerText = points.length + " Lokasi Tersimpan";

      if (!points.length) {
        container.innerHTML = '<div style="text-align:center; padding:20px; font-size:13px; color:var(--text-muted); background:#fff; border-radius:14px; border:1px solid var(--border);">Belum ada titik evakuasi yang diunduh. Silakan buka aplikasi saat online untuk mengunduh peta wilayah.</div>';
        return;
      }

      container.innerHTML = points.map(pt => {
        let distText = "Menghitung jarak...";
        let dirText = "";
        let walkTime = "";
        if (userLat !== null && userLng !== null && pt.lat && pt.lng) {
          const m = calculateDistance(userLat, userLng, pt.lat, pt.lng);
          distText = m >= 1000 ? (m / 1000).toFixed(1) + " km" : m + " meter";
          dirText = " • Arah " + calculateBearing(userLat, userLng, pt.lat, pt.lng);
          walkTime = " • ±" + Math.max(1, Math.round(m / 75)) + " mnt jalan kaki";
        }
        const isHosp = pt.type === "Rumah Sakit";
        return \`
          <div class="shelter-card \${isHosp ? 'hospital' : ''}">
            <div class="shelter-title">
              <span>\${pt.name}</span>
              <span class="shelter-badge">\${pt.type || 'Posko'}</span>
            </div>
            <div class="shelter-addr">\${pt.address || 'Kawasan Evakuasi Terbuka'}</div>
            <div class="shelter-meta">
              <span>📍 \${distText}\${dirText}\${walkTime}</span>
              \${pt.capacity ? \`<span style="margin-left:auto; color:var(--text-muted);">Kapasitas: \${pt.capacity} org</span>\` : ''}
            </div>
          </div>
        \`;
      }).join('');
    }

    function loadIndexedDB() {
      const req = indexedDB.open("siagakita-offline-db", 1);
      req.onsuccess = function(e) {
        const db = e.target.result;
        if (db.objectStoreNames.contains("evacuation_points")) {
          const tx = db.transaction("evacuation_points", "readonly");
          const store = tx.objectStore("evacuation_points");
          const getAll = store.getAll();
          getAll.onsuccess = function() {
            if (getAll.result && getAll.result.length > 0) {
              points = getAll.result;
            } else {
              points = defaultPoints;
            }
            renderPoints();
          };
          getAll.onerror = function() {
            points = defaultPoints;
            renderPoints();
          };
        } else {
          points = defaultPoints;
          renderPoints();
        }
      };
      req.onerror = function() {
        points = defaultPoints;
        renderPoints();
      };
    }

    function initGPS() {
      if (!navigator.geolocation) {
        document.getElementById("gps-status").innerText = "Browser tidak mendukung GPS";
        return;
      }
      document.getElementById("gps-status").innerText = "Mendeteksi satelit...";
      navigator.geolocation.watchPosition(
        pos => {
          userLat = pos.coords.latitude;
          userLng = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy);
          document.getElementById("gps-status").innerText = \`🎯 Satelit Terkunci (±\${acc}m)\`;
          renderPoints();
        },
        err => {
          document.getElementById("gps-status").innerText = "Sinyal GPS lemah / belum diizinkan";
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 }
      );
    }

    loadIndexedDB();
    initGPS();
  </script>
</body>
</html>`;

// 1. INSTALL EVENT (Precache resiliently)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('[SW] Precache item non-fatal error:', asset, err);
        }
      }
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
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          // 1. Cari exact match request di cache
          const cached = await caches.match(request);
          if (cached) return cached;

          // 2. Jika tidak ada, kembalikan App Shell root '/' yang sudah tercache
          const appShell = await caches.match('/');
          if (appShell) return appShell;

          // 3. Jika App Shell belum ada, tampilkan Emergency Offline Evacuation Console
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
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2|woff|ttf|css|js|mjs)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
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
    icon: '/icon.svg',
    badge: '/icon.svg',
    data: { url: '/' },
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: data.data,
      vibrate: [200, 100, 200],
    })
  );
});

// 5. NOTIFICATION CLICK EVENT
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
