import { WeatherCurrent, ForecastDay, ActiveWarning, CommunityReport, ChecklistItem } from "@/types";

// Data cuaca awal / fallback default (kondisi normal, data dinamis akan dimuat dari API BMKG asli)
export const mockCurrentWeather: WeatherCurrent = {
  temp: 27,
  condition: "Cerah Berawan",
  location: "Kota Bandung",
  forecastRange: "21° – 31°",
  source: "BMKG",
  lastUpdated: "Hari ini · 12.00 WIB",
  precipitationMm: 0,
  humidity: 68,
  windSpeed: 10,
  todaySummary: {
    condition: "Cerah berawan",
    range: "21° – 31°",
    timeWindow: "06:00 – 18:00",
  },
};

const INDONESIA_DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const INDONESIA_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

export function getDynamicForecast5Days(baseDate: Date = new Date()): ForecastDay[] {
  const sampleConditions = [
    { condition: "Hujan Ringan", min: 22, max: 28, rainChance: 75 },
    { condition: "Cerah Berawan", min: 21, max: 31, rainChance: 25 },
    { condition: "Berawan", min: 20, max: 29, rainChance: 35 },
    { condition: "Hujan Sedang", min: 19, max: 27, rainChance: 80 },
    { condition: "Cerah", min: 20, max: 32, rainChance: 15 },
  ];

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dayName = i === 0 ? "Hari ini" : INDONESIA_DAYS[d.getDay()];
    const dateStr = `${d.getDate()} ${INDONESIA_MONTHS[d.getMonth()]}`;
    const sample = sampleConditions[i % sampleConditions.length];

    return {
      id: `forecast-${i + 1}`,
      dayName,
      dateStr,
      condition: sample.condition,
      tempMin: sample.min,
      tempMax: sample.max,
      rainChance: sample.rainChance,
    };
  });
}

export const mockForecast5Days: ForecastDay[] = getDynamicForecast5Days();


export const mockActiveWarning: ActiveWarning = {
  id: "warn-01",
  title: "Peringatan Dini Hujan Lebat",
  hazardType: "Banjir & Longsor",
  level: "Siaga",
  affectedArea: "Kec. Bogor Selatan, Kota Bogor",
  validPeriod: "14 Okt 2026, 10:20 – 16:20 WIB",
  issuedTime: "14 Okt 2026 · 10.20 WIB",
  source: "BMKG",
  description: "Potensi hujan dengan intensitas sedang hingga lebat disertai angin kencang dan kilat.",
  whatHappened: "Curah hujan tinggi (120mm/24 jam) meningkatkan potensi banjir luapan Sungai Ciliwung dan longsor di tebing curam.",
  whereLocation: "Kec. Bogor Selatan, Kelurahan Batutulis, Bondongan, dan Lawanggintung.",
  howSevere: "Level Siaga (Tinggi). Debit air Katulampa berstatus Siaga 2 dengan tren kenaikan.",
  instructions: [
    "Hindari daerah rawan banjir dan bantaran sungai yang berarus deras.",
    "Siapkan tas siaga dan amankan dokumen penting ke tempat tinggi.",
    "Pantau informasi resmi BMKG dan instruksi BPBD Kota Bogor.",
    "Bagi lansia dan anak-anak, disarankan mulai bergerak ke titik evakuasi terdekat bila air menggenang.",
  ],
  isDemoSimulation: false,
};

export const mockEmergencyFullWarning: ActiveWarning = {
  id: "warn-darurat",
  title: "Banjir Bandang Berpotensi Terjadi",
  hazardType: "Banjir Bandang",
  level: "Awas",
  affectedArea: "Kec. Bogor Selatan, Kota Bogor",
  validPeriod: "14 Okt 2026, 10:20 – 16:20 WIB",
  issuedTime: "14 Okt 2026 · 10.20 WIB",
  source: "Simulasi",
  description: "PERINGATAN DARURAT: Luapan air ekstrem terdeteksi di hulu sungai. Evakuasi segera area bantaran sungai.",
  whatHappened: "Curah hujan ekstrem di hulu meningkatkan debit air secara tiba-tiba melampaui ambang batas bahaya.",
  whereLocation: "Wilayah bantaran Sungai Ciliwung Kec. Bogor Selatan (Batutulis, Cipaku, Pamoyanan).",
  howSevere: "Level Awas (Sangat Tinggi). Potensi arus deras dan genangan lebih dari 1.5 meter.",
  instructions: [
    "Segera menuju titik evakuasi terdekat dan hindari perjalanan di area rawan.",
    "Matikan aliran listrik dan gas di dalam rumah sebelum meninggalkan tempat.",
    "Bawa tas siaga yang sudah dipersiapkan.",
    "Ikuti arahan petugas BPBD dan aparat setempat di posko lapangan.",
  ],
  isDemoSimulation: true,
};

