# PRD: SiagaKita (nama kerja)

> Platform web (PWA) kesiapsiagaan bencana: peringatan hiperlokal, peta evakuasi yang tetap bisa dibuka tanpa sinyal, dan laporan warga yang terverifikasi.

| | |
|---|---|
| **Versi** | 1.0 (Draft) |
| **Tanggal** | 13 Oktober 2026 |
| **Subtema** | Sustainability |
| **Platform** | Web (Progressive Web App), mobile-first |
| **Stack utama** | Next.js, TypeScript, Supabase (PostgreSQL + PostGIS), MapLibre GL JS, Web Push |
| **Tim / Penanggung jawab** | [ISI] |
| **Wilayah demo** | [ISI: contoh Kelurahan X, Kecamatan Y] |

> **Catatan:** nama "SiagaKita" hanya placeholder. Alternatif: JagaWarga, TitikAman. Bagian bertanda `[ISI]` perlu dilengkapi tim.

---

## 1. Ringkasan Eksekutif

SiagaKita adalah aplikasi web progresif untuk masyarakat di wilayah rawan bencana. Aplikasi ini menjawab dua masalah utama: **informasi peringatan yang terlambat** dan **akses evakuasi yang terbatas**.

Pendekatannya menghubungkan enam fitur dalam satu alur:

```
Prediksi → Peringatan → Maps Evakuasi → Komunitas → Mitigasi
```

Tiga pembeda utama dibanding aplikasi kebencanaan yang sudah ada:

1. **Peta dan rute evakuasi dapat diakses offline**, karena sinyal sering hilang saat bencana.
2. **Peringatan hiperlokal berbasis radius dan laporan warga terverifikasi** (bukan hanya peringatan level provinsi atau kabupaten).
3. **Peringatan yang actionable**: setiap peringatan menjawab "apa, di mana, seberapa parah, dan apa yang harus saya lakukan", lalu langsung mengarah ke rute evakuasi.

---

## 2. Latar Belakang dan Problem Statement

### 2.1 Subtema

> Masyarakat di wilayah rawan bencana yang menghadapi keterlambatan informasi peringatan dan keterbatasan akses evakuasi, sehingga tidak dapat menyelamatkan dan mempersiapkan diri.

### 2.2 Masalah yang diidentifikasi

| # | Masalah | Dampak |
|---|---|---|
| P1 | Informasi peringatan datang terlambat atau tidak sampai ke level RT/dusun | Warga tidak sempat bersiap |
| P2 | Peringatan umumnya satu arah dan berskala wilayah luas | Warga tidak tahu apakah lokasinya terdampak |
| P3 | Sinyal dan internet sering terganggu saat bencana | Peta dan informasi tidak bisa dibuka |
| P4 | Warga tidak tahu titik dan jalur evakuasi terdekat | Evakuasi lambat atau salah arah |
| P5 | Informasi kondisi lapangan (sungai naik, jalan terputus) tidak terkumpul | Rute evakuasi berisiko, hoaks mudah menyebar |
| P6 | Edukasi mitigasi tersebar dan jarang dibaca sebelum bencana terjadi | Kesiapsiagaan rendah |

### 2.3 Peluang

Aplikasi yang ada cenderung bersifat satu arah dan bergantung pada internet. Celah yang bisa diisi: peringatan hiperlokal, kerja offline, dan keterlibatan komunitas dengan verifikasi.

---

## 3. Tujuan dan Metrik Keberhasilan

### 3.1 Tujuan produk

1. Mempercepat informasi peringatan sampai ke warga di wilayah terdampak.
2. Memastikan warga tahu **ke mana harus pergi** dan **bagaimana ke sana**, meski tanpa internet.
3. Mengumpulkan informasi kondisi lapangan dari warga secara terverifikasi.
4. Meningkatkan kesiapsiagaan melalui konten mitigasi yang mudah dipahami.

### 3.2 Metrik keberhasilan

**Metrik prototipe (untuk lomba/demo):**

| Metrik | Target |
|---|---|
| Skenario demo end-to-end berjalan (prediksi → peringatan → peta → laporan → "Saya aman") | 100% tanpa error |
| Peta dan rute evakuasi dapat dibuka dengan mode pesawat aktif (setelah diunduh) | Berhasil di minimal 2 perangkat berbeda |
| Skor PWA Lighthouse | Installable, lolos kriteria PWA |
| Performa halaman utama di jaringan 4G | LCP < 2,5 detik |
| Waktu dari perubahan level risiko terdeteksi sampai push terkirim | < 2 menit (di luar interval cron) |

**Metrik produk (jika dilanjutkan):**

| Metrik | Target awal |
|---|---|
| Persentase pengguna yang mengatur lokasi rumah | > 70% |
| Persentase pengguna yang mengunduh peta offline | > 40% |
| Rasio push berhasil dikirim | > 95% |
| Waktu rata-rata laporan warga sampai berstatus terverifikasi | < 30 menit |
| Pengguna yang menyelesaikan checklist tas siaga | > 30% |

> Target di atas adalah asumsi awal dan perlu disesuaikan setelah uji coba dengan pengguna nyata.

---

## 4. Target Pengguna

### 4.1 Persona

| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Pak Budi (45)**, warga bantaran sungai | Android kelas menengah, kuota terbatas, sinyal sering hilang saat hujan deras | Tahu kapan harus bersiap, tahu rute ke titik kumpul, bisa dipakai offline |
| **Bu Sari (68)**, lansia tinggal sendiri | Sulit bergerak cepat, tidak terbiasa dengan aplikasi | Peringatan jelas (suara/getar/teks besar), dibantu keluarga atau tetangga lewat profil dan kontak darurat |
| **Rani (24)**, relawan/Karang Taruna | Aktif di lingkungan, punya akun sebagai relawan | Memverifikasi laporan warga, melihat kondisi lapangan |
| **Pak Hendra**, petugas BPBD/aparat kelurahan | Perlu gambaran situasi wilayah | Dashboard sebaran risiko, laporan, dan titik evakuasi |

### 4.2 User stories utama

- Sebagai **warga**, saya ingin menerima peringatan sesuai lokasi rumah saya agar tidak mendapat info yang tidak relevan.
- Sebagai **warga**, saya ingin peta evakuasi tetap bisa dibuka tanpa internet agar saya tidak tersesat saat sinyal hilang.
- Sebagai **warga**, saya ingin melaporkan kondisi sekitar (jalan terendam, sungai naik) agar tetangga tahu dan menghindarinya.
- Sebagai **warga**, saya ingin menandai "Saya aman" agar keluarga dan relawan tidak khawatir.
- Sebagai **warga**, saya ingin tahu apa yang harus dilakukan sebelum, saat, dan sesudah tiap jenis bencana.
- Sebagai **relawan**, saya ingin memverifikasi laporan agar informasi yang tersebar akurat.
- Sebagai **admin/BPBD**, saya ingin melihat sebaran risiko dan laporan agar bisa memprioritaskan bantuan.
- Sebagai **tamu**, saya ingin tetap menerima peringatan tanpa harus mendaftar.

