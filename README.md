# 🛡️ SiagaKita — Platform Kesiapsiagaan & Mitigasi Bencana Warga

> **Siap Hari Ini, Aman Esok**  
> Platform web terpadu kesiapsiagaan bencana hiperlokal: peringatan dini cuaca ekstrem & gempa bumi real-time BMKG, peta rute evakuasi darurat, laporan lapangan terverifikasi oleh warga, serta panduan mitigasi tanggap darurat.

---

## 📌 Daftar Isi
- [Latar Belakang & Problem Statement](#-latar-belakang--problem-statement)
- [Fitur Utama](#-fitur-utama)
- [Teknologi & Arsitektur](#-teknologi--arsitektur)
- [Struktur Direktori](#-struktur-direktori)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Konfigurasi Environment Variables](#-konfigurasi-environment-variables)
- [Pengujian (Unit & Integration Tests)](#-pengujian-unit--integration-tests)
- [Dokumentasi API Endpoints](#-dokumentasi-api-endpoints)
- [Kepatuhan UU PDP (Privasi Data)](#-kepatuhan-uu-pdp-privasi-data)
- [Kontribusi & Lisensi](#-kontribusi--lisensi)

---

## 🚨 Latar Belakang & Problem Statement

Masyarakat di kawasan rawan bencana sering menghadapi dua kendala krusial:
1. **Keterlambatan dan luasnya skala peringatan**: Informasi peringatan sering kali bersifat umum (level provinsi/kabupaten) tanpa konteks tingkat RT/kelurahan yang dapat langsung ditindaklanjuti (*actionable*).
2. **Keterbatasan akses titik & jalur evakuasi**: Warga kerap kebingungan menentukan arah tempat evakuasi terdekat yang aman serta jalur jalan raya yang bebas rintangan saat kondisi genting.
3. **Penyebaran kepanikan & disinformasi**: Minimnya kanal verifikasi bersama dari laporan warga di lapangan terkait jalan putus, debit luapan air, atau jembatan rusak.

**SiagaKita** hadir menjembatani rantai mitigasi dalam satu alur terpadu:
```text
Prediksi Cuaca BMKG ➔ Peringatan Dini ➔ Peta Rute Evakuasi ➔ Laporan Warga ➔ Mitigasi & "Saya Aman"
```

---

## ✨ Fitur Utama

### 1. 🌦️ Peringatan Dini Cuaca & Gempa Real-time (BMKG)
- **Prediksi Cuaca Otomatis**: Integrasi API data cuaca BMKG berbasis kode wilayah adm4 seluruh Indonesia (curah hujan 24 jam, prakiraan 5 harian, kelembaban, dan kecepatan angin).
- **Pemantauan Gempa Terkini**: Sensor autogempa BMKG TEWS mendeteksi gempa M 5.0+ terbaru, menghitung jarak episentrum secara otomatis dari koordinat pengguna, serta memberikan 4 pilar instruksi mitigasi darurat.
- **Kalkulasi Level Risiko Multikriteria**: Menghitung skor indeks risiko banjir dan hidrometeorologi (Aman, Waspada, Siaga, Awas).

### 2. 🗺️ Peta Risiko & Navigasi Rute Evakuasi Jalan Raya
- **OpenStreetMap & MapLibre GL JS**: Rendering peta berbasis MapLibre GL dengan tile OpenStreetMap resmi multi-subdomain yang ringan dan interaktif.
- **Navigasi Rute OSRM**: Perhitungan rute turn-by-turn jaringan jalan raya resmi (*driving/walking route*) dari lokasi pengguna menuju shelter/titik evakuasi terdekat.
- **Deteksi GPS Presisi & Pelacakan Langkah**: Integrasi Geolocation API perangkat untuk menentukan domisili terdekat secara instan serta mode kamera otomatis mengikuti langkah kaki (*live follow mode*).

### 3. 👥 Laporan Warga & Gotong Royong Komunitas
- **Pelaporan Situasi Lapangan**: Warga dapat mengunggah laporan banjir, longsor, pohon tumbang, jalan terputus, atau panggilan butuh bantuan darurat lengkap dengan koordinat titik dan foto bukti.
- **Mekanisme Verifikasi Kerumunan (*Crowd-Verification*)**: Menangkal hoaks melalui tombol konfirmasi validasi lapangan antarwarga. Laporan yang terverifikasi mendapatkan penanda khusus.

### 4. 🟢 Tombol "Saya Aman" & Notifikasi Push
- **Satu Klik Kabar Aman**: Fitur cepat bagi warga untuk menandai status keselamatan diri saat bencana terjadi, meredakan kekhawatiran keluarga dan komunitas tanpa membebani jaringan telepon seluler.
- **Web Push Notifications**: Siaran peringatan langsung ke layar perangkat saat level risiko di wilayah domisili meningkat ke Siaga atau Awas.

### 5. 🔒 Autentikasi Fleksibel & Kepatuhan Privasi (UU PDP)
- **Mode Tamu (Guest Mode)**: Akses instan ke peta, rute evakuasi, dan pemantauan bencana tanpa harus registrasi/login akun terlebih dahulu.
- **Hak Pemusnahan Data Pribadi (UU PDP No. 27/2022)**: Subjek data berhak menghapus akun beserta seluruh jejak koordinat, riwayat laporan, dan data profil secara permanen dari basis data.

---

## 🛠️ Teknologi & Arsitektur

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) | Server Components & Client Hooks mutakhir |
| **Bahasa** | TypeScript 5 | Strict type checking & autocompletion |
| **Styling** | Tailwind CSS v4 & Lucide Icons | Desain responsif, clean token, dan micro-animation |
| **Geospasial & Peta** | MapLibre GL JS & OSRM Engine | Rendering raster OpenStreetMap & routing jalan raya |
| **Basis Data & Auth** | Supabase (PostgreSQL + RLS) | Autentikasi aman, storage foto laporan, & schema RLS |
| **Data Provider** | BMKG Open Data API | Feed cuaca, maritim, dan gempa bumi TEWS |
| **Testing** | Vitest | Pengujian unit otomatis (Good Route & Bad Route) |

---

## 📁 Struktur Direktori

```text
SiagaKita/
├── __tests__/                  # Unit & integration tests (API & Components)
│   ├── api/                    # Pengujian route handler (auth, cuaca, gempa, laporan, dll.)
│   └── components/             # Pengujian komponen UI & hooks
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Halaman login & register
│   ├── api/                    # API Route Handlers (REST endpoints)
│   │   ├── auth/               # Login, register, guest, delete account
│   │   ├── cuaca/              # Ingest & parse cuaca BMKG adm4
│   │   ├── gempa/              # TEWS parser gempa terkini
│   │   ├── laporan/            # CRUD & konfirmasi laporan warga
│   │   ├── status-aman/        # Pencatatan status keselamatan "Saya Aman"
│   │   └── upload/             # Unggah foto bukti laporan warga
│   ├── globals.css             # Konfigurasi Tailwind CSS v4 & theme tokens
│   ├── layout.tsx              # Root HTML layout, font setup, metadata PWA
│   └── page.tsx                # Halaman utama aplikasi (Desktop & Mobile view)
├── components/                 # Komponen antarmuka independen
│   ├── auth/                   # LoginForm, RegisterForm, AuthLayout
│   ├── community/              # Feed laporan warga, CreateReportModal
│   ├── dashboard/              # Bento card, cuaca, gempa, ringkasan risiko
│   ├── layout/                 # DesktopSidebar, Topbar, MobileBottomNav
│   ├── map/                    # InteractiveRiskMap, MapDetailsPanel
│   ├── mitigation/             # Panduan mitigasi bencana & checklist tas siaga
│   └── ui/                     # Dialog alert, modal saya aman, banner notifikasi
├── data/                       # Data mock & fallback darurat
├── lib/                        # Helper logic, kalkulator risiko, BMKG client, Supabase
├── public/                     # Service worker, aset statis, ikon PWA
├── docs/                       # PRD & Dokumen Panduan Desain
├── vitest.config.ts            # Konfigurasi environment pengujian Vitest
└── package.json                # Dependensi proyek & script runner
```

---

## 💻 Persyaratan Sistem

- **Node.js**: Versi `20.x` atau lebih baru
- **Package Manager**: `pnpm` (disarankan v9+ / v11+) atau `npm`

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Kloning Repositori
```bash
git clone https://github.com/Xuerns/SiagaKita.git
cd SiagaKita
```

### 2. Pasang Dependensi
```bash
pnpm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin berkas template lingkungan:
```bash
cp .env.example .env.local
```
Sesuaikan nilai variabel lingkungan pada `.env.local` (lihat bagian [Konfigurasi Environment Variables](#-konfigurasi-environment-variables)).

### 4. Jalankan Development Server
```bash
pnpm run dev
```
Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

### 5. Build untuk Produksi
```bash
pnpm run build
pnpm run start
```

---

## ⚙️ Konfigurasi Environment Variables

Buat berkas `.env.local` pada direktori root proyek dengan format berikut:

```env
# Supabase Backend & Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# Web Push Notification (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:admin@siagakita.id

# Secret Token untuk Cron Job Route Handlers
CRON_SECRET=your-random-cron-secret-token

# Mode Simulasi / Demo
NEXT_PUBLIC_DEMO_MODE=true
```

---

## 🧪 Pengujian (Unit & Integration Tests)

Proyek ini menerapkan unit test menyeluruh untuk memastikan keandalan rute API baik pada skenario sukses (*good route*) maupun skenario penanganan error (*bad route*).

Jalankan test suite menggunakan **Vitest**:
```bash
# Menjalankan seluruh test suite
pnpm test

# Menjalankan test dengan mode watch
npx vitest

# Menjalankan test file tertentu
npx vitest run __tests__/api/cuaca-evakuasi.test.ts
```

---

## 📡 Dokumentasi API Endpoints

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| `GET` | `/api/cuaca?adm4={kode}` | Mengambil data cuaca riil & prakiraan 5 hari BMKG | Publik |
| `GET` | `/api/gempa` | Mengambil data gempa M 5.0+ terbaru & kalkulasi jarak | Publik |
| `GET` | `/api/evakuasi?lokasi={nama}` | Daftar titik kumpul & posko evakuasi wilayah | Publik |
| `GET` | `/api/laporan?lat={}&lng={}` | Mengambil feed laporan warga sekitar | Publik |
| `POST` | `/api/laporan` | Membuat laporan situasi bencana baru oleh warga | Warga Terdaftar |
| `POST` | `/api/laporan/confirm` | Mengonfirmasi keabsahan laporan warga (+1 konfirmasi) | Publik |
| `POST` | `/api/status-aman` | Mencatat konfirmasi keselamatan "Saya Aman" | Publik |
| `POST` | `/api/auth/login` | Masuk menggunakan email & kata sandi | Publik |
| `POST` | `/api/auth/register` | Pendaftaran akun warga baru | Publik |
| `POST` | `/api/auth/guest` | Inisialisasi sesi anonim mode tamu | Publik |
| `DELETE` | `/api/auth/delete-account` | Penghapusan akun permanen hak UU PDP | Pengguna Terotentikasi |

---

## 🛡️ Kepatuhan UU PDP (Privasi Data)

Berdasarkan amanat **UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi**:
- **Prinsip Minimasi Data**: Koordinat publik pada laporan warga dapat disamarkan untuk melindungi privasi tempat tinggal.
- **Hak Penghapusan Permanen**: Pengguna dapat menggunakan tombol *"Hapus Akun & Data Pribadi Permanen"* di halaman Pengaturan Akun untuk memusnahkan seluruh data identitas, riwayat pelaporan, dan preferensi dari server tanpa residu.

---

## 📄 Lisensi & Kontributor

Dikembangkan oleh **Tim SiagaKita** untuk inisiatif Kesiapsiagaan dan Mitigasi Bencana Masyarakat Indonesia.
Lisensi: **MIT License**.
