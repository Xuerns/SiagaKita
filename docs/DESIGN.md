# Donezo — Design System & UI Specification (`DESIGN.md`)

Dokumen ini merinci spesifikasi visual, tata letak (layout), palet warna, tipografi, dan arsitektur komponen untuk aplikasi web manajemen proyek **Donezo**. Panduan ini dirancang sebagai acuan utama bagi developer dan desainer dalam mengimplementasikan antarmuka secara konsisten.

---

## 1. Ikhtisar Desain (Design Philosophy)
Donezo mengusung gaya visual **Modern Clean SaaS Dashboard** dengan pendekatan **Bento Grid Layout**. 
- **Karakteristik Utama:** Sudut membulat yang lembut (*generous rounded corners*), hierarki tipografi yang tegas, penggunaan ruang kosong (*whitespace*) yang lega, dan aksen warna hijau zamrud tua (*deep emerald/forest green*) yang memberikan kesan produktif, tenang, dan profesional.
- **Visual Cues:** Penggunaan pola garis diagonal (*diagonal stripes*) untuk merepresentasikan data yang bersifat *pending* atau belum aktif, serta kartu bergradasi gelap dengan tekstur gelombang organik untuk komponen aksi khusus.

---

## 2. Palet Warna (Color Palette)

### 2.1. Warna Utama (Primary & Brand Colors)
| Nama Token | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| `--color-primary-900` | `#0F3822` | Latar belakang kartu gelap (Time Tracker, Promo Card), bagian atas gradasi kartu utama. |
| `--color-primary-700` | `#1B5E3A` | Warna utama tombol (Primary CTA), indikator aktif, bagian dari grafik (in-progress). |
| `--color-primary-500` | `#287F4F` | Bagian bawah gradasi kartu *Total Projects*, ikon aktif, grafik bar standar. |
| `--color-primary-300` | `#5AC48A` | Grafik bar *highlight* (hari Selasa / 74%), aksen sekunder. |

### 2.2. Warna Netral (Background & Surface)
| Nama Token | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| `--bg-canvas` | `#E8ECEB` | Latar belakang terluar (outer frame/desktop background). |
| `--bg-app` | `#FFFFFF` | Latar belakang kontainer utama aplikasi & permukaan kartu (*card surface*). |
| `--bg-surface-subtle` | `#F7F8F9` | Latar belakang Sidebar, Topbar search input, dan *canvas* area konten dashboard. |
| `--border-subtle` | `#EBEBEB` | Garis tepi kartu tipis atau pembatas elemen. |
| `--border-strong` | `#1B5E3A` | Garis tepi tombol sekunder (*outline button*). |

### 2.3. Warna Teks (Typography Colors)
| Nama Token | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| `--text-primary` | `#111827` | Judul halaman, angka metrik besar, judul kartu, nama pengguna. |
| `--text-secondary` | `#6B7280` | Sub-judul, label menu tidak aktif, alamat email, *timestamp*. |
| `--text-muted` | `#9CA3AF` | Kategori menu (`MENU`, `GENERAL`), teks *placeholder* pencarian. |
| `--text-on-primary` | `#FFFFFF` | Teks di atas tombol hijau dan kartu berlatar gelap. |

### 2.4. Warna Semantik / Status (Status Badges & Actions)
| Status / Elemen | Teks / Ikon (Hex) | Background (Hex) | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Completed / Success** | `#287F4F` | `#E6F4EC` | Badge status "Completed", indikator kenaikan metrik (`5▲`). |
| **In Progress / Warning** | `#D97706` | `#FEF3C7` | Badge status "In Progress". |
| **Pending / Danger** | `#DC2626` | `#FEE2E2` | Badge status "Pending", tombol Stop (merah solid `#E11D48`). |

---

## 3. Tipografi (Typography)

Menggunakan jenis huruf *Geometric Sans-Serif* modern seperti **Plus Jakarta Sans**, **Inter**, atau **Outfit**.