---

## 5. Ruang Lingkup

### 5.1 Termasuk (In Scope)

- Aplikasi web responsif mobile-first yang dapat di-install (PWA)
- Enam fitur utama: Peringatan, Prediksi, Komunitas, Mitigasi, Maps Evakuasi, Login/Register
- Prediksi risiko **banjir** (prioritas), **longsor** (jika waktu cukup)
- Peringatan **gempa bumi** dan **cuaca ekstrem** yang bersumber dari BMKG
- Satu wilayah demo dengan data titik evakuasi dan rute yang sudah disiapkan
- Dashboard admin sederhana (P2)

### 5.2 Tidak Termasuk (Out of Scope)

- Memprediksi gempa bumi atau tsunami (secara ilmiah tidak dapat diprediksi; hanya menampilkan peringatan resmi dan peta risiko)
- Aplikasi native Android/iOS
- Pengiriman SMS dan cell broadcast (pengembangan lanjutan)
- Mesh network Bluetooth/Wi-Fi Direct (tidak tersedia di web)
- Model machine learning (pengembangan lanjutan)
- Integrasi sensor IoT (pengembangan lanjutan)
- Cakupan nasional; fokus pada wilayah demo

### 5.3 Pernyataan batasan (wajib tampil di aplikasi)

- Aplikasi ini **pelengkap**, bukan pengganti peringatan resmi BMKG, BNPB, atau BPBD setempat.
- Skor prediksi adalah **estimasi berbasis aturan sederhana**, bukan prakiraan resmi.

---

## 6. Alur Pengguna Utama

### 6.1 Onboarding

```
Buka situs → Pilih "Masuk sebagai tamu" atau "Daftar"
        → Izinkan lokasi (atau pilih lokasi rumah manual di peta)
        → Izinkan notifikasi (+ petunjuk Add to Home Screen untuk iOS)
        → Tawarkan "Unduh peta wilayahku" (offline)
        → Beranda
```

### 6.2 Alur peringatan (inti produk)

```
Cron ambil data cuaca → hitung skor risiko → level naik (mis. Waspada → Siaga)
        → simpan alert → kirim Web Push ke pengguna di wilayah terdampak
        → pengguna buka notifikasi → layar peringatan penuh
           (Apa / Di mana / Seberapa parah / Lakukan ini)
        → tombol "Lihat rute evakuasi" → Peta (cache offline)
        → lihat laporan warga di sekitar → tekan "Saya aman"
```

### 6.3 Alur laporan komunitas

```
Komunitas → "Buat laporan" → pilih tipe, tulis deskripsi, foto, lokasi (otomatis/manual)
        → laporan berstatus "Belum terverifikasi"
        → warga lain di radius menekan "Konfirmasi"
        → ≥ 3 konfirmasi atau 1 relawan → "Terverifikasi"
        → jika tipe = hambatan jalan → tampil di Peta dan rute menghindarinya (P2)
```

---

## 7. Kebutuhan Fungsional

**Keterangan prioritas:**
- **P0**: MVP, wajib ada
- **P1**: Tahap 2, wajib untuk demo
- **P2**: Nilai tambah, dikerjakan jika waktu cukup

### 7.1 Autentikasi dan Profil (Login & Register)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-AUTH-01 | Pengguna dapat mendaftar dengan email dan kata sandi, serta login dengan Google | P0 |
| FR-AUTH-02 | Pengguna dapat login dan logout dengan sesi yang bertahan | P0 |
| FR-AUTH-03 | **Mode tamu** (anonymous sign-in): pengguna dapat menerima peringatan dan melihat peta tanpa mendaftar | P0 |
| FR-AUTH-04 | Pengguna tamu dapat meng-upgrade ke akun tanpa kehilangan data (lokasi, langganan push) | P1 |
| FR-AUTH-05 | Profil menyimpan: nama, lokasi rumah (titik di peta), kontak darurat (maks. 3) | P0 |
| FR-AUTH-06 | **Profil kerentanan opsional**: lansia, disabilitas, ibu hamil, balita, hewan/ternak. Disimpan hanya dengan persetujuan eksplisit | P2 |
| FR-AUTH-07 | Peran pengguna: `warga`, `relawan`, `admin`. Peran relawan diberikan admin | P1 |

**Acceptance criteria (FR-AUTH-03):**
- Tombol "Masuk sebagai tamu" tersedia di layar pertama.
- Tamu dapat mengatur lokasi, berlangganan push, dan melihat peta.
- Tamu tidak dapat membuat laporan komunitas (agar mengurangi spam), dan diminta mendaftar saat mencoba.

### 7.2 Peringatan

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-ALR-01 | Sistem mengambil data peringatan resmi BMKG (gempa terbaru, peringatan dini cuaca) secara berkala | P0 |
| FR-ALR-02 | Sistem membuat peringatan otomatis ketika level risiko hasil prediksi naik ke **Siaga** atau **Awas** | P1 |
| FR-ALR-03 | Setiap peringatan memiliki format tetap: **Apa**, **Di mana**, **Seberapa parah**, **Lakukan ini** | P0 |
| FR-ALR-04 | Peringatan dikirim lewat **Web Push** hanya ke pengguna yang lokasinya berada di wilayah terdampak | P0 |
| FR-ALR-05 | Saat dibuka dari notifikasi, tampil **layar peringatan penuh** dengan warna sesuai level, teks besar, dan tombol "Lihat rute evakuasi" | P0 |
| FR-ALR-06 | Banner peringatan aktif tampil di atas semua halaman (fallback bila push tidak aktif/iOS belum di-install) | P0 |
| FR-ALR-07 | Pengguna dapat melihat riwayat peringatan untuk wilayahnya | P1 |
| FR-ALR-08 | Tombol **"Saya aman"** pada peringatan aktif; status tersimpan dan dapat dibagikan ke kontak darurat | P1 |
| FR-ALR-09 | Peringatan tersedia dalam bahasa Indonesia; bahasa daerah dan mode suara (text-to-speech) | P2 |
| FR-ALR-10 | Admin dapat membuat peringatan manual dari dashboard | P2 |

**Acceptance criteria (FR-ALR-04):**
- Pengguna di luar wilayah terdampak tidak menerima push.
- Peringatan dengan level dan wilayah yang sama tidak dikirim ulang dalam 3 jam (cooldown) kecuali level naik.
- Push memuat judul singkat dan level, dan membuka halaman peringatan saat diketuk.

