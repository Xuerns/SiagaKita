import { EvacuationPoint } from "@/types";

export const CITY_EVACUATION_MAP: Record<string, EvacuationPoint[]> = {
  "Kota Bandung": [
    {
      id: "evac-bdg-1",
      name: "GOR Saparua Bandung",
      type: "GOR",
      address: "Jl. Saparua No. 2, Citarum, Kec. Bandung Wetan, Kota Bandung",
      distanceKm: 1.4,
      travelMinutes: 6,
      capacity: 1800,
      fasilitas: ["Tenda Pengungsian", "Dapur Umum", "Genset Darurat", "Toilet Portable"],
      lat: -6.9080,
      lng: 107.6180,
    },
    {
      id: "evac-bdg-2",
      name: "Lapangan Gasibu & Gedung Sate",
      type: "Posko",
      address: "Jl. Diponegoro No. 22, Citarum, Kota Bandung",
      distanceKm: 1.9,
      travelMinutes: 8,
      capacity: 3500,
      fasilitas: ["Posko BPBD Jabar", "Helipad Evakuasi", "Ambulans Siaga", "Logistik Makanan"],
      lat: -6.9004,
      lng: 107.6186,
    },
    {
      id: "evac-bdg-3",
      name: "Masjid Raya Bandung (Alun-Alun)",
      type: "Masjid",
      address: "Jl. Dalem Kaum No. 14, Balonggede, Kec. Regol, Kota Bandung",
      distanceKm: 2.5,
      travelMinutes: 11,
      capacity: 2500,
      fasilitas: ["Ruang Evakuasi Luas", "Akses Air Bersih", "Klinik Darurat"],
      lat: -6.9218,
      lng: 107.6067,
    },
    {
      id: "evac-bdg-4",
      name: "RSUP Dr. Hasan Sadikin (RSHS)",
      type: "Rumah Sakit",
      address: "Jl. Pasteur No. 38, Pasteur, Kec. Sukajadi, Kota Bandung",
      distanceKm: 3.2,
      travelMinutes: 13,
      capacity: 450,
      fasilitas: ["IGD 24 Jam", "Trauma Center", "Bank Darah", "Poli Bencana"],
      lat: -6.8924,
      lng: 107.5982,
    },
  ],

  "Kota Bogor": [
    {
      id: "evac-bgr-1",
      name: "SMPN 5 Bogor",
      type: "Sekolah",
      address: "Jl. Dadali No. 10A, Tanah Sareal, Kota Bogor",
      distanceKm: 1.2,
      travelMinutes: 5,
      capacity: 450,
      fasilitas: ["Ruang Kelas Aman", "Toilet", "Air Bersih", "Dapur Umum"],
      lat: -6.582,
      lng: 106.793,
    },
    {
      id: "evac-bgr-2",
      name: "GOR Pajajaran Bogor",
      type: "GOR",
      address: "Jl. Pemuda No. 4, Tanah Sareal, Kota Bogor",
      distanceKm: 1.8,
      travelMinutes: 7,
      capacity: 1200,
      fasilitas: ["Aula Indoor Luas", "Posko Medis", "Distribusi Logistik"],
      lat: -6.574,
      lng: 106.798,
    },
    {
      id: "evac-bgr-3",
      name: "Masjid Al-Ikhlas Batutulis",
      type: "Masjid",
      address: "Jl. Batutulis No. 12, Bogor Selatan, Kota Bogor",
      distanceKm: 2.4,
      travelMinutes: 10,
      capacity: 350,
      fasilitas: ["Tempat Ibadah & Rehat", "Air Bersih", "Akses Ambulans"],
      lat: -6.615,
      lng: 106.809,
    },
    {
      id: "evac-bgr-4",
      name: "RSUD Kota Bogor",
      type: "Rumah Sakit",
      address: "Jl. Dr. Sumeru No. 120, Bogor Barat, Kota Bogor",
      distanceKm: 3.1,
      travelMinutes: 12,
      capacity: 250,
      fasilitas: ["IGD 24 Jam", "Ruang Rawat Darurat", "Unit Krisis"],
      lat: -6.589,
      lng: 106.775,
    },
  ],

  "DKI Jakarta": [
    {
      id: "evac-jkt-1",
      name: "Kompleks Monumen Nasional (Monas)",
      type: "Posko",
      address: "Gambir, Kota Jakarta Pusat, DKI Jakarta",
      distanceKm: 1.1,
      travelMinutes: 5,
      capacity: 8000,
      fasilitas: ["Posko Komando BNPB", "Helipad", "Dapur Umum Lapangan", "Ambulans Standby"],
      lat: -6.1754,
      lng: 106.8272,
    },
    {
      id: "evac-jkt-2",
      name: "Masjid Istiqlal Jakarta",
      type: "Masjid",
      address: "Jl. Taman Wijaya Kusuma, Ps. Baru, Sawah Besar, Jakarta Pusat",
      distanceKm: 1.6,
      travelMinutes: 7,
      capacity: 5000,
      fasilitas: ["Kapasitas Masif", "Logistik Makanan", "Air Bersih", "Ruang Kesehatan"],
      lat: -6.1702,
      lng: 106.8314,
    },
    {
      id: "evac-jkt-3",
      name: "GOR Gelora Bung Karno (GBK)",
      type: "GOR",
      address: "Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat",
      distanceKm: 3.0,
      travelMinutes: 12,
      capacity: 10000,
      fasilitas: ["Shelter Bencana Utama", "Genset Darurat", "Area Terbuka Luas"],
      lat: -6.2183,
      lng: 106.8022,
    },
    {
      id: "evac-jkt-4",
      name: "RSUD Tarakan Jakarta Pusat",
      type: "Rumah Sakit",
      address: "Jl. Kyai Caringin No. 7, Cideng, Gambir, Jakarta Pusat",
      distanceKm: 2.2,
      travelMinutes: 9,
      capacity: 350,
      fasilitas: ["IGD Tingkat Rujukan", "Trauma Center", "Fasilitas Kritis"],
      lat: -6.1708,
      lng: 106.8115,
    },
  ],

  "Kota Depok": [
    {
      id: "evac-dpk-1",
      name: "Balai Kota Depok",
      type: "Posko",
      address: "Jl. Margonda Raya No. 54, Pancoran Mas, Kota Depok",
      distanceKm: 1.3,
      travelMinutes: 5,
      capacity: 1500,
      fasilitas: ["Posko BPBD Depok", "Dapur Umum", "Logistik"],
      lat: -6.3980,
      lng: 106.8180,
    },
    {
      id: "evac-dpk-2",
      name: "GOR Kota Depok (Grand Depok City)",
      type: "GOR",
      address: "Jl. Boulevard Grand Depok City, Kalimulya, Cilodong, Depok",
      distanceKm: 2.2,
      travelMinutes: 8,
      capacity: 2000,
      fasilitas: ["Gedung Serbaguna", "Akses Ambulans", "Toilet"],
      lat: -6.4250,
      lng: 106.8300,
    },
    {
      id: "evac-dpk-3",
      name: "Masjid Kubah Emas Dian Al-Mahri",
      type: "Masjid",
      address: "Jl. Raya Meruyung, Meruyung, Limo, Kota Depok",
      distanceKm: 3.5,
      travelMinutes: 12,
      capacity: 3000,
      fasilitas: ["Area Rehat Nyaman", "Air Bersih Melimpah"],
      lat: -6.3840,
      lng: 106.7720,
    },
    {
      id: "evac-dpk-4",
      name: "RS Universitas Indonesia (RSUI)",
      type: "Rumah Sakit",
      address: "Kompleks Kampus UI Depok, Pondok Cina, Beji, Depok",
      distanceKm: 2.8,
      travelMinutes: 10,
      capacity: 300,
      fasilitas: ["Peralatan Medis Lengkap", "IGD 24 Jam"],
      lat: -6.3688,
      lng: 106.8315,
    },
  ],

  "Kota Surabaya": [
    {
      id: "evac-sby-1",
      name: "Gelora Pancasila & DBL Arena",
      type: "GOR",
      address: "Jl. Indragiri No. 1, Wonokromo, Kota Surabaya",
      distanceKm: 1.5,
      travelMinutes: 6,
      capacity: 2500,
      fasilitas: ["Shelter Evakuasi", "Dapur Umum", "Air Bersih"],
      lat: -7.2915,
      lng: 112.7314,
    },
    {
      id: "evac-sby-2",
      name: "Masjid Nasional Al-Akbar Surabaya",
      type: "Masjid",
      address: "Jl. Masjid Al-Akbar Timur No. 1, Pagesangan, Jambangan, Surabaya",
      distanceKm: 3.0,
      travelMinutes: 11,
      capacity: 6000,
      fasilitas: ["Aula Luas", "Area Parkir Logistik", "Klinik Darurat"],
      lat: -7.3364,
      lng: 112.7153,
    },
    {
      id: "evac-sby-3",
      name: "RSUD Dr. Soetomo Surabaya",
      type: "Rumah Sakit",
      address: "Jl. Mayjen Prof. Dr. Moestopo No. 6-8, Gubeng, Surabaya",
      distanceKm: 2.1,
      travelMinutes: 8,
      capacity: 500,
      fasilitas: ["Pusat Rujukan Medis Jatim", "IGD Terpadu"],
      lat: -7.2680,
      lng: 112.7584,
    },
  ],
};

