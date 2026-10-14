export type HazardType =
  | 'banjir'
  | 'longsor'
  | 'gempa'
  | 'tsunami'
  | 'gunung_api'
  | 'karhutla'
  | 'cuaca_ekstrem';

export type RiskLevel = 'aman' | 'waspada' | 'siaga' | 'awas';

export type UserRole = 'warga' | 'relawan' | 'admin';

export type ReportStatus =
  | 'belum_terverifikasi'
  | 'terverifikasi'
  | 'ditolak'
  | 'disembunyikan';

export interface Region {
  id: string;
  nama: string;
  tingkat: string;
  kerentanan_banjir: number;
  kerentanan_longsor: number;
  centroid?: {
    lat: number;
    lng: number;
  };
}

export interface Profile {
  id: string;
  nama: string | null;
  role: UserRole;
  home_location?: {
    lat: number;
    lng: number;
  } | null;
  region_id?: string | null;
  radius_km: number;
  emergency_contacts: Array<{
    nama: string;
    nomor: string;
    hubungan: string;
  }>;
  vulnerability?: {
    lansia?: boolean;
    disabilitas?: boolean;
    ibu_hamil?: boolean;
    balita?: boolean;
    hewan_ternak?: boolean;
    catatan?: string;
  } | null;
  vulnerability_consent: boolean;
  created_at: string;
}

export interface RiskAssessment {
  id?: number;
  region_id: string;
  hazard: HazardType;
  skor: number;
  level: RiskLevel;
  faktor: {
    h24: number;
    h3: number;
    kerentanan: number;
    muka_air?: number | null;
    [key: string]: unknown;
  };
  data_lengkap: boolean;
  computed_at: string;
  rekomendasi?: string;
}

export interface Alert {
  id: string;
  sumber: 'bmkg' | 'prediksi' | 'manual';
  hazard: HazardType;
  level: RiskLevel;
  region_id?: string | null;
  apa: string;
  di_mana: string;
  seberapa_parah: string;
  lakukan_ini: string;
  issued_at: string;
  expires_at?: string | null;
  raw?: Record<string, unknown>;
}

export interface EvacuationPoint {
  id: string;
  nama: string;
  tipe: 'titik_kumpul' | 'shelter' | 'rumah_sakit' | 'posko';
  alamat?: string | null;
  kapasitas?: number | null;
  fasilitas?: string[];
  region_id?: string | null;
  aktif: boolean;
  lat: number;
  lng: number;
  jarak_m?: number;
  durasi_menit?: number;
}

export interface EvacuationRoute {
  id: string;
  region_id: string;
  point_id: string;
  jarak_m: number;
  durasi_menit: number;
  coordinates: [number, number][]; // [lng, lat]
}

export interface CommunityReport {
  id: string;
  user_id: string;
  user_name?: string;
  tipe: string;
  deskripsi?: string | null;
  foto_urls?: string[];
  lat: number;
  lng: number;
  status: ReportStatus;
  konfirmasi_count: number;
  created_at: string;
  expires_at: string;
  jarak_km?: number;
}

export interface SafetyStatus {
  user_id: string;
  status: 'aman' | 'butuh_bantuan';
  lat?: number | null;
  lng?: number | null;
  catatan?: string | null;
  updated_at: string;
}