### 7.3 Prediksi

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-PRD-01 | Sistem menghitung **skor risiko banjir (0-100)** per wilayah secara berkala | P1 |
| FR-PRD-02 | Skor dipetakan ke level: **Aman, Waspada, Siaga, Awas** | P1 |
| FR-PRD-03 | Beranda menampilkan status risiko wilayah pengguna beserta **faktor penyebabnya** (transparan) | P1 |
| FR-PRD-04 | Setiap level disertai rekomendasi tindakan ("Siapkan tas siaga, pindahkan barang ke tempat tinggi") | P1 |
| FR-PRD-05 | Skor risiko **longsor** dengan pola yang sama | P2 |
| FR-PRD-06 | Untuk gempa dan tsunami, sistem hanya menampilkan peringatan resmi dan peta risiko, **tanpa klaim prediksi** | P0 |
| FR-PRD-07 | Riwayat skor disimpan untuk kalibrasi bobot | P1 |

**Detail algoritma lihat Bagian 8.**

### 7.4 Maps Evakuasi

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-MAP-01 | Peta menampilkan lokasi pengguna (Geolocation API) dengan opsi memilih lokasi manual jika izin ditolak | P0 |
| FR-MAP-02 | Peta menampilkan **titik evakuasi**: titik kumpul, shelter, rumah sakit/puskesmas, posko | P0 |
| FR-MAP-03 | Pengguna dapat memfilter jenis titik dan melihat detail (nama, alamat, kapasitas, fasilitas) | P0 |
| FR-MAP-04 | Tombol **"Rute ke titik aman terdekat"** menampilkan jalur evakuasi (pre-computed) beserta estimasi jarak dan waktu | P0 |
| FR-MAP-05 | Tombol **"Unduh peta wilayahku"**: menyimpan peta dasar, titik evakuasi, dan rute ke penyimpanan perangkat | P1 |
| FR-MAP-06 | Indikator status offline/online dan status unduhan peta | P1 |
| FR-MAP-07 | Hambatan dari laporan komunitas terverifikasi tampil sebagai penanda di peta | P1 |
| FR-MAP-08 | Rute dinamis (saat online) yang menghindari titik hambatan | P2 |
| FR-MAP-09 | Layer zona risiko (banjir/longsor) di peta | P2 |
| FR-MAP-10 | "Rencana Evakuasi Saya": pengguna menyimpan titik evakuasi favorit dan kontak keluarga | P2 |

**Acceptance criteria (FR-MAP-05):**
- Setelah unduhan selesai dan perangkat diatur ke mode pesawat, halaman Peta tetap menampilkan peta dasar, titik evakuasi, dan rute pre-computed untuk wilayah demo.
- Ukuran unduhan ditampilkan sebelum pengguna mengonfirmasi.

### 7.5 Komunitas

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-COM-01 | Feed laporan warga dalam **radius 1-5 km** (dapat dipilih pengguna) dari lokasi rumah | P1 |
| FR-COM-02 | Pengguna terdaftar dapat membuat laporan: tipe, deskripsi, foto (maks. 1-3), lokasi | P1 |
| FR-COM-03 | Tipe laporan: sungai naik, banjir/genangan, jalan terputus/terblokir, longsor/retakan tanah, bau belerang/aktivitas gunung, kebutuhan bantuan, lainnya | P1 |
| FR-COM-04 | Warga lain dapat **mengonfirmasi** atau **menyangkal** laporan | P1 |
| FR-COM-05 | Laporan menjadi **Terverifikasi** jika dikonfirmasi ≥ 3 warga berbeda atau 1 relawan/admin | P1 |
| FR-COM-06 | Laporan kedaluwarsa otomatis (default 24 jam, atau lebih singkat per tipe) | P1 |
| FR-COM-07 | Pembatasan laporan (rate limit) dan fitur "Laporkan penyalahgunaan" | P1 |
| FR-COM-08 | Notifikasi push untuk laporan terverifikasi berbahaya dalam radius pengguna | P2 |
| FR-COM-09 | Tombol "Saya butuh bantuan" yang menandai lokasi pengguna kepada relawan | P2 |
| FR-COM-10 | Moderasi: relawan/admin dapat menyembunyikan atau menghapus laporan | P1 |

**Acceptance criteria (FR-COM-01):**
- Laporan di luar radius pilihan pengguna tidak muncul.
- Feed diurutkan berdasarkan terbaru, dengan lencana "Terverifikasi" yang jelas.

### 7.6 Mitigasi

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-MIT-01 | Konten mitigasi untuk: banjir, longsor, gempa bumi, tsunami, gunung api, kebakaran hutan dan lahan, cuaca ekstrem | P0 |
| FR-MIT-02 | Tiap bencana disusun dalam tiga fase: **Sebelum, Saat, Sesudah** | P0 |
| FR-MIT-03 | Format ringan: kartu pendek, ilustrasi/ikon, daftar langkah; bahasa sederhana | P0 |
| FR-MIT-04 | **Checklist tas siaga bencana** interaktif, progres tersimpan di perangkat | P1 |
| FR-MIT-05 | Konten mitigasi dapat dibaca offline (di-cache) | P1 |
| FR-MIT-06 | Dari layar peringatan, tersedia tautan langsung ke panduan "Saat" untuk bencana terkait | P1 |
| FR-MIT-07 | Pengelolaan konten melalui dashboard admin (CMS sederhana) | P2 |

> Konten mitigasi harus merujuk pada sumber resmi (BNPB, BMKG, PVMBG, Kementerian Kesehatan) dan mencantumkan sumbernya.

### 7.7 Dashboard Admin/BPBD

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-ADM-01 | Halaman `/admin` hanya dapat diakses peran `admin` dan `relawan` | P2 |
| FR-ADM-02 | Peta sebaran level risiko per wilayah dan laporan komunitas aktif | P2 |
| FR-ADM-03 | Daftar warga yang menandai "Saya butuh bantuan" dan (dengan persetujuan) warga rentan di wilayahnya | P2 |
| FR-ADM-04 | Kelola titik evakuasi (tambah, ubah, nonaktifkan) | P2 |
| FR-ADM-05 | Moderasi laporan dan penunjukan relawan | P2 |
| FR-ADM-06 | Kirim peringatan manual | P2 |

### 7.8 PWA dan Offline

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-PWA-01 | Aplikasi dapat di-install ke layar utama (manifest, ikon, service worker) | P0 |
| FR-PWA-02 | App shell dan halaman utama dapat dibuka offline | P1 |
| FR-PWA-03 | Data kritis tersimpan di IndexedDB: titik evakuasi, rute, konten mitigasi, profil, peringatan terakhir | P1 |
| FR-PWA-04 | Banner informasi saat perangkat offline dan indikator "data terakhir diperbarui pada..." | P1 |
| FR-PWA-05 | Petunjuk "Add to Home Screen" pada iOS agar Web Push dapat berfungsi | P0 |
| FR-PWA-06 | Aksi tulis saat offline (mis. laporan) diantrekan dan dikirim ulang saat online | P2 |

---

## 8. Spesifikasi Prediksi Risiko

### 8.1 Prinsip