/**
 * Get coordinates for a given city/regency name
 */
export function getCityCoordinates(location: string): { lat: number; lng: number } {
  const locLower = location.toLowerCase();
  if (locLower.includes("bandung")) return { lat: -6.9175, lng: 107.6191 };
  if (locLower.includes("bogor")) return { lat: -6.6216, lng: 106.8087 };
  if (locLower.includes("jakarta")) return { lat: -6.1754, lng: 106.8272 };
  if (locLower.includes("depok")) return { lat: -6.3980, lng: 106.8180 };
  if (locLower.includes("surabaya")) return { lat: -7.2575, lng: 112.7521 };
  if (locLower.includes("semarang")) return { lat: -6.9667, lng: 110.4167 };
  if (locLower.includes("solo") || locLower.includes("surakarta")) return { lat: -7.5755, lng: 110.8243 };
  if (locLower.includes("yogyakarta") || locLower.includes("jogja")) return { lat: -7.7956, lng: 110.3695 };
  if (locLower.includes("malang")) return { lat: -7.9666, lng: 112.6326 };
  if (locLower.includes("medan")) return { lat: 3.5952, lng: 98.6722 };
  if (locLower.includes("makassar")) return { lat: -5.1477, lng: 119.4327 };
  if (locLower.includes("denpasar") || locLower.includes("bali")) return { lat: -8.6705, lng: 115.2126 };
  
  // Default to Kota Bandung
  return { lat: -6.9175, lng: 107.6191 };
}