### Skala Tipografi
* **Display / Metric Numbers (Angka KPI & Timer):**
  * Ukuran: `36px` - `44px` (`2.25rem` - `2.75rem`)
  * Ketebalan: `Bold (700)` atau `SemiBold (600)`
  * Line Height: `1.1`
* **Page Title (`Dashboard`):**
  * Ukuran: `30px` (`1.875rem`)
  * Ketebalan: `Bold (700)`
  * Tracking: `-0.02em`
* **Card Title (`Project Analytics`, `Team Collaboration`, dll):**
  * Ukuran: `18px` (`1.125rem`)
  * Ketebalan: `SemiBold (600)`
* **Highlight Subtitle (`Meeting with Arc Company`):**
  * Ukuran: `20px` (`1.25rem`)
  * Ketebalan: `SemiBold (600)`
  * Line Height: `1.3`
* **Body Default (Menu, Nama Item, Tombol):**
  * Ukuran: `14px` (`0.875rem`)
  * Ketebalan: `Medium (500)` untuk item aktif/judul list, `Regular (400)` untuk teks biasa.
* **Caption / Micro Text (Sub-label, Due Date, Badge, Shortcut):**
  * Ukuran: `12px` (`0.75rem`)
  * Ketebalan: `Regular (400)` atau `Medium (500)`

---

## 4. Tata Letak & Grid (Layout & Spacing)

### 4.1. Struktur Utama Aplikasi
Aplikasi terbagi menjadi 2 kolom utama di dalam sebuah *wrapper* besar (`border-radius: 32px`, `padding: 16px`):
1. **Left Sidebar:** Lebar tetap (`240px` - `260px`), tinggi `100%`, latar belakang `--bg-surface-subtle` (`#F7F8F9`), sudut membulat `24px`.
2. **Main Content Area:** Mengambil sisa ruang (`flex: 1`), terdiri dari:
   * **Top Navigation Bar:** Tinggi `72px`, latar `--bg-surface-subtle`, sudut membulat `20px`.
   * **Dashboard Content Container:** Latar `--bg-surface-subtle`, sudut membulat `24px`, `padding: 24px`.

### 4.2. Sistem Grid Konten (Bento Grid)
Area konten menggunakan sistem grid 12-kolom dengan jarak antar elemen (`gap`) sebesar `16px` hingga `20px`:
* **Baris 1 (Header & CTA):** Flex `space-between` (Judul di kiri, 2 tombol aksi di kanan).
* **Baris 2 (KPI Summary Cards):** 4 kolom setara (`grid-template-columns: repeat(4, 1fr)`).
* **Baris 3 & 4 (Bento Asymmetric Layout):**
  * **Kolom Kiri-Tengah (Lebar ~75% / 9 kolom):**
    * Atas: `Project Analytics` (Lebar ~60%) + `Reminders` (Lebar ~40%).
    * Bawah: `Team Collaboration` (Lebar ~55%) + `Project Progress` (Lebar ~45%).
  * **Kolom Kanan (Lebar ~25% / 3 kolom, memanjang vertikal):**
    * Atas: `Project` (Daftar proyek vertikal).
    * Bawah: `Time Tracker` (Kartu timer kompak).

### 4.3. Border Radius & Elevasi
* **Outer App Wrapper:** `32px`
* **Cards / Panels:** `20px` - `24px`
* **Buttons & Inputs:** `9999px` (Pill-shaped / membulat penuh)
* **Small Badges / Tags:** `6px` - `8px`
* **Box Shadow:** Sangat lembut atau tanpa bayangan karena mengandalkan kontras warna kartu putih (`#FFFFFF`) di atas kanvas abu-abu muda (`#F7F8F9`). Jika diperlukan: `0 4px 20px -2px rgba(0, 0, 0, 0.03)`.

---

## 5. Spesifikasi Komponen (Component Specifications)