1. **Berbasis aturan (rule-based)**, bukan machine learning. Mudah dijelaskan dan diverifikasi.
2. **Transparan**: faktor penyumbang skor ditampilkan kepada pengguna.
3. **Jujur**: bobot adalah asumsi awal yang akan dikalibrasi dengan data historis dan masukan BPBD.
4. **Tahan gangguan**: jika satu sumber data tidak tersedia, bobot dinormalisasi ulang dan sistem menandai data tidak lengkap.

### 8.2 Skor risiko banjir (0-100)

| Faktor | Bobot awal | Normalisasi (0-100) | Sumber |
|---|---|---|---|
| Prakiraan hujan 24 jam | 35% | `min(mm / 150, 1) × 100` | Open-Meteo / BMKG |
| Hujan akumulatif 3 hari terakhir | 25% | `min(mm / 300, 1) × 100` | Open-Meteo |
| Tinggi muka air sungai/pintu air | 20% | Dibandingkan ambang siaga lokal | Data pos duga air (jika tersedia) |
| Kerentanan lokasi (elevasi, jarak ke sungai, riwayat banjir) | 20% | Nilai statis per wilayah (0-100) | InaRISK / input manual |

> Batas 150 mm/hari merujuk pada kategori hujan ekstrem BMKG. Batas 300 mm/3 hari adalah asumsi dan perlu dikalibrasi.

**Fallback:** jika data muka air tidak tersedia, bobot 20% dibagi proporsional ke faktor lain (hujan 24 jam 44%, hujan 3 hari 31%, kerentanan 25%).

### 8.3 Skor risiko longsor (0-100)

| Faktor | Bobot awal | Sumber |
|---|---|---|
| Hujan akumulatif 3-7 hari | 40% | Open-Meteo / BMKG |
| Zona kerentanan gerakan tanah | 30% | PVMBG / InaRISK |
| Kemiringan lereng | 20% | Data elevasi (DEM) |
| Tutupan lahan | 10% | Peta tata guna lahan |

### 8.4 Pemetaan level

| Skor | Level | Warna | Tindakan sistem |
|---|---|---|---|
| 0-25 | **Aman** | Hijau | Tidak ada notifikasi |
| 26-50 | **Waspada** | Kuning | Tampil di beranda |
| 51-75 | **Siaga** | Oranye | Push + layar peringatan |
| 76-100 | **Awas** | Merah | Push prioritas + layar peringatan penuh |

> Warna tidak boleh menjadi satu-satunya pembeda: sertakan teks level dan ikon (aksesibilitas).

### 8.5 Aturan notifikasi

- Push dikirim saat level **naik** ke Siaga atau Awas.
- Cooldown 3 jam untuk kombinasi wilayah, jenis bencana, dan level yang sama.
- Penurunan level mengirim pembaruan di aplikasi (tanpa push), kecuali kembali ke Aman setelah Awas (push informasi).
- Gunakan histeresis (mis. turun level hanya jika skor turun ≥ 5 poin di bawah ambang) agar level tidak bolak-balik.

### 8.6 Contoh implementasi (`lib/risiko.ts`)

```ts
export type Level = "Aman" | "Waspada" | "Siaga" | "Awas";

export interface FaktorBanjir {
  hujan24jMm: number;
  hujan3hariMm: number;
  muka_air?: number | null;   // 0-100, null jika tidak tersedia
  kerentanan: number;         // 0-100
}

export function skorBanjir(f: FaktorBanjir) {
  const h24 = Math.min(f.hujan24jMm / 150, 1) * 100;
  const h3 = Math.min(f.hujan3hariMm / 300, 1) * 100;

  const komponen = [
    { nilai: h24, bobot: 0.35 },
    { nilai: h3, bobot: 0.25 },
    { nilai: f.kerentanan, bobot: 0.2 },
    ...(f.muka_air != null ? [{ nilai: f.muka_air, bobot: 0.2 }] : []),
  ];

  const totalBobot = komponen.reduce((a, k) => a + k.bobot, 0);
  const skor = komponen.reduce((a, k) => a + k.nilai * k.bobot, 0) / totalBobot;

  return { skor: Math.round(skor), level: keLevel(skor), faktor: { h24, h3, ...f } };
}

export function keLevel(skor: number): Level {
  if (skor <= 25) return "Aman";
  if (skor <= 50) return "Waspada";
  if (skor <= 75) return "Siaga";
  return "Awas";
}
```

### 8.7 Kalibrasi (pasca-MVP)

- Simpan setiap hasil skor beserta faktor (`risk_assessments`) untuk dibandingkan dengan kejadian nyata.
- Validasi ambang dengan BPBD/relawan setempat.
- Pengembangan lanjutan: model ML terpisah (mis. FastAPI) setelah data historis cukup.

---

## 9. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Performa** | LCP < 2,5 detik pada 4G dan perangkat Android kelas menengah; JS awal sekecil mungkin; peta dimuat lazy |
| **Keandalan** | Penghitung risiko dan pengambil data BMKG harus idempoten dan aman dijalankan ulang; kegagalan satu sumber data tidak menghentikan proses |
| **Offline** | Fungsi inti (peta, titik evakuasi, rute, mitigasi, peringatan terakhir) tersedia tanpa jaringan setelah data diunduh |
| **Keamanan** | HTTPS wajib; Row Level Security di database; kunci rahasia hanya di server; endpoint cron dilindungi secret; validasi input; rate limiting |
| **Privasi** | Persetujuan eksplisit untuk lokasi dan data kerentanan; minimasi data; lokasi presisi tidak pernah ditampilkan publik (lihat Bagian 14) |
| **Aksesibilitas** | Target WCAG 2.1 AA: kontras warna, ukuran target sentuh ≥ 44px, teks dapat diperbesar, label untuk pembaca layar, tidak bergantung pada warna saja |
| **Kompatibilitas** | Chrome/Edge Android versi terbaru (prioritas utama); Safari iOS 16.4+ (push hanya jika di-install ke Home Screen); desktop modern |
| **Bahasa** | Bahasa Indonesia (default); struktur siap i18n untuk bahasa daerah |
| **Skalabilitas** | Target prototipe: ≥ 1.000 pengguna terdaftar dan ratusan pengguna aktif bersamaan |
| **Observabilitas** | Log hasil cron (sukses/gagal, durasi, jumlah push); pemantauan error (mis. Sentry, opsional) |
| **Biaya** | Berjalan di tier gratis (Vercel Hobby, Supabase Free, GitHub Actions) untuk skala lomba |

---

## 10. Arsitektur dan Tech Stack

### 10.1 Stack