/**
 * Returns customized evacuation points for the given city/regency,
 * with fallbacks dynamically tailored to the city name.
 */
export function getEvacuationPointsForLocation(location: string): EvacuationPoint[] {
  // Check exact or partial match in dictionary
  for (const [key, points] of Object.entries(CITY_EVACUATION_MAP)) {
    if (location.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(location.toLowerCase())) {
      return points;
    }
  }

  const coords = getCityCoordinates(location);

  // Dynamic fallback points tailored to the requested city with valid lat/lng
  return [
    {
      id: `evac-gen-1`,
      name: `GOR Olahraga Wilayah ${location}`,
      type: "GOR",
      address: `Pusat Kegiatan Olahraga & Pemuda, ${location}`,
      distanceKm: 1.5,
      travelMinutes: 6,
      capacity: 1500,
      fasilitas: ["Aula Evakuasi Tertutup", "Dapur Umum", "Genset Darurat"],
      lat: coords.lat + 0.008,
      lng: coords.lng + 0.006,
    },
    {
      id: `evac-gen-2`,
      name: `Masjid Agung / Pusat Ibadah ${location}`,
      type: "Masjid",
      address: `Kawasan Alun-Alun Utama, ${location}`,
      distanceKm: 2.1,
      travelMinutes: 9,
      capacity: 2000,
      fasilitas: ["Akses Air Bersih", "Ruang Rehat Luas", "Logistik Sembako"],
      lat: coords.lat - 0.007,
      lng: coords.lng + 0.009,
    },
    {
      id: `evac-gen-3`,
      name: `Posko Tanggap Darurat BPBD ${location}`,
      type: "Posko",
      address: `Kompleks Perkantoran Daerah, ${location}`,
      distanceKm: 2.8,
      travelMinutes: 11,
      capacity: 800,
      fasilitas: ["Pusat Komando Bencana", "Ambulans Standby", "Helipad"],
      lat: coords.lat + 0.012,
      lng: coords.lng - 0.010,
    },
    {
      id: `evac-gen-4`,
      name: `RSUD Daerah ${location}`,
      type: "Rumah Sakit",
      address: `Jl. Kesehatan Utama No. 1, ${location}`,
      distanceKm: 3.4,
      travelMinutes: 14,
      capacity: 250,
      fasilitas: ["IGD Bencana 24 Jam", "Trauma Center"],
      lat: coords.lat - 0.011,
      lng: coords.lng - 0.008,
    },
  ];
}