### 5.1. Sidebar Navigation
* **Brand Logo:** Ikon lingkaran konsentris membentuk pola menyerupai daun/tetesan air berwarna hijau (`#1B5E3A`) diikuti teks **Donezo** (`20px`, Bold).
* **Section Headers (`MENU`, `GENERAL`):** Huruf kapital semua (*uppercase*), ukuran `11px`, warna `--text-muted`, `letter-spacing: 0.05em`.
* **Nav Item:**
  * **State Aktif (`Dashboard`):** Teks tebal (`#111827`), ikon hijau solid (`#1B5E3A`), dilengkapi indikator bar vertikal hijau di tepi paling kiri (`width: 4px`, `height: 24px`, `border-radius: 0 4px 4px 0`).
  * **State Inaktif:** Ikon *outline* abu-abu dan teks `--text-secondary`.
  * **Badge Notifikasi (`Tasks 12+`):** Pill kecil berwarna hijau gelap (`#0F3822`) dengan teks putih `11px` di sebelah kanan item menu.
* **Promotional Card (Bottom Sidebar):**
  * Latar belakang hitam kehijauan (`#0A2617`) dengan ilustrasi gelombang abstrak hijau tua.
  * Ikon lencana putih di kiri atas, judul "Download our Mobile App", sub-teks kecil, dan tombol penuh (full-width pill button) berwarna `#1B5E3A`.

### 5.2. Top Header Bar
* **Search Bar:** Input berbentuk *pill* (`width: 320px`, `background: #FFFFFF`), ikon kaca pembesar di kiri, teks *placeholder* "Search task", dan lencana pintasan keyboard `⌘ F` (`background: #F3F4F6`, `border-radius: 6px`) di sisi kanan dalam input.
* **Action Icons & Profile (Kanan):**
  * 2 tombol ikon bundar (`40px x 40px`, latar `#FFFFFF`): Ikon Pesan (amplop) dan Notifikasi (lonceng).
  * **User Profile:** Avatar ilustrasi 3D di dalam lingkaran (`44px x 44px`, latar merah muda lembut), diikuti nama pengguna (**Totok Michael**) dan email di bawahnya.

### 5.3. Tombol Aksi (Buttons)
* **Primary Button (`+ Add Project`, `Start Meeting`):**
  * Latar: `#1B5E3A` (atau gradasi halus ke `#14492D`), Teks: `#FFFFFF`, Bentuk: Pill (`border-radius: 9999px`), Padding: `10px 20px`.
* **Secondary / Outline Button (`Import Data`, `+ Add Member`, `+ New`):**
  * Latar: `#FFFFFF`, Border: `1.5px solid #1B5E3A` (atau `#D1D5DB` untuk ukuran kecil), Teks: `#111827`, Bentuk: Pill.

### 5.4. Kartu KPI (Metric Cards)
Terdiri dari 4 kartu dengan struktur seragam:
* **Header Kartu:** Judul metrik di kiri atas, tombol ikon panah diagonal (`↗`) di dalam lingkaran ber-border tipis di kanan atas (`32px x 32px`).
* **Body Kartu:** Angka metrik berukuran besar (`40px`).
* **Footer Kartu:** Lencana kecil berborder (`5▲`, `6▲`, `2▲`) diikuti keterangan "Increased from last month" atau status teks ("On Discuss").
* **Varian Kartu Pertama (`Total Projects`):** Memiliki latar belakang gradasi hijau (`linear-gradient(135deg, #134E2E 0%, #287F4F 100%)`), seluruh teks berwarna putih/hijau muda terang, dan tombol panah berlatar putih solid. Tiga kartu lainnya berlatar putih bersih (`#FFFFFF`).

### 5.5. Kartu Project Analytics (Bar Chart)
* Menampilkan 7 batang vertikal berbentuk *pill* penuh (`border-radius: 9999px`, lebar `~42px`) yang mewakili hari `S M T W T F S`.
* **3 Status Visual Batang:**
  1. **Striped (Garis Diagonal Abu-abu):** Untuk hari Minggu, Kamis, Jumat, Sabtu (data kosong/proyeksi).
  2. **Solid Green:** Hijau standar (`#1B5E3A`) untuk Senin, Hijau tua (`#0F3822`) untuk Rabu.
  3. **Highlighted Active Bar:** Hijau terang (`#5AC48A`) untuk Selasa, dilengkapi *tooltip* melayang di atasnya (`74%`) dengan garis penghubung titik kecil.