| Lapisan | Pilihan | Catatan |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Frontend dan backend dalam satu proyek |
| Styling/UI | Tailwind CSS + shadcn/ui | Responsif, mobile-first |
| PWA | Serwist (`@serwist/next`) | Service worker, precache, runtime caching |
| Peta | **MapLibre GL JS** + **PMTiles** | Lihat catatan tile offline di bawah |
| Database | **Supabase (PostgreSQL + PostGIS)** | Query radius dengan `ST_DWithin` |
| Auth | **Supabase Auth** (email, Google, anonymous sign-in) | Terintegrasi dengan Row Level Security |
| Storage | Supabase Storage | Foto laporan komunitas |
| Push | **Web Push (VAPID)** dengan library `web-push` | Langganan disimpan di database, dikirim berdasarkan wilayah |
| Tugas terjadwal | **GitHub Actions (cron)** memanggil Route Handler | Vercel Hobby hanya mendukung cron harian |
| Cache lokal | IndexedDB (`idb` atau Dexie) + Cache Storage | Data offline |
| Validasi | Zod | Validasi request/response |
| Testing | Vitest, Playwright | Unit dan end-to-end |
| Hosting | Vercel | HTTPS otomatis |

> **Catatan tile peta offline:** server tile publik OpenStreetMap melarang pengunduhan massal (bulk download/prefetch). Untuk peta offline, gunakan **berkas PMTiles** untuk wilayah demo (diekstrak dari data OpenStreetMap lewat Protomaps/`pmtiles` CLI), disimpan sendiri (mis. di Supabase Storage atau aset statis), lalu diunduh penuh ke perangkat saat pengguna menekan "Unduh peta wilayahku". Cantumkan atribusi OpenStreetMap di peta.

### 10.2 Diagram arsitektur

```
 ┌────────────────────┐   ┌─────────────────────┐
 │ BMKG Open Data     │   │ Open-Meteo          │
 │ (gempa, cuaca)     │   │ (hujan)             │
 └─────────┬──────────┘   └──────────┬──────────┘
           │                         │
           ▼  GitHub Actions cron    ▼
 ┌───────────────────────────────────────────────┐
 │ Next.js Route Handlers (Vercel)               │
 │  /api/cron/peringatan   /api/cron/risiko      │
 │  /api/laporan  /api/evakuasi  /api/push/*     │
 └──────────┬────────────────────────┬───────────┘
            │                        │
            ▼                        ▼
 ┌─────────────────────┐   ┌─────────────────────┐
 │ Supabase            │   │ Web Push Service    │
 │ Postgres + PostGIS  │   │ (VAPID)             │
 │ Auth, Storage, RLS  │   └──────────┬──────────┘
 └──────────┬──────────┘              │
            │ Realtime                ▼
            ▼                 ┌─────────────────┐
 ┌───────────────────────────────────────────────┐
 │ Klien PWA (Next.js, React)                    │
 │ Service Worker + IndexedDB + PMTiles offline  │
 └───────────────────────────────────────────────┘
```

### 10.3 Struktur proyek

```
src/
├─ app/
│  ├─ (auth)/login, register
│  ├─ (main)/
│  │  ├─ beranda/
│  │  ├─ peta/
│  │  ├─ komunitas/
│  │  ├─ mitigasi/[bencana]/
│  │  └─ profil/
│  ├─ peringatan/[id]/          # layar peringatan penuh
│  ├─ admin/                    # dashboard BPBD
│  ├─ offline/page.tsx          # fallback offline
│  └─ api/
│     ├─ cron/peringatan/route.ts
│     ├─ cron/risiko/route.ts
│     ├─ laporan/route.ts
│     ├─ laporan/[id]/konfirmasi/route.ts
│     ├─ push/subscribe/route.ts
│     ├─ evakuasi/route.ts
│     └─ status-aman/route.ts
├─ lib/
│  ├─ risiko.ts          # skor banjir/longsor
│  ├─ cuaca.ts           # fetch Open-Meteo
│  ├─ bmkg.ts            # fetch + parse BMKG
│  ├─ push.ts            # kirim Web Push
│  ├─ geo.ts             # utilitas radius/koordinat
│  ├─ supabase/{client,server}.ts
│  └─ offline/{db,peta}.ts
├─ components/
├─ content/mitigasi/     # konten mitigasi (MDX/JSON)
├─ data/fallback/        # JSON statis cadangan untuk demo
├─ sw.ts                 # service worker (Serwist)
└─ middleware.ts         # proteksi halaman
```

### 10.4 Jadwal tugas terjadwal

| Tugas | Frekuensi | Endpoint |
|---|---|---|
| Ambil peringatan/gempa BMKG | Tiap 10 menit | `/api/cron/peringatan` |
| Hitung skor risiko | Tiap 30 menit | `/api/cron/risiko` |
| Hapus laporan kedaluwarsa | Tiap jam | `/api/cron/bersih` |

Semua endpoint cron dilindungi header `Authorization: Bearer ${CRON_SECRET}`. Perlu dicatat bahwa jadwal GitHub Actions dapat tertunda beberapa menit saat beban tinggi.

---

## 11. Model Data

### 11.1 Entitas utama

| Tabel | Fungsi |
|---|---|
| `profiles` | Data profil, lokasi rumah, peran, kontak darurat, profil kerentanan |
| `regions` | Wilayah (kelurahan/desa) dengan poligon dan skor kerentanan statis |
| `risk_assessments` | Riwayat skor risiko per wilayah dan jenis bencana |
| `alerts` | Peringatan (dari BMKG, prediksi, atau manual) |
| `evacuation_points` | Titik kumpul, shelter, RS, posko |
| `evacuation_routes` | Rute pre-computed (GeoJSON) menuju titik evakuasi |
| `community_reports` | Laporan warga |
| `report_confirmations` | Konfirmasi/sangkalan laporan |
| `safety_status` | Status "Saya aman"/"Butuh bantuan" |
| `push_subscriptions` | Langganan Web Push per pengguna/perangkat |
| `mitigation_contents` | Konten mitigasi (jika dikelola lewat database) |

### 11.2 Skema SQL (ringkas)

```sql
create extension if not exists postgis;

create type hazard_type as enum ('banjir','longsor','gempa','tsunami','gunung_api','karhutla','cuaca_ekstrem');
create type risk_level  as enum ('aman','waspada','siaga','awas');
create type user_role   as enum ('warga','relawan','admin');

create table regions (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tingkat text,                                  -- kelurahan/desa/kecamatan
  geom geography(MultiPolygon, 4326) not null,
  centroid geography(Point, 4326),
  kerentanan_banjir smallint check (kerentanan_banjir between 0 and 100),
  kerentanan_longsor smallint check (kerentanan_longsor between 0 and 100)
);
create index on regions using gist (geom);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  nama text,
  role user_role not null default 'warga',
  home_location geography(Point, 4326),
  region_id uuid references regions(id),
  radius_km smallint not null default 3 check (radius_km between 1 and 5),
  emergency_contacts jsonb default '[]',
  vulnerability jsonb,                           -- hanya terisi jika ada consent
  vulnerability_consent boolean not null default false,
  created_at timestamptz default now()
);

create table risk_assessments (
  id bigint generated always as identity primary key,
  region_id uuid not null references regions(id),
  hazard hazard_type not null,
  skor smallint not null,
  level risk_level not null,
  faktor jsonb not null,
  data_lengkap boolean not null default true,
  computed_at timestamptz not null default now()
);
create index on risk_assessments (region_id, hazard, computed_at desc);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  sumber text not null,                          -- 'bmkg' | 'prediksi' | 'manual'
  hazard hazard_type not null,
  level risk_level not null,
  region_id uuid references regions(id),
  apa text not null,
  di_mana text not null,
  seberapa_parah text not null,
  lakukan_ini text not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  raw jsonb
);
create index on alerts (region_id, issued_at desc);

create table evacuation_points (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tipe text not null check (tipe in ('titik_kumpul','shelter','rumah_sakit','posko')),
  geom geography(Point, 4326) not null,
  alamat text,
  kapasitas int,
  fasilitas text[],
  region_id uuid references regions(id),
  aktif boolean default true
);
create index on evacuation_points using gist (geom);

create table evacuation_routes (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references regions(id),
  point_id uuid references evacuation_points(id),
  geom geography(LineString, 4326) not null,
  jarak_m int,
  durasi_menit int
);

create table community_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  tipe text not null,
  deskripsi text,
  foto_urls text[],
  geom geography(Point, 4326) not null,
  status text not null default 'belum_terverifikasi'
    check (status in ('belum_terverifikasi','terverifikasi','ditolak','disembunyikan')),
  konfirmasi_count int not null default 0,
  created_at timestamptz default now(),
  expires_at timestamptz not null
);
create index on community_reports using gist (geom);

create table report_confirmations (
  report_id uuid references community_reports(id) on delete cascade,
  user_id uuid references auth.users,
  vote smallint not null check (vote in (1,-1)),
  primary key (report_id, user_id)
);

create table safety_status (
  user_id uuid primary key references auth.users,
  status text not null check (status in ('aman','butuh_bantuan')),
  geom geography(Point, 4326),
  updated_at timestamptz default now()
);

create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  region_id uuid references regions(id),
  created_at timestamptz default now()
);
```

### 11.3 Contoh query radius laporan

```sql
select id, tipe, status, konfirmasi_count
from community_reports
where expires_at > now()
  and status <> 'disembunyikan'
  and ST_DWithin(geom, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radius_m)
order by created_at desc;
```

### 11.4 Kebijakan Row Level Security (prinsip)

| Tabel | Baca | Tulis |
|---|---|---|
| `profiles` | Pemilik; admin/relawan hanya untuk data yang diizinkan | Pemilik |
| `regions`, `evacuation_*`, `alerts`, `mitigation_contents` | Publik | Admin |
| `community_reports` | Publik (kecuali `disembunyikan`) | Pengguna terdaftar (milik sendiri); moderasi oleh relawan/admin |
| `report_confirmations` | Pemilik; agregat lewat kolom `konfirmasi_count` | Pengguna terdaftar, satu suara per laporan |
| `safety_status` | Pemilik; kontak darurat/relawan sesuai consent | Pemilik |
| `push_subscriptions` | Server saja (service role) | Pemilik lewat endpoint |

---

## 12. Spesifikasi API

