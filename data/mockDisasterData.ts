import { WeatherCurrent, ForecastDay, ActiveWarning, EvacuationPoint, CommunityReport, ChecklistItem } from "@/types";

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
    "Ikuti arahan petugas BPBD dan relawan di posko lapangan.",
  ],
  isDemoSimulation: true,
};

export const mockEvacuationPoints: EvacuationPoint[] = [
  {
    id: "evac-1",
    name: "SMPN 5 Bogor",
    type: "Sekolah",
    address: "Jl. Dadali No. 35, Tanah Sareal, Kota Bogor",
    distanceKm: 1.2,
    travelMinutes: 5,
    capacity: 450,
    verified: true,
    contact: "0251-8321456",
    lat: -6.582,
    lng: 106.793,
  },
  {
    id: "evac-2",
    name: "GOR Pajajaran",
    type: "GOR",
    address: "Jl. Pemuda No. 4, Tanah Sareal, Kota Bogor",
    distanceKm: 1.8,
    travelMinutes: 7,
    capacity: 1200,
    verified: true,
    contact: "0251-8317890",
    lat: -6.574,
    lng: 106.798,
  },
  {
    id: "evac-3",
    name: "Masjid Al-Ikhlas",
    type: "Masjid",
    address: "Jl. Batutulis No. 12, Bogor Selatan",
    distanceKm: 2.4,
    travelMinutes: 10,
    capacity: 300,
    verified: true,
    lat: -6.615,
    lng: 106.809,
  },
  {
    id: "evac-4",
    name: "RSUD Kota Bogor",
    type: "Rumah Sakit",
    address: "Jl. Dr. Sumeru No. 120, Bogor Barat",
    distanceKm: 3.1,
    travelMinutes: 12,
    capacity: 200,
    verified: true,
    contact: "0251-8312292",
    lat: -6.589,
    lng: 106.775,
  },
];

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
    desc: "Panduan kesiapsiagaan menghadapi luapan air sungai dan genangan lebat.",
    sebelum: [
      "Ketahui tingkat risiko banjir dan jalur evakuasi di lingkunganmu.",
      "Siapkan Tas Siaga Bencana (TSB) di tempat yang mudah dijangkau.",
      "Simpan dokumen penting di tempat tinggi dan lapisi plastik kedap air.",
      "Ketahui nomor darurat BPBD (112 atau 0251-8321456) dan posko terdekat.",
    ],
    saat: [
      "Segera matikan sakelar listrik utama dan katup tabung gas bila air mulai masuk rumah.",
      "Jangan berjalan atau berkendara menerobos arus banjir yang deras.",
      "Evakuasi segera ke titik kumpul aman yang telah ditentukan.",
      "Gunakan tongkat/bambu saat berjalan di air untuk merasakan kedalaman dan lubang selokan.",
    ],
    setelah: [
      "Periksa kondisi kelistrikan rumah sebelum menyalakan daya kembali.",
      "Waspadai binatang berbisa (ular, kalajengking) yang terbawa arus air.",
      "Bersihkan dan sterilkan perabotan serta lantai dengan disinfektan.",
      "Hanya konsumsi air bersih yang telah dimasak mendidih.",
    ],
  },
  {
    id: "longsor",
    title: "Tanah Longsor",
    iconName: "Mountain",
    desc: "Langkah mitigasi tebing retak, lereng labil, dan hujan berdurasi panjang.",
    sebelum: [
      "Perhatikan retakan pada dinding, lantai, atau lereng tanah sekitar rumah.",
      "Hindari membangun rumah di bawah lereng tebing yang curam tanpa terasering.",
      "Tanam pepohonan berakar dalam untuk mengikat struktur tanah lereng.",
    ],
    saat: [
      "Jika terdengar suara gemuruh atau pohon berderak, segera lari menjauhi jalur longsoran.",
      "Evakuasi ke tempat datar dan stabil, bukan ke lembah atau dasar cekungan.",
      "Bantu evakuasi lansia, balita, dan penyandang disabilitas terlebih dahulu.",
    ],
    setelah: [
      "Jangan langsung kembali ke rumah karena ada kemungkinan longsor susulan saat hujan.",
      "Bantu tim penyelamat mendata warga yang selamat di posko darurat.",
    ],
  },
  {
    id: "gempa",
    title: "Gempa Bumi",
    iconName: "Activity",
    desc: "Prosedur penyelamatan resmi BMKG: Jatuhkan diri, Lindungi kepala, Bertahan.",
    sebelum: [
      "Pastikan lemari dan perabot berat tertambat kuat ke dinding.",
      "Kenali tempat aman di dalam rumah: di bawah meja kokoh atau sudut tiang utama.",
      "Sepakati titik kumpul keluarga di tanah lapang.",
    ],
    saat: [
      "Drop, Cover, Hold On: Berlutut, lindungi kepala dengan tas/tangan di bawah meja kokoh.",
      "Jauhi jendela kaca, cermin, dan benda gantung yang mudah jatuh.",
      "Bila di luar ruangan, jauhi tiang listrik, baliho, dan gedung bertingkat.",
    ],
    setelah: [
      "Keluar gedung menggunakan tangga darurat, jangan pernah gunakan lift.",
      "Waspadai gempa susulan (aftershocks).",
      "Periksa kebocoran gas sebelum menyalakan api atau sakelar lampu.",
    ],
  },
];