### 5.6. Kartu Reminders
* Menampilkan pengingat rapat terdekat dengan tipografi judul yang menonjol (`Meeting with Arc Company`).
* Sub-teks waktu (`Time : 02.00 pm - 04.00 pm`) berwarna abu-abu.
* Tombol aksi penuh di bagian bawah (`Start Meeting`) dengan ikon kamera video di sebelah kiri teks.

### 5.7. Kartu Team Collaboration
* Header dengan judul di kiri dan tombol kecil `+ Add Member` di kanan.
* Daftar vertikal 4 anggota tim:
  * Avatar bulat (`40px`) dengan latar warna pastel berbeda-beda.
  * Nama anggota (Bold `14px`) dan deskripsi tugas di bawahnya (`Working on` + **Nama Tugas** dalam cetak tebal).
  * Badge status di sisi paling kanan (`Completed`, `In Progress`, `Pending`).

### 5.8. Kartu Project Progress (Gauge / Semi-Circle Chart)
* Menggunakan grafik setengah lingkaran (*semi-circle donut chart*) tebal dengan ujung membulat (`stroke-linecap: round`).
* Segmen grafik dibagi menjadi 3 bagian: Hijau sedang (`Completed`), Hijau gelap (`In Progress`), dan Arsir garis diagonal (`Pending`).
* Di tengah lengkungan terdapat teks persentase besar **`41%`** dan sub-label `Project Ended`.
* Bagian bawah kartu menampilkan legenda horizontal untuk ketiga status tersebut.

### 5.9. Kartu Project List (Right Column)
* Header dengan judul `Project` dan tombol kecil `+ New`.
* Daftar 5 item proyek, masing-masing terdiri dari:
  * Ikon warna-warni unik di sisi kiri (`36px x 36px`).
  * Judul tugas (`14px`, SemiBold) dan tenggat waktu (`Due date: Nov 26, 2024`, `12px`, abu-abu).

### 5.10. Kartu Time Tracker
* Latar belakang gambar/vektor gelombang 3D bernuansa hijau gelap (`#092214` hingga `#1B5E3A`).
* Judul `Time Tracker` berwarna putih di kiri atas.
* Tampilan angka stopwatch digital berukuran besar di tengah: **`01:24:08`** (`36px`, putih, *tabular-nums* agar angka tidak bergeser saat berjalan).
* Dua tombol kontrol bundar di bagian bawah tengah:
  * **Pause Button:** Lingkaran putih (`44px`) dengan ikon jeda (`||`) hijau tua.
  * **Stop Button:** Lingkaran merah (`#E11D48`, `44px`) dengan ikon persegi putih di tengah.

---

## 6. Panduan Implementasi Teknis (CSS / Tailwind Hints)

Jika mengimplementasikan desain ini menggunakan **Tailwind CSS**, berikut adalah pola utilitas yang direkomendasikan:

* **Pola Garis Diagonal (Striped Pattern CSS):**
  Untuk membuat efek arsir pada grafik *Project Analytics* dan *Project Progress*:
  ```css
  .bg-striped {
    background-image: repeating-linear-gradient(
      -45deg,
      #9CA3AF,
      #9CA3AF 2px,
      transparent 2px,
      transparent 6px
    );
  }
  ```
* **Gradasi Kartu Utama (Total Projects):**
  ```css
  .bg-primary-gradient {
    background: linear-gradient(145deg, #114227 0%, #267D4D 100%);
  }
  ```
* **Iconography:** Gunakan pustaka ikon dengan garis membulat yang konsisten seperti **Lucide Icons**, **Phosphor Icons**, atau **Heroicons** (`stroke-width: 1.75px`).