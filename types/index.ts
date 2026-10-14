import { 
  HazardType, 
  RiskLevel as DBRiskLevel, 
  UserRole, 
  ReportStatus, 
  Region, 
  Profile, 
  RiskAssessment, 
  Alert as DBAlert, 
  EvacuationRoute, 
  SafetyStatus 
} from './database';

export type {
  HazardType,
  DBRiskLevel,
  UserRole,
  ReportStatus,
  Region,
  Profile,
  RiskAssessment,
  DBAlert,
  EvacuationRoute,
  SafetyStatus
};

export type RiskLevel = 'Aman' | 'Waspada' | 'Siaga' | 'Awas' | 'aman' | 'waspada' | 'siaga' | 'awas';
export type SourceType = 'BMKG' | 'InaRISK' | 'Open-Meteo' | 'PVMBG' | 'Simulasi' | 'Laporan Warga';
export type VerificationStatus = 'Terverifikasi' | 'Dalam Verifikasi' | 'Belum Terverifikasi' | 'Ditolak' | 'terverifikasi' | 'belum_terverifikasi' | 'disembunyikan';

export interface WeatherCurrent {
  temp: number;
  condition: string;
  location: string;
  forecastRange: string;
  source: SourceType;
  lastUpdated: string;
  humidity?: number;
  windSpeed?: number;
  precipitationMm?: number;
  todaySummary: {
    condition: string;
    range: string;
    timeWindow: string;
  };
}

export interface ForecastDay {
  id: string;
  dayName: string;
  dateStr: string;
  condition: string;
  tempMin: number;
  tempMax: number;
  rainChance: number;
}

export interface ActiveWarning {
  id: string;
  title: string;
  hazardType: string;
  level: 'Aman' | 'Waspada' | 'Siaga' | 'Awas';
  affectedArea: string;
  validPeriod: string;
  issuedTime: string;
  source: SourceType;
  description: string;
  whatHappened: string;
  whereLocation: string;
  howSevere: string;
  instructions: string[];
  isDemoSimulation: boolean;
}

export interface EvacuationPoint {
  id: string;
  name: string;
  nama?: string;
  type?: 'Sekolah' | 'GOR' | 'Masjid' | 'Rumah Sakit' | 'Posko';
  tipe?: 'titik_kumpul' | 'shelter' | 'rumah_sakit' | 'posko';
  address?: string;
  alamat?: string | null;
  distanceKm?: number;
  travelMinutes?: number;
  capacity?: number;
  kapasitas?: number | null;
  fasilitas?: string[];
  region_id?: string | null;
  aktif?: boolean;
  verified?: boolean;
  contact?: string;
  lat: number;
  lng: number;
  jarak_m?: number;
  durasi_menit?: number;
}

export interface CommunityReport {
  id: string;
  user_id?: string;
  user_name?: string;
  userName?: string;
  category?: 'Banjir' | 'Sungai Naik' | 'Longsor' | 'Jalan Terputus' | 'Butuh Bantuan';
  tipe?: string;
  title?: string;
  description?: string;
  deskripsi?: string | null;
  foto_urls?: string[];
  imageUrl?: string;
  locationName?: string;
  timeAgo?: string;
  status?: any;
  confirmationsCount?: number;
  konfirmasi_count?: number;
  created_at?: string;
  expires_at?: string;
  jarak_km?: number;
  lat?: number;
  lng?: number;
  userConfirmed?: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  sublabel?: string;
  completed: boolean;
  category: 'essential' | 'document' | 'health' | 'tools';
}