export const mockCommunityReports: CommunityReport[] = [
  {
    id: "rep-1",
    userName: "Hendra Wijaya",
    category: "Banjir",
    title: "Banjir di Jl. Melati",
    description: "Air luapan saluran mencapai betis orang dewasa (~30 cm). Kendaraan roda dua sulit melintas.",
    locationName: "Kec. Bogor Selatan",
    timeAgo: "2 jam lalu",
    status: "Terverifikasi",
    confirmationsCount: 14,
    userConfirmed: true,
  },
  {
    id: "rep-2",
    userName: "Siti Rahma",
    category: "Sungai Naik",
    title: "Sungai Ciliwung naik",
    description: "Tinggi muka air di jembatan Batutulis terpantau naik mendekati batas tanggul peringatan.",
    locationName: "Kec. Bogor Timur",
    timeAgo: "3 jam lalu",
    status: "Terverifikasi",
    confirmationsCount: 28,
  },
  {
    id: "rep-3",
    userName: "Budi Santoso",
    category: "Jalan Terputus",
    title: "Jalan terputus akibat genangan",
    description: "Akses penghubung RT 03/RW 04 tergenang air 50cm, mobil dan motor dialihkan lewat jalan atas.",
    locationName: "Kec. Tanah Sareal",
    timeAgo: "4 jam lalu",
    status: "Dalam Verifikasi",
    confirmationsCount: 6,
  },
  {
    id: "rep-4",
    userName: "Ahmad Fauzi",
    category: "Longsor",
    title: "Longsor kecil tebing gang",
    description: "Material tanah longsor menutupi separuh jalan setapak. Sudah dipasang tali pengaman oleh warga.",
    locationName: "Kec. Bogor Barat",
    timeAgo: "5 jam lalu",
    status: "Terverifikasi",
    confirmationsCount: 19,
  },
];

export const initialChecklistItems: ChecklistItem[] = [
  { id: "c1", label: "Air minum (minimal 3 liter per orang)", sublabel: "Cukupi untuk kebutuhan 3 hari", completed: true, category: "essential" },
  { id: "c2", label: "Makanan ringan & tahan lama", sublabel: "Biskuit, makanan kaleng berprotein", completed: true, category: "essential" },
  { id: "c3", label: "Obat-obatan pribadi & P3K", sublabel: "Termasuk antiseptik & obat rutin keluarga", completed: true, category: "health" },
  { id: "c4", label: "Dokumen penting (KTP, KK, Akta)", sublabel: "Bungkus dalam plastik kedap air", completed: false, category: "document" },
  { id: "c5", label: "Senter + baterai cadangan", sublabel: "Penting saat aliran listrik dipadamkan", completed: false, category: "tools" },
  { id: "c6", label: "Power bank terisi penuh", sublabel: "Untuk komunikasi darurat ponsel", completed: false, category: "tools" },
  { id: "c7", label: "Pakaian ganti & selimut hangat", sublabel: "1-2 pasang baju hangat dan jas hujan", completed: false, category: "essential" },
  { id: "c8", label: "Masker dan hand sanitizer", sublabel: "Perlindungan debu & kebersihan pengungsian", completed: false, category: "health" },
];

export const mockMitigationGuides = [
  {
    id: "banjir",
    title: "Banjir & Banjir Bandang",
    iconName: "Droplets",
    desc: "Panduan kesiapsiagaan menghadapi luapan air sungai dan genangan lebat (Standar BNPB).",
    sebelum: [
      "Ketahui tingkat risiko banjir dan jalur evakuasi di lingkungan tempat tinggal Anda.",
      "Siapkan Tas Siaga Bencana (TSB) berisi air minum, makanan tahan lama, senter, dan obat esensial.",
      "Simpan dokumen berharga (KTP, sertifikat, ijazah) dalam wadah plastik kedap air di tempat tinggi.",
      "Ketahui nomor darurat terpadu BPBD (112) dan lokasi posko pengungsian terdekat.",
    ],
    saat: [
      "Segera matikan sakelar listrik utama (MCB) dan lepas regulator tabung gas bila air mulai masuk rumah.",
      "Jangan berjalan atau berkendara menerobos arus air deras (arus setinggi 15 cm sudah mampu menjatuhkan orang).",
      "Evakuasi segera ke titik kumpul aman atau bangunan bertingkat sebelum jalur darat terputus.",
      "Gunakan tongkat kayu saat berjalan di genangan untuk mendeteksi lubang drainase dan gorong-gorong terbuka.",
    ],
    setelah: [
      "Pastikan instalasi listrik sudah diperiksa petugas atau kering sempurna sebelum menyalakan daya.",
      "Waspadai hewan berbisa (ular, kelabang, kalajengking) yang mencari perlindungan di dalam rumah.",
      "Sterilkan dinding dan perabotan dengan cairan disinfektan untuk mencegah penyebaran bakteri leptospirosis.",
      "Hanya konsumsi air yang telah dimasak hingga mendidih dan bersumber dari sanitasi bersih.",
    ],
  },
  {
    id: "longsor",
    title: "Tanah Longsor",
    iconName: "Mountain",
    desc: "Prosedur mitigasi tebing retak, lereng labil, dan hujan lebat berdurasi panjang (Standar PVMBG).",
    sebelum: [
      "Amati retakan baru pada tanah lereng, dinding bangunan, atau tiang listrik yang mulai miring.",
      "Hindari menggunduli vegetasi di tebing dan jangan membangun hunian tepat di bawah lereng curam.",
      "Tanam pepohonan berakar tunggang dalam (seperti bambu, vetiver, beringin) guna menahan massa tanah.",
    ],
    saat: [
      "Jika terdengar suara gemuruh menggelegar atau pohon berpatahan, segera lari menjauhi arah lereng.",
      "Evakuasi ke tempat datar dan stabil, hindari lembah sempit atau dasar cekungan aliran lumpur.",
      "Prioritaskan keselamatan jiwa kelompok rentan: lansia, anak-anak, dan penyandang disabilitas.",
    ],
    setelah: [
      "Jangan terburu-buru kembali ke pemukiman karena ada risiko longsor susulan jika hujan masih berlanjut.",
      "Bantu regu SAR mendata anggota keluarga di posko dan ikuti instruksi evakuasi tim gabungan.",
    ],
  },
  {
    id: "gempa",
    title: "Gempa Bumi",
    iconName: "Activity",
    desc: "Prosedur penyelamatan resmi BMKG: Berlutut, Lindungi kepala, Bertahan (Drop, Cover, Hold On).",
    sebelum: [
      "Pastikan lemari pakaian, rak buku berat, dan water heater tertambat kuat ke dinding semen.",
      "Identifikasi zona aman dalam rumah: di bawah meja kayu tebal atau di samping pilar struktur kokoh.",
      "Sepakati titik kumpul darurat keluarga di tanah lapang yang bebas dari bahaya reruntuhan.",
    ],
    saat: [
      "Terapkan Drop, Cover, Hold On: Berlutut, lindungi kepala & leher dengan bantal/tangan di bawah meja kokoh.",
      "Jauhi kaca jendela, cermin, lampu gantung, dan dinding bata yang rentan roboh seketika.",
      "Jika berada di luar gedung, segera menuju ke area terbuka; jauhi tiang listrik, baliho, dan jembatan.",
    ],
    setelah: [
      "Evakuasi keluar bangunan menggunakan tangga darurat manual, JANGAN PERNAH gunakan lift/elevator.",
      "Waspadai gempa susulan (aftershocks) yang dapat merubuhkan struktur bangunan yang sudah retak.",
      "Tutup katup gas dan jangan menyalakan korek api bila tercium bau gas bocor.",
    ],
  },
  {
    id: "tsunami",
    title: "Tsunami & Gelombang Pasang",
    iconName: "Waves",
    desc: "Pedoman evakuasi mandiri BMKG InaTEWS & Aturan Emas 20-20-20 untuk masyarakat pesisir.",
    sebelum: [
      "Ketahui peta jalur evakuasi vertikal tsunami pantai (TES/bukit) di wilayah pesisir Anda.",
      "Pahami prinsip evakuasi mandiri 20-20-20: Gempa terasa 20 detik, evakuasi dalam 20 menit, menuju ketinggian 20 meter.",
      "Sepakati rute tercepat berjalan kaki menuju bukit atau bangunan beton bertingkat minimal lantai 3.",
    ],
    saat: [
      "Jika merasakan gempa berayun kuat atau air laut surut tiba-tiba (Smong), SEGERA LARI KE TEMPAT TINGGI.",
      "Jangan menunggu sirine tsunami atau pengumuman konfirmasi jika Anda berada dekat garis pantai.",
      "Hindari melintasi jembatan muara sungai karena gelombang tsunami merambat sangat cepat melalui kanal sungai.",
      "Tinggalkan kendaraan bermotor di tempat aman jika lalu lintas macet; prioritaskan lari secepat mungkin.",
    ],
    setelah: [
      "Tetap berada di tempat tinggi hingga BMKG resmi mencabut status Peringatan Dini Tsunami Berakhir.",
      "Ingat bahwa gelombang tsunami susulan kedua dan ketiga seringkali lebih tinggi dan lebih merusak.",
      "Waspadai puing tajam, kawat berduri, dan hewan laut yang terbawa arus ke daratan.",
    ],
  },
  {
    id: "gunungapi",
    title: "Erupsi Gunung Api",
    iconName: "Flame",
    desc: "Pedoman resmi PVMBG (Badan Geologi) menghadapi abu vulkanik, awan panas, dan lahar hujan.",
    sebelum: [
      "Pahami status aktivitas gunung api (Level I Normal, Level II Waspada, Level III Siaga, Level IV Awas).",
      "Ketahui batas Kawasan Rawan Bencana (KRB III zona bahaya primer, KRB II zona lontaran material).",
      "Sediakan masker partikulat tinggi (N95 / kain basah tebal), kacamata pelindung (goggles), dan penutup kepala.",
      "Tutup rapat tandon penampungan air minum dan sumber makanan agar terhindar dari racun abu belerang.",
    ],
    saat: [
      "Patuhi radius steril rekomendasi PVMBG, jangan beraktivitas di dekat kawah aktif atau lembah sungai.",
      "Gunakan baju lengan panjang, celana panjang, masker rapat, dan kacamata (JANGAN memakai lensa kontak).",
      "Jauhi aliran sungai yang berhulu di puncak gunung untuk menghindari bahaya lahar dingin saat hujan.",
    ],
    setelah: [
      "Bersihkan tumpukan abu vulkanik di atap rumah secara gotong royong agar atap tidak ambruk karena beban abu basah.",
      "Cuci sayuran, buah, dan peralatan masak dengan air bersih mengalir sebelum dikonsumsi.",
      "Kurangi kecepatan berkendara karena jalanan berpasir/berabu sangat licin dan jarak pandang berkurang drastis.",
    ],
  },
  {
    id: "cuaca",
    title: "Cuaca Ekstrem & Puting Beliung",
    iconName: "Wind",
    desc: "Panduan antisipasi badai petir, angin kencang, dan hujan es (Standar Meteorologi BMKG).",
    sebelum: [
      "Pangkas dahan pohon yang rapuh atau rimbun di dekat atap rumah dan kabel listrik.",
      "Periksa kekokohan genteng, seng, dan talang air sebelum memasuki musim pancaroba.",
      "Pantau radar cuaca dan citra satelit peringatan dini BMKG harian.",
    ],
    saat: [
      "Bila melihat pusaran awan hitam puting beliung, segera berlindung di ruangan tertutup dan terendah (pusat rumah).",
      "Jauhi tiang listrik, papan reklame, dan pohon besar yang rentan tumbang tersapu angin kencang.",
      "Cabut kabel peralatan elektronik saat terjadi badai petir beruntun guna mencegah sambaran lonjakan arus.",
    ],
    setelah: [
      "Hindari menyentuh kabel listrik yang putus atau tergeletak di atas genangan air.",
      "Periksa kondisi rangka atap dari kerusakan struktural sebelum kembali menempati ruangan atas.",
    ],
  },
  {
    id: "kebakaran",
    title: "Kebakaran Hutan & Lahan",
    iconName: "Flame",
    desc: "Pedoman pencegahan dan perlindungan kesehatan dari bahaya kabut asap pekat (BNPB & KLHK).",
    sebelum: [
      "Hindari membuka lahan dengan cara membakar semak belukar atau jerami pada musim kemarau kering.",
      "Sediakan tabung pemadam api ringan (APAR), karung goni basah, atau selang air di dekat pekarangan.",
      "Tutup ventilasi rumah dengan kain basah jika wilayah sekitar mulai tercium asap karhutla.",
    ],
    saat: [
      "Gunakan masker respirator (N95) untuk menyaring partikel berbahaya PM2.5 dari kabut asap kebakaran.",
      "Segera padamkan titik api kecil menggunakan air bertekanan atau karung goni basah sebelum menjalar luas.",
      "Evakuasi menjauhi arah angin yang membawa lidah api dan asap beracun.",
    ],
    setelah: [
      "Banyak minum air putih untuk membantu membersihkan tenggorokan dari iritasi partikel debu arang.",
      "Periksakan diri ke Puskesmas bila mengalami sesak napas berat, batuk berdarah, atau iritasi mata perih.",
    ],
  },
];