Semua endpoint bertipe JSON dan divalidasi dengan Zod.

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/cron/peringatan` | Ambil dan simpan peringatan BMKG | Secret cron |
| GET | `/api/cron/risiko` | Hitung skor risiko, buat alert, kirim push | Secret cron |
| GET | `/api/cron/bersih` | Hapus/arsipkan laporan kedaluwarsa | Secret cron |
| GET | `/api/risiko?region_id=` | Level dan faktor risiko terbaru | Publik |
| GET | `/api/peringatan?region_id=&aktif=true` | Daftar peringatan | Publik |
| GET | `/api/evakuasi?region_id=` | Titik dan rute evakuasi (untuk cache offline) | Publik |
| GET | `/api/laporan?lat=&lng=&radius_km=` | Laporan dalam radius | Publik |
| POST | `/api/laporan` | Buat laporan | Terdaftar |
| POST | `/api/laporan/[id]/konfirmasi` | Konfirmasi/sangkal laporan | Terdaftar |
| PATCH | `/api/laporan/[id]` | Moderasi (sembunyikan/tolak) | Relawan/Admin |
| POST | `/api/push/subscribe` | Simpan langganan push | Tamu/Terdaftar |
| DELETE | `/api/push/subscribe` | Hapus langganan push | Tamu/Terdaftar |
| POST | `/api/status-aman` | Set status "Saya aman"/"Butuh bantuan" | Tamu/Terdaftar |
| POST | `/api/admin/peringatan` | Buat peringatan manual | Admin |

**Contoh respons `GET /api/risiko`:**

```json
{
  "region_id": "…",
  "hazard": "banjir",
  "skor": 62,
  "level": "siaga",
  "faktor": { "h24": 80, "h3": 55, "kerentanan": 60, "muka_air": null },
  "data_lengkap": false,
  "computed_at": "2026-10-13T08:30:00Z",
  "rekomendasi": "Risiko banjir tinggi. Siapkan tas siaga dan pindahkan barang ke tempat tinggi."
}
```

---

## 13. Sumber Data Eksternal dan Fallback

| Sumber | Data | Risiko | Fallback |
|---|---|---|---|
| **BMKG Open Data** | Gempa terbaru, peringatan dini cuaca | Format/endpoint dapat berubah; ketersediaan tidak dijamin | JSON statis di `data/fallback/` untuk demo; tampilkan "data terakhir diperbarui" |
| **Open-Meteo** | Prakiraan dan hujan historis | Batas pemakaian gratis; non-komersial | Cache hasil terakhir; data simulasi untuk demo |
| **InaRISK (BNPB)** | Kerentanan/risiko wilayah | Akses API belum pasti | Nilai kerentanan diisi manual per wilayah demo dari peta risiko publik |
| **PVMBG/MAGMA** | Zona gerakan tanah, status gunung api | Format beragam | Input manual untuk wilayah demo |
| **OpenStreetMap** | Peta dasar, batas wilayah, jalan | Larangan bulk download tile publik | PMTiles hasil ekstrak sendiri |
| **Data pos duga air** | Tinggi muka air | Umumnya tidak terbuka | Faktor diabaikan, bobot dinormalisasi ulang |

> **Wajib dilakukan di Minggu 1:** verifikasi setiap endpoint (format, batas penggunaan, lisensi) sebelum bergantung padanya, dan siapkan data cadangan untuk demo.

---

## 14. Keamanan, Privasi, dan Etika

### 14.1 Keamanan

- Kunci rahasia (`SUPABASE_SERVICE_ROLE_KEY`, `VAPID_PRIVATE_KEY`, `CRON_SECRET`) hanya di environment server, tidak pernah di klien.
- Row Level Security aktif di semua tabel.
- Validasi semua input dengan Zod; batasi ukuran dan tipe file foto (mis. JPEG/PNG/WebP, maks. 5 MB), kompres di sisi klien.
- Rate limiting pada pembuatan laporan dan konfirmasi (mis. maks. 5 laporan/jam/pengguna).
- Sanitasi teks laporan untuk mencegah XSS.
- Konfirmasi hanya dari pengguna terdaftar, satu suara per laporan, dan tidak boleh mengonfirmasi laporan sendiri.

### 14.2 Privasi (merujuk UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi)

- Lokasi dan data kerentanan diperlakukan sebagai data sensitif.
- Minta persetujuan eksplisit dan jelaskan tujuan penggunaan sebelum mengumpulkan lokasi dan profil kerentanan.
- Profil kerentanan **opsional** dan hanya dapat dilihat relawan/BPBD jika pengguna menyetujui.
- Lokasi di laporan publik dibulatkan/diburamkan (mis. ± 50-100 m) agar tidak membuka alamat persis.
- Pengguna dapat mengekspor dan menghapus datanya.
- Kebijakan privasi dan syarat penggunaan wajib tersedia di aplikasi. Tinjau kembali dengan pihak yang kompeten sebelum peluncuran nyata.

### 14.3 Etika dan penanganan misinformasi

- Peringatan resmi (BMKG/BPBD) selalu ditandai berbeda dari laporan warga.
- Laporan belum terverifikasi diberi label jelas dan tidak memicu push massal.
- Tampilkan disclaimer bahwa aplikasi bukan pengganti peringatan resmi.
- Hindari bahasa yang memicu kepanikan; gunakan instruksi yang jelas dan tenang.

---

## 15. Desain UX dan Antarmuka

### 15.1 Prinsip desain

1. **Satu layar, satu keputusan**: pada kondisi darurat, tampilkan tindakan utama sebesar mungkin.
2. **Teks besar dan kontras tinggi**, ramah lansia dan perangkat murah.
3. **Warna + teks + ikon** untuk level risiko.
4. **Ringan dan cepat**: minim animasi dan aset berat.
5. **Bahasa sederhana**, hindari jargon teknis.

### 15.2 Navigasi (bottom bar)

| Tab | Isi |
|---|---|
| **Beranda** | Status risiko wilayah, ringkasan faktor, peringatan aktif, tombol "Saya aman" |
| **Peta** | Titik evakuasi, rute, hambatan, tombol unduh offline |
| **Komunitas** | Feed laporan radius, tombol buat laporan |
| **Mitigasi** | Panduan per bencana, checklist tas siaga |
| **Profil** | Login/Register, lokasi rumah, kontak darurat, profil kerentanan, pengaturan notifikasi |

Peringatan **bukan tab**: muncul sebagai push, banner, dan layar penuh otomatis.

### 15.3 Layar peringatan penuh

```
┌──────────────────────────────┐
│  [ikon] SIAGA · BANJIR       │  ← latar oranye, teks besar
│                              │
│  APA        Risiko banjir    │
│  DI MANA    Kel. X, Kec. Y   │
│  SEBERAPA   Hujan lebat 12   │
│  PARAH      jam ke depan     │
│  LAKUKAN    Siapkan tas      │
│  INI        siaga, pindahkan │
│             barang ke atas   │
│                              │
│  [ Lihat rute evakuasi ]     │
│  [ Saya aman ]               │
│  Panduan: Saat banjir →      │
└──────────────────────────────┘
```

### 15.4 Daftar halaman

`/` (onboarding), `/login`, `/register`, `/beranda`, `/peta`, `/komunitas`, `/komunitas/baru`, `/mitigasi`, `/mitigasi/[bencana]`, `/mitigasi/tas-siaga`, `/peringatan/[id]`, `/profil`, `/offline`, `/admin/*`.

---

## 16. Strategi PWA dan Offline

| Aset | Strategi |
|---|---|
| App shell (HTML/JS/CSS/ikon) | Precache saat install |
| Halaman Mitigasi | Precache + runtime cache (StaleWhileRevalidate) |
| Data titik evakuasi dan rute | Diunduh saat "Unduh peta wilayahku", disimpan di IndexedDB |
| Peta dasar | Berkas PMTiles wilayah demo, diunduh penuh ke Cache Storage/IndexedDB, dibaca lewat sumber PMTiles kustom |
| Data risiko dan peringatan | NetworkFirst dengan fallback ke data terakhir |
| Foto/laporan | NetworkOnly; aksi tulis diantrekan (P2) |

**Hal yang perlu diperhatikan:**
- Batasi area dan zoom level peta offline agar ukuran terkendali (target < 30 MB untuk wilayah demo) dan tampilkan ukuran sebelum mengunduh.
- Minta `navigator.storage.persist()` agar data tidak mudah dihapus browser.
- iOS: Web Push hanya bekerja jika situs di-install ke Home Screen (iOS 16.4+); sediakan petunjuk di onboarding.
- Notifikasi di latar belakang tidak seandal aplikasi native; hal ini diakui sebagai keterbatasan.

---

## 17. Rencana Pengujian

| Jenis | Cakupan | Alat |
|---|---|---|
| **Unit** | `risiko.ts` (batas level, fallback bobot, histeresis), parser BMKG, utilitas radius | Vitest |
| **Integrasi** | Route Handler cron → database → push (dengan data simulasi) | Vitest + Supabase lokal |
| **E2E** | Alur onboarding, buat laporan, konfirmasi, tampilkan peringatan | Playwright |
| **Offline** | Muat halaman Peta dan Mitigasi dengan `context.setOffline(true)` | Playwright |
| **PWA** | Installable, service worker aktif, manifest valid | Lighthouse |
| **Perangkat nyata** | Android (Chrome) dan iOS (Safari, Home Screen), mode pesawat | Manual |
| **Aksesibilitas** | Kontras, fokus keyboard, pembaca layar dasar | axe DevTools, manual |
| **Uji pengguna** | Minimal 5 orang (termasuk satu lansia) mencoba skenario inti | Observasi + umpan balik |

**Definition of Done tiap fitur:** memenuhi acceptance criteria, lolos lint dan type-check, memiliki pengujian dasar, berfungsi di Android dan tampilan mobile, dan tidak merusak alur demo.

---

## 18. Rencana Pengerjaan (4 Minggu)

| Minggu | Target | Deliverable |
|---|---|---|
| **1** | Fondasi | Desain UI (wireframe + design tokens), setup repo Next.js + Supabase + PWA dasar, skema database, Login/Register + mode tamu, **verifikasi semua API/data eksternal**, seed data wilayah demo |
| **2** | Peta dan Mitigasi | Maps evakuasi (titik + rute pre-computed untuk wilayah demo), konten Mitigasi 7 bencana, checklist tas siaga |
| **3** | Peringatan dan Prediksi | Ingest BMKG, skor risiko banjir, Web Push, layar peringatan penuh, GitHub Actions cron |
| **4** | Komunitas, Offline, Finalisasi | Laporan + konfirmasi + verifikasi, peta offline (PMTiles), pengujian di perangkat, perbaikan bug, persiapan pitch dan demo |

**Jika waktu mepet, korbankan (urut dari pertama):** dashboard admin, profil kerentanan, prediksi longsor, rute dinamis, bahasa daerah.
**Jangan dikorbankan:** peta/rute offline dan alur demo end-to-end.

---

## 19. Skenario Demo untuk Juri

1. Buka situs di HP, install ke layar utama, masuk sebagai tamu, atur lokasi rumah.
2. Tekan "Unduh peta wilayahku" dan tunggu selesai.
3. Picu **data hujan simulasi** untuk wilayah demo → skor banjir naik ke **Siaga**.
4. Push masuk: layar peringatan penuh tampil dengan format Apa/Di mana/Seberapa parah/Lakukan ini.
5. Aktifkan **mode pesawat**, buka Peta → peta, titik evakuasi, dan rute tetap tampil.
6. Nyalakan internet, buat laporan "Jalan A terendam" dari akun kedua → akun ketiga mengonfirmasi → status **Terverifikasi** dan muncul di peta.
7. Tekan **"Saya aman"**.
8. (Opsional) Tunjukkan dashboard admin yang menampilkan sebaran risiko dan laporan.

> Siapkan mode demo dengan data simulasi dan data fallback agar demo tidak bergantung pada kondisi cuaca dan ketersediaan API pihak ketiga. Katakan secara jujur bahwa data demo disimulasikan.

---

## 20. Risiko dan Mitigasi

| # | Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|---|
| R1 | API BMKG/InaRISK berubah atau tidak stabil | Tinggi | Sedang | Verifikasi dini, data fallback statis, penanganan error |
| R2 | Peta offline di web sulit dan ukuran membengkak | Tinggi | Sedang | PMTiles satu wilayah kecil, batasi zoom, uji awal di Minggu 2-3 |
| R3 | Web Push tidak andal (terutama iOS) | Sedang | Tinggi | Banner dalam aplikasi, petunjuk install, jujur soal batasan, native sebagai pengembangan lanjutan |
| R4 | Cron GitHub Actions tertunda | Sedang | Sedang | Interval aman, tampilkan waktu pembaruan terakhir |
| R5 | Skor prediksi dianggap klaim ilmiah | Tinggi | Sedang | Label "estimasi", bobot dijelaskan, hanya banjir/longsor, tidak ada prediksi gempa |
| R6 | Hoaks dan spam lewat laporan komunitas | Tinggi | Sedang | Verifikasi multi-warga, rate limit, moderasi, laporan belum terverifikasi tidak memicu push massal |
| R7 | Kebocoran data lokasi/kerentanan | Tinggi | Rendah | RLS, consent, pembulatan lokasi, minimasi data |
| R8 | Waktu pengerjaan tidak cukup | Tinggi | Sedang | Prioritas P0/P1/P2, wilayah dan bencana demo dibatasi |
| R9 | Batas tier gratis (Supabase/Vercel/Open-Meteo) terlampaui | Rendah | Rendah | Cache, batasi frekuensi, pantau penggunaan |
| R10 | Data titik evakuasi tidak akurat | Tinggi | Sedang | Validasi lapangan/BPBD untuk wilayah demo, tampilkan tanggal verifikasi |

---

## 21. Pengembangan Lanjutan (Roadmap)

1. Aplikasi native (Flutter/React Native) untuk notifikasi kritis yang lebih andal.
2. Kanal cadangan: SMS, cell broadcast, WhatsApp/Telegram bot.
3. Mesh alert antar perangkat (tersedia di aplikasi native).
4. Model prediksi berbasis machine learning dengan data historis (layanan terpisah, mis. FastAPI).
5. Integrasi sensor IoT murah (tinggi muka air, getaran tanah).
6. Sistem "Buddy": pasangan tetangga untuk membantu warga rentan.
7. Rute evakuasi dinamis penuh dengan routing engine sendiri (Valhalla/OSRM).
8. Gamifikasi simulasi evakuasi dan kesiapsiagaan keluarga.
9. Dukungan bahasa daerah dan mode suara penuh.
10. Kemitraan dan integrasi resmi dengan BPBD/BNPB.

---

## 22. Pertanyaan Terbuka

| # | Pertanyaan | Penanggung jawab | Batas waktu |
|---|---|---|---|
| Q1 | Wilayah demo yang dipilih (kelurahan/desa) dan datanya | [ISI] | Minggu 1 |
| Q2 | Sumber resmi batas wilayah (poligon) dan lisensinya | [ISI] | Minggu 1 |
| Q3 | Apakah data tinggi muka air tersedia untuk wilayah demo? | [ISI] | Minggu 1 |
| Q4 | Akses ke BPBD/relawan untuk validasi titik evakuasi dan ambang risiko | [ISI] | Minggu 2 |
| Q5 | Nama final aplikasi dan identitas visual | [ISI] | Minggu 1 |
| Q6 | Sumber dan penulis konten mitigasi (rujukan resmi) | [ISI] | Minggu 2 |

---

## Lampiran A: Variabel Environment

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server saja
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=                # server saja
VAPID_SUBJECT=mailto:tim@contoh.id
CRON_SECRET=                      # server saja
NEXT_PUBLIC_PMTILES_URL=          # URL berkas PMTiles wilayah demo
NEXT_PUBLIC_DEMO_MODE=false       # true: pakai data simulasi
```

## Lampiran B: Contoh Workflow GitHub Actions (cron risiko)

```yaml
name: cron-risiko
on:
  schedule:
    - cron: "*/30 * * * *"
  workflow_dispatch:
jobs:
  hit:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -fsS -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            "${{ secrets.APP_URL }}/api/cron/risiko"
```

## Lampiran C: Glosarium

| Istilah | Arti |
|---|---|
| **BMKG** | Badan Meteorologi, Klimatologi, dan Geofisika |
| **BNPB / BPBD** | Badan Nasional / Daerah Penanggulangan Bencana |
| **PVMBG** | Pusat Vulkanologi dan Mitigasi Bencana Geologi |
| **InaRISK** | Portal kajian risiko bencana BNPB |
| **PWA** | Progressive Web App: situs yang dapat di-install dan bekerja offline |
| **PostGIS** | Ekstensi PostgreSQL untuk data geospasial |
| **PMTiles** | Format satu berkas untuk tile peta, cocok untuk penyimpanan offline |
| **VAPID** | Standar identifikasi server untuk Web Push |
| **RLS** | Row Level Security, kontrol akses per baris di database |
| **Hiperlokal** | Cakupan informasi pada level lingkungan (RT/dusun/kelurahan) |
| **Histeresis** | Aturan agar level tidak berubah-ubah akibat fluktuasi kecil skor |
