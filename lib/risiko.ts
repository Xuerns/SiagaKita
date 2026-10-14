import { RiskLevel } from '@/types/database';

export interface FaktorBanjir {
  hujan24jMm: number;
  hujan3hariMm: number;
  muka_air?: number | null; // 0-100 persen kapasitas pos duga air, null jika pos tidak tersedia
  kerentanan: number;       // 0-100 skor kerentanan statis wilayah
}

export interface HasilPerhitunganRisiko {
  skor: number;
  level: RiskLevel;
  levelText: string;
  faktor: {
    h24Persen: number;
    h3Persen: number;
    kerentanan: number;
    muka_air?: number | null;
    rawHujan24jMm: number;
    rawHujan3hariMm: number;
  };
  rekomendasi: string;
  tindakanCepat: string[];
  warna: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  };
}

export function keLevel(skor: number): RiskLevel {
  if (skor <= 25) return 'aman';
  if (skor <= 50) return 'waspada';
  if (skor <= 75) return 'siaga';
  return 'awas';
}

export function getRekomendasi(level: RiskLevel): {
  rekomendasi: string;
  tindakanCepat: string[];
} {
  switch (level) {
    case 'aman':
      return {
        rekomendasi: 'Situasi lingkungan kondusif dan stabil. Tetap pantau informasi cuaca terkini.',
        tindakanCepat: [
          'Periksa kelengkapan tas siaga bencana',
          'Pastikan nomor kontak darurat keluarga tersimpan',
          'Unduh rute peta evakuasi untuk antisipasi offline',
        ],
      };
    case 'waspada':
      return {
        rekomendasi: 'Potensi kenaikan debit air terdeteksi akibat intensitas hujan. Warga diimbau waspada.',
        tindakanCepat: [
          'Pantau saluran drainase dan ketinggian air sekitar',
          'Pindahkan dokumen berharga ke tempat yang lebih tinggi',
          'Isi daya penuh ponsel dan lampu darurat',
        ],
      };
    case 'siaga':
      return {
        rekomendasi: 'Risiko banjir tinggi! Genangan air mulai meluas. Siapkan evakuasi mandiri.',
        tindakanCepat: [
          'Ambil Tas Siaga Bencana dan barang esensial',
          'Matikan sakelar listrik utama dan katup gas rumah',
          'Arahkan lansia, anak-anak, dan orang sakit ke titik kumpul terdekat',
          'Gunakan jalur evakuasi aman yang tidak tergenang',
        ],
      };
    case 'awas':
      return {
        rekomendasi: 'BAHAYA TINGGI! Segera lakukan evakuasi ke shelter / posko aman terdekat sekarang juga!',
        tindakanCepat: [
          'SEGERA MENUJU KE SHELTER / TITIK AMAN!',
          'JANGAN melintasi arus air deras atau jalan terendam',
          'Hubungi nomor darurat 112 / BPBD jika terjebak',
          'Tekan tombol status "Saya Aman" saat tiba di shelter',
        ],
      };
  }
}

export function getStyleLevel(level: RiskLevel) {
  switch (level) {
    case 'aman':
      return {
        bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        text: 'text-emerald-700',
        border: 'border-emerald-500',
        badgeBg: 'bg-[#E6F4EC]',
        badgeText: 'text-[#287F4F]',
      };
    case 'waspada':
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-200',
        text: 'text-amber-700',
        border: 'border-amber-500',
        badgeBg: 'bg-[#FEF3C7]',
        badgeText: 'text-[#D97706]',
      };
    case 'siaga':
      return {
        bg: 'bg-orange-50 text-orange-900 border-orange-200',
        text: 'text-orange-700',
        border: 'border-orange-500',
        badgeBg: 'bg-[#FFEDD5]',
        badgeText: 'text-[#C2410C]',
      };
    case 'awas':
      return {
        bg: 'bg-rose-50 text-rose-900 border-rose-200',
        text: 'text-rose-700',
        border: 'border-rose-500',
        badgeBg: 'bg-[#FEE2E2]',
        badgeText: 'text-[#DC2626]',
      };
  }
}

export function hitungSkorBanjir(faktor: FaktorBanjir): HasilPerhitunganRisiko {
  // Normalisasi curah hujan berdasarkan standar BMKG:
  // 150 mm/hari = hujan ekstrem
  // 300 mm/3 hari = akumulasi kritis
  const h24Persen = Math.min(faktor.hujan24jMm / 150, 1) * 100;
  const h3Persen = Math.min(faktor.hujan3hariMm / 300, 1) * 100;

  const komponen = [
    { nilai: h24Persen, bobot: 0.35 },
    { nilai: h3Persen, bobot: 0.25 },
    { nilai: faktor.kerentanan, bobot: 0.2 },
    ...(faktor.muka_air != null ? [{ nilai: faktor.muka_air, bobot: 0.2 }] : []),
  ];

  const totalBobot = komponen.reduce((sum, item) => sum + item.bobot, 0);
  const skorCalculated = komponen.reduce((sum, item) => sum + item.nilai * item.bobot, 0) / totalBobot;
  const skor = Math.round(skorCalculated);
  const level = keLevel(skor);
  const { rekomendasi, tindakanCepat } = getRekomendasi(level);

  return {
    skor,
    level,
    levelText: level.toUpperCase(),
    faktor: {
      h24Persen: Math.round(h24Persen),
      h3Persen: Math.round(h3Persen),
      kerentanan: faktor.kerentanan,
      muka_air: faktor.muka_air,
      rawHujan24jMm: faktor.hujan24jMm,
      rawHujan3hariMm: faktor.hujan3hariMm,
    },
    rekomendasi,
    tindakanCepat,
    warna: getStyleLevel(level),
  };
}
