import { WeatherCurrent, ForecastDay } from "@/types";
import { mockCurrentWeather, mockForecast5Days } from "@/data/mockDisasterData";

export interface BMKGRegionInfo {
  name: string;
  adm4: string;
  lat: number;
  lon: number;
  province: string;
  group?: 
    | "Jabodetabek & Banten" 
    | "Jawa Barat" 
    | "Jawa Tengah & DIY" 
    | "Jawa Timur" 
    | "Sumatera" 
    | "Kalimantan" 
    | "Sulawesi" 
    | "Bali & Nusa Tenggara" 
    | "Maluku & Papua";
}

export const INDONESIA_REGIONS: BMKGRegionInfo[] = [
  // Jabodetabek & Banten
  { name: "Kota Jakarta Pusat", adm4: "31.71.03.1001", lat: -6.1754, lon: 106.8272, province: "DKI Jakarta", group: "Jabodetabek & Banten" },
  { name: "DKI Jakarta Selatan", adm4: "31.74.04.1003", lat: -6.2443, lon: 106.8006, province: "DKI Jakarta", group: "Jabodetabek & Banten" },
  { name: "DKI Jakarta Barat", adm4: "31.73.01.1001", lat: -6.1670, lon: 106.7890, province: "DKI Jakarta", group: "Jabodetabek & Banten" },
  { name: "DKI Jakarta Timur", adm4: "31.75.01.1001", lat: -6.2250, lon: 106.8650, province: "DKI Jakarta", group: "Jabodetabek & Banten" },
  { name: "DKI Jakarta Utara", adm4: "31.72.01.1001", lat: -6.1320, lon: 106.8710, province: "DKI Jakarta", group: "Jabodetabek & Banten" },
  { name: "Kab. Kepulauan Seribu", adm4: "31.01.01.1001", lat: -5.6122, lon: 106.5622, province: "DKI Jakarta", group: "Jabodetabek & Banten" },
  { name: "Kota Bogor", adm4: "32.71.01.1001", lat: -6.6216, lon: 106.8087, province: "Jawa Barat", group: "Jabodetabek & Banten" },
  { name: "Kab. Bogor (Cibinong)", adm4: "32.01.01.2001", lat: -6.4816, lon: 106.8539, province: "Jawa Barat", group: "Jabodetabek & Banten" },
  { name: "Kota Depok", adm4: "32.76.01.1001", lat: -6.3980, lon: 106.8180, province: "Jawa Barat", group: "Jabodetabek & Banten" },
  { name: "Kota Tangerang", adm4: "36.71.01.1001", lat: -6.1783, lon: 106.6319, province: "Banten", group: "Jabodetabek & Banten" },
  { name: "Kota Tangerang Selatan", adm4: "36.74.01.1001", lat: -6.3150, lon: 106.6850, province: "Banten", group: "Jabodetabek & Banten" },
  { name: "Kab. Tangerang (Tigaraksa)", adm4: "36.03.01.1001", lat: -6.2625, lon: 106.4678, province: "Banten", group: "Jabodetabek & Banten" },
  { name: "Kota Bekasi", adm4: "32.75.01.1001", lat: -6.2383, lon: 106.9756, province: "Jawa Barat", group: "Jabodetabek & Banten" },
  { name: "Kab. Bekasi (Cikarang)", adm4: "32.16.01.2001", lat: -6.3000, lon: 107.1500, province: "Jawa Barat", group: "Jabodetabek & Banten" },
  { name: "Kota Serang", adm4: "36.73.01.1001", lat: -6.1104, lon: 106.1640, province: "Banten", group: "Jabodetabek & Banten" },
  { name: "Kota Cilegon", adm4: "36.72.01.1001", lat: -6.0025, lon: 106.0538, province: "Banten", group: "Jabodetabek & Banten" },
  { name: "Kab. Lebak (Rangkasbitung)", adm4: "36.02.01.1001", lat: -6.3562, lon: 106.2494, province: "Banten", group: "Jabodetabek & Banten" },
  { name: "Kab. Pandeglang", adm4: "36.01.01.1001", lat: -6.3084, lon: 106.1065, province: "Banten", group: "Jabodetabek & Banten" },

  // Jawa Barat
  { name: "Kota Bandung", adm4: "32.73.01.1001", lat: -6.9175, lon: 107.6191, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Bandung (Soreang)", adm4: "32.04.01.2001", lat: -7.0261, lon: 107.5186, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Bandung Barat (Ngamprah)", adm4: "32.17.01.2001", lat: -6.8486, lon: 107.5028, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kota Cimahi", adm4: "32.77.01.1001", lat: -6.8723, lon: 107.5422, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kota Sukabumi", adm4: "32.72.01.1001", lat: -6.9277, lon: 106.9298, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Sukabumi (Palabuhanratu)", adm4: "32.02.01.2001", lat: -6.9850, lon: 106.5500, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Cianjur", adm4: "32.03.01.1001", lat: -6.8227, lon: 107.1394, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Karawang", adm4: "32.15.01.1001", lat: -6.3042, lon: 107.3056, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Purwakarta", adm4: "32.14.01.1001", lat: -6.5569, lon: 107.4433, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Subang", adm4: "32.13.01.1001", lat: -6.5716, lon: 107.7587, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kota Cirebon", adm4: "32.74.01.1001", lat: -6.7320, lon: 108.5523, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Cirebon (Sumber)", adm4: "32.09.01.1001", lat: -6.7644, lon: 108.4842, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Indramayu", adm4: "32.12.01.1001", lat: -6.3264, lon: 108.3200, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Majalengka", adm4: "32.10.01.1001", lat: -6.8361, lon: 108.2278, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Kuningan", adm4: "32.08.01.1001", lat: -6.9767, lon: 108.4839, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kota Tasikmalaya", adm4: "32.78.01.1001", lat: -7.3274, lon: 108.2207, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Tasikmalaya (Singaparna)", adm4: "32.06.01.1001", lat: -7.3524, lon: 108.1118, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Garut", adm4: "32.05.01.1001", lat: -7.2274, lon: 107.9087, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Ciamis", adm4: "32.07.01.1001", lat: -7.3256, lon: 108.3533, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kota Banjar", adm4: "32.79.01.1001", lat: -7.3686, lon: 108.5339, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Pangandaran", adm4: "32.18.01.1001", lat: -7.7011, lon: 108.4947, province: "Jawa Barat", group: "Jawa Barat" },

  // Jawa Tengah & DIY
  { name: "Kota Semarang", adm4: "33.74.01.1001", lat: -6.9667, lon: 110.4167, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Semarang (Ungaran)", adm4: "33.22.01.1001", lat: -7.1394, lon: 110.4047, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kota Surakarta (Solo)", adm4: "33.72.01.1001", lat: -7.5755, lon: 110.8243, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Sukoharjo", adm4: "33.11.01.1001", lat: -7.6828, lon: 110.8286, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Klaten", adm4: "33.10.01.1001", lat: -7.7056, lon: 110.6056, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Boyolali", adm4: "33.09.01.1001", lat: -7.5317, lon: 110.5958, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Karanganyar", adm4: "33.13.01.1001", lat: -7.5975, lon: 110.9519, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Sragen", adm4: "33.14.01.1001", lat: -7.4267, lon: 111.0222, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Wonogiri", adm4: "33.12.01.1001", lat: -7.8139, lon: 110.9261, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kota Magelang", adm4: "33.71.01.1001", lat: -7.4706, lon: 110.2178, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Magelang (Mungkid)", adm4: "33.08.01.1001", lat: -7.5819, lon: 110.2528, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kota Salatiga", adm4: "33.73.01.1001", lat: -7.3306, lon: 110.5083, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kota Pekalongan", adm4: "33.75.01.1001", lat: -6.8886, lon: 109.6753, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kota Tegal", adm4: "33.76.01.1001", lat: -6.8694, lon: 109.1403, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Banyumas (Purwokerto)", adm4: "33.02.01.1001", lat: -7.4244, lon: 109.2300, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Cilacap", adm4: "33.01.01.1001", lat: -7.7278, lon: 109.0078, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Brebes", adm4: "33.29.01.1001", lat: -6.8711, lon: 109.0417, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Kudus", adm4: "33.19.01.1001", lat: -6.8047, lon: 110.8406, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Jepara", adm4: "33.20.01.1001", lat: -6.5939, lon: 110.6719, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kab. Pati", adm4: "33.18.01.1001", lat: -6.7556, lon: 111.0378, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kota Yogyakarta", adm4: "34.71.01.1001", lat: -7.7956, lon: 110.3695, province: "D.I. Yogyakarta", group: "Jawa Tengah & DIY" },
  { name: "Kab. Sleman", adm4: "34.04.01.1001", lat: -7.6881, lon: 110.3392, province: "D.I. Yogyakarta", group: "Jawa Tengah & DIY" },
  { name: "Kab. Bantul", adm4: "34.02.01.1001", lat: -7.8894, lon: 110.3283, province: "D.I. Yogyakarta", group: "Jawa Tengah & DIY" },
  { name: "Kab. Gunungkidul (Wonosari)", adm4: "34.03.01.1001", lat: -7.9656, lon: 110.6033, province: "D.I. Yogyakarta", group: "Jawa Tengah & DIY" },
  { name: "Kab. Kulon Progo (Wates)", adm4: "34.01.01.1001", lat: -7.8572, lon: 110.1606, province: "D.I. Yogyakarta", group: "Jawa Tengah & DIY" },

  // Jawa Timur
  { name: "Kota Surabaya", adm4: "35.78.01.1001", lat: -7.2575, lon: 112.7521, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kab. Sidoarjo", adm4: "35.15.01.1001", lat: -7.4478, lon: 112.7183, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kab. Gresik", adm4: "35.25.01.1001", lat: -7.1594, lon: 112.6517, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kota Malang", adm4: "35.73.01.1001", lat: -7.9666, lon: 112.6326, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kab. Malang (Kepanjen)", adm4: "35.07.01.1001", lat: -8.1311, lon: 112.5717, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kota Batu", adm4: "35.79.01.1001", lat: -7.8672, lon: 112.5269, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kota Kediri", adm4: "35.71.01.1001", lat: -7.8167, lon: 112.0167, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kota Blitar", adm4: "35.72.01.1001", lat: -8.0983, lon: 112.1681, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kota Madiun", adm4: "35.77.01.1001", lat: -7.6297, lon: 111.5239, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kota Probolinggo", adm4: "35.74.01.1001", lat: -7.7544, lon: 113.2158, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kota Pasuruan", adm4: "35.75.01.1001", lat: -7.6469, lon: 112.9078, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kab. Banyuwangi", adm4: "35.10.01.1001", lat: -8.2192, lon: 114.3692, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kab. Jember", adm4: "35.09.01.1001", lat: -8.1725, lon: 113.7008, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kab. Bojonegoro", adm4: "35.22.01.1001", lat: -7.1500, lon: 111.8817, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kab. Lamongan", adm4: "35.24.01.1001", lat: -7.1206, lon: 112.4158, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kab. Tuban", adm4: "35.23.01.1001", lat: -6.8978, lon: 112.0647, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kota Mojokerto", adm4: "35.76.01.1001", lat: -7.4722, lon: 112.4339, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kab. Mojokerto", adm4: "35.16.01.1001", lat: -7.5456, lon: 112.4639, province: "Jawa Timur", group: "Jawa Timur" },

  // Sumatera
  { name: "Kota Banda Aceh", adm4: "11.71.01.1001", lat: 5.5483, lon: 95.3238, province: "Aceh", group: "Sumatera" },
  { name: "Kota Sabang", adm4: "11.72.01.1001", lat: 5.8933, lon: 95.3167, province: "Aceh", group: "Sumatera" },
  { name: "Kota Lhokseumawe", adm4: "11.73.01.1001", lat: 5.1808, lon: 97.1408, province: "Aceh", group: "Sumatera" },
  { name: "Kota Medan", adm4: "12.71.01.1001", lat: 3.5952, lon: 98.6722, province: "Sumatera Utara", group: "Sumatera" },
  { name: "Kota Binjai", adm4: "12.75.01.1001", lat: 3.6006, lon: 98.4856, province: "Sumatera Utara", group: "Sumatera" },
  { name: "Kota Pematangsiantar", adm4: "12.72.01.1001", lat: 2.9594, lon: 99.0686, province: "Sumatera Utara", group: "Sumatera" },
  { name: "Kab. Deli Serdang", adm4: "12.07.01.1001", lat: 3.5500, lon: 98.8667, province: "Sumatera Utara", group: "Sumatera" },
  { name: "Kota Padang", adm4: "13.71.01.1001", lat: -0.9471, lon: 100.4172, province: "Sumatera Barat", group: "Sumatera" },
  { name: "Kota Bukittinggi", adm4: "13.75.01.1001", lat: -0.3056, lon: 100.3692, province: "Sumatera Barat", group: "Sumatera" },
  { name: "Kota Payakumbuh", adm4: "13.76.01.1001", lat: -0.2289, lon: 100.6308, province: "Sumatera Barat", group: "Sumatera" },
  { name: "Kota Pekanbaru", adm4: "14.71.01.1001", lat: 0.5071, lon: 101.4478, province: "Riau", group: "Sumatera" },
  { name: "Kota Dumai", adm4: "14.72.01.1001", lat: 1.6667, lon: 101.4500, province: "Riau", group: "Sumatera" },
  { name: "Kota Batam", adm4: "21.71.01.1001", lat: 1.1301, lon: 104.0529, province: "Kepulauan Riau", group: "Sumatera" },
  { name: "Kota Tanjungpinang", adm4: "21.72.01.1001", lat: 0.9167, lon: 104.4500, province: "Kepulauan Riau", group: "Sumatera" },
  { name: "Kota Jambi", adm4: "15.71.01.1001", lat: -1.6100, lon: 103.6100, province: "Jambi", group: "Sumatera" },
  { name: "Kota Palembang", adm4: "16.71.01.1001", lat: -2.9761, lon: 104.7754, province: "Sumatera Selatan", group: "Sumatera" },
  { name: "Kota Lubuklinggau", adm4: "16.73.01.1001", lat: -3.2958, lon: 102.8617, province: "Sumatera Selatan", group: "Sumatera" },
  { name: "Kota Bengkulu", adm4: "17.71.01.1001", lat: -3.8004, lon: 102.2655, province: "Bengkulu", group: "Sumatera" },
  { name: "Kota Bandar Lampung", adm4: "18.71.01.1001", lat: -5.4500, lon: 105.2667, province: "Lampung", group: "Sumatera" },
  { name: "Kota Metro", adm4: "18.72.01.1001", lat: -5.1136, lon: 105.3067, province: "Lampung", group: "Sumatera" },
  { name: "Kota Pangkalpinang", adm4: "19.71.01.1001", lat: -2.1333, lon: 106.1167, province: "Kep. Bangka Belitung", group: "Sumatera" },

  // Kalimantan
  { name: "Kota Pontianak", adm4: "61.71.01.1001", lat: -0.0263, lon: 109.3425, province: "Kalimantan Barat", group: "Kalimantan" },
  { name: "Kota Singkawang", adm4: "61.72.01.1001", lat: 0.9086, lon: 108.9867, province: "Kalimantan Barat", group: "Kalimantan" },
  { name: "Kota Palangka Raya", adm4: "62.71.01.1001", lat: -2.2078, lon: 113.9164, province: "Kalimantan Tengah", group: "Kalimantan" },
  { name: "Kota Banjarmasin", adm4: "63.71.01.1001", lat: -3.3194, lon: 114.5908, province: "Kalimantan Selatan", group: "Kalimantan" },
  { name: "Kota Banjarbaru", adm4: "63.72.01.1001", lat: -3.4403, lon: 114.8306, province: "Kalimantan Selatan", group: "Kalimantan" },
  { name: "Kota Samarinda", adm4: "64.72.01.1001", lat: -0.5022, lon: 117.1536, province: "Kalimantan Timur", group: "Kalimantan" },
  { name: "Kota Balikpapan", adm4: "64.71.01.1001", lat: -1.2379, lon: 116.8289, province: "Kalimantan Timur", group: "Kalimantan" },
  { name: "Kota Bontang", adm4: "64.74.01.1001", lat: 0.1333, lon: 117.5000, province: "Kalimantan Timur", group: "Kalimantan" },
  { name: "Kab. Penajam Paser Utara (IKN)", adm4: "64.09.01.1001", lat: -0.9639, lon: 116.7722, province: "Kalimantan Timur", group: "Kalimantan" },
  { name: "Kota Tarakan", adm4: "65.71.01.1001", lat: 3.3000, lon: 117.6333, province: "Kalimantan Utara", group: "Kalimantan" },

  // Sulawesi
  { name: "Kota Manado", adm4: "71.71.01.1001", lat: 1.4748, lon: 124.8421, province: "Sulawesi Utara", group: "Sulawesi" },
  { name: "Kota Bitung", adm4: "71.72.01.1001", lat: 1.4456, lon: 125.1889, province: "Sulawesi Utara", group: "Sulawesi" },
  { name: "Kota Tomohon", adm4: "71.73.01.1001", lat: 1.3283, lon: 124.8392, province: "Sulawesi Utara", group: "Sulawesi" },
  { name: "Kota Gorontalo", adm4: "75.71.01.1001", lat: 0.5412, lon: 123.0595, province: "Gorontalo", group: "Sulawesi" },
  { name: "Kota Palu", adm4: "72.71.01.1001", lat: -0.8917, lon: 119.8707, province: "Sulawesi Tengah", group: "Sulawesi" },
  { name: "Kota Mamuju", adm4: "76.02.01.1001", lat: -2.6778, lon: 118.8878, province: "Sulawesi Barat", group: "Sulawesi" },
  { name: "Kota Makassar", adm4: "73.71.01.1001", lat: -5.1477, lon: 119.4327, province: "Sulawesi Selatan", group: "Sulawesi" },
  { name: "Kota Parepare", adm4: "73.72.01.1001", lat: -4.0131, lon: 119.6253, province: "Sulawesi Selatan", group: "Sulawesi" },
  { name: "Kota Palopo", adm4: "73.73.01.1001", lat: -2.9944, lon: 120.1969, province: "Sulawesi Selatan", group: "Sulawesi" },
  { name: "Kab. Gowa (Sungguminasa)", adm4: "73.06.01.1001", lat: -5.2047, lon: 119.4508, province: "Sulawesi Selatan", group: "Sulawesi" },
  { name: "Kota Kendari", adm4: "74.71.01.1001", lat: -3.9985, lon: 122.5126, province: "Sulawesi Tenggara", group: "Sulawesi" },
  { name: "Kota Baubau", adm4: "74.72.01.1001", lat: -5.4633, lon: 122.6019, province: "Sulawesi Tenggara", group: "Sulawesi" },

  // Bali & Nusa Tenggara
  { name: "Kota Denpasar (Bali)", adm4: "51.71.01.1001", lat: -8.6705, lon: 115.2126, province: "Bali", group: "Bali & Nusa Tenggara" },
  { name: "Kab. Badung (Mangupura)", adm4: "51.03.01.1001", lat: -8.5833, lon: 115.1833, province: "Bali", group: "Bali & Nusa Tenggara" },
  { name: "Kab. Gianyar", adm4: "51.04.01.1001", lat: -8.5433, lon: 115.3267, province: "Bali", group: "Bali & Nusa Tenggara" },
  { name: "Kab. Buleleng (Singaraja)", adm4: "51.08.01.1001", lat: -8.1122, lon: 115.0881, province: "Bali", group: "Bali & Nusa Tenggara" },
  { name: "Kota Mataram", adm4: "52.71.01.1001", lat: -8.5833, lon: 116.1167, province: "Nusa Tenggara Barat", group: "Bali & Nusa Tenggara" },
  { name: "Kab. Lombok Barat (Gerung)", adm4: "52.01.01.1001", lat: -8.6833, lon: 116.1333, province: "Nusa Tenggara Barat", group: "Bali & Nusa Tenggara" },
  { name: "Kota Bima", adm4: "52.72.01.1001", lat: -8.4600, lon: 118.7267, province: "Nusa Tenggara Barat", group: "Bali & Nusa Tenggara" },
  { name: "Kota Kupang", adm4: "53.71.01.1001", lat: -10.1772, lon: 123.6070, province: "Nusa Tenggara Timur", group: "Bali & Nusa Tenggara" },
  { name: "Kab. Manggarai Barat (Labuan Bajo)", adm4: "53.15.01.1001", lat: -8.4964, lon: 119.8872, province: "Nusa Tenggara Timur", group: "Bali & Nusa Tenggara" },

  // Maluku & Papua
  { name: "Kota Ambon", adm4: "81.71.01.1001", lat: -3.6958, lon: 128.1831, province: "Maluku", group: "Maluku & Papua" },
  { name: "Kota Tual", adm4: "81.72.01.1001", lat: -5.6292, lon: 132.7508, province: "Maluku", group: "Maluku & Papua" },
  { name: "Kota Ternate", adm4: "82.71.01.1001", lat: 0.7906, lon: 127.3833, province: "Maluku Utara", group: "Maluku & Papua" },
  { name: "Kota Tidore Kepulauan", adm4: "82.72.01.1001", lat: 0.6833, lon: 127.4000, province: "Maluku Utara", group: "Maluku & Papua" },
  { name: "Kota Jayapura", adm4: "91.71.01.1001", lat: -2.5916, lon: 140.6690, province: "Papua", group: "Maluku & Papua" },
  { name: "Kab. Jayapura (Sentani)", adm4: "91.03.01.1001", lat: -2.5667, lon: 140.5167, province: "Papua", group: "Maluku & Papua" },
  { name: "Kota Sorong", adm4: "96.71.01.1001", lat: -0.8762, lon: 131.2558, province: "Papua Barat Daya", group: "Maluku & Papua" },
  { name: "Kab. Manokwari", adm4: "92.02.01.1001", lat: -0.8615, lon: 134.0620, province: "Papua Barat", group: "Maluku & Papua" },
  { name: "Kab. Merauke", adm4: "93.01.01.1001", lat: -8.4932, lon: 140.4018, province: "Papua Selatan", group: "Maluku & Papua" },
  { name: "Kab. Mimika (Timika)", adm4: "94.04.01.1001", lat: -4.5469, lon: 136.8839, province: "Papua Tengah", group: "Maluku & Papua" },
];

export const LOCATION_ADM4_MAP: Record<string, string> = {
  "Kota Bogor": "32.71.01.1001",
  "Kab. Bogor": "32.01.01.2001",
  "Kota Depok": "32.76.01.1001",
  "Kab. Sukabumi": "32.02.01.2001",
  "DKI Jakarta": "31.71.03.1001",
  "DKI Jakarta Pusat": "31.71.03.1001",
  "Kota Bandung": "32.73.01.1001",
  "Kota Surabaya": "35.78.01.1001",
  "Kota Semarang": "33.74.01.1001",
  "Kota Medan": "12.71.01.1001",
  "Kota Makassar": "73.71.01.1001",
};

export function getAdm4ByLocation(location: string): string {
  // If user entered adm4 code directly (digits with dots)
  if (/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(location.trim())) {
    return location.trim();
  }
  const locLower = location.toLowerCase().trim();

  // 1. Exact match
  const exact = INDONESIA_REGIONS.find((r) => r.name.toLowerCase() === locLower);
  if (exact) return exact.adm4;

  // 2. Normalized match (without "Kota" / "Kab.")
  const cleanLoc = locLower.replace(/^(kota|kab\.|kabupaten)\s+/i, "").trim();
  const byClean = INDONESIA_REGIONS.find((r) => {
    const cleanR = r.name.toLowerCase().replace(/^(kota|kab\.|kabupaten)\s+/i, "").trim();
    return cleanR === cleanLoc;
  });
  if (byClean) return byClean.adm4;

  // 3. Word boundary regex
  const byWord = INDONESIA_REGIONS.find((r) => {
    const cleanR = r.name.toLowerCase().replace(/^(kota|kab\.|kabupaten)\s+/i, "").trim();
    return new RegExp(`^${cleanR}$|\\b${cleanR}\\b`, "i").test(cleanLoc);
  });
  if (byWord) return byWord.adm4;

  return LOCATION_ADM4_MAP[location] || "32.73.01.1001";
}

/**
 * Calculate distance between two lat/lon coordinates in kilometers (Haversine formula)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the closest BMKG region station given user's GPS coordinates
 */
export function findClosestBMKGRegion(
  lat: number,
  lon: number
): { region: BMKGRegionInfo; distanceKm: number } {
  let closest = INDONESIA_REGIONS[0];
  let minDistance = Infinity;

  for (const r of INDONESIA_REGIONS) {
    const dist = calculateHaversineDistance(lat, lon, r.lat, r.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = r;
    }
  }

  return { region: closest, distanceKm: Math.round(minDistance * 10) / 10 };
}

export interface BMKGLocation {
  adm1?: string;
  adm2?: string;
  adm3?: string;
  adm4?: string;
  provinsi?: string;
  kotkab?: string;
  kecamatan?: string;
  desa?: string;
  lon?: number;
  lat?: number;
  timezone?: string;
}

export interface BMKGCuacaItem {
  datetime?: string;
  utc_datetime?: string;
  local_datetime?: string;
  t?: number; // Suhu (°C)
  tcc?: number; // Tutupan awan (%)
  tp?: number; // Presipitasi / hujan (mm)
  weather?: number; // Kode cuaca
  weather_desc?: string; // Deskripsi cuaca (contoh: "Cerah", "Hujan Ringan")
  weather_desc_en?: string;
  wd?: string; // Arah angin
  ws?: number; // Kecepatan angin (km/h atau m/s)
  hu?: number; // Kelembaban (%)
  image?: string; // URL icon cuaca BMKG
}

export interface BMKGResponse {
  lokasi?: BMKGLocation;
  data?: Array<{
    lokasi?: BMKGLocation;
    cuaca?: BMKGCuacaItem[][] | BMKGCuacaItem[];
  }>;
}

// Format date to Indonesian text: "14 Okt 2026 · 20.00 WIB"
function formatIndonesianTimestamp(date: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
  ];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${d} ${m} ${y} · ${h}.${min} WIB`;
}

// Convert day index to Indonesian short day name
function getIndonesianDayName(date: Date, isToday: boolean): string {
  if (isToday) return "Hari ini";
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  return days[date.getDay()];
}

/**
 * Parses BMKG API response data into application WeatherCurrent and ForecastDay structures
 */
export function parseBMKGWeatherData(bmkgData: BMKGResponse): {
  weather: WeatherCurrent;
  forecast: ForecastDay[];
} {
  const lokasi = bmkgData.data?.[0]?.lokasi || bmkgData.lokasi;
  const rawCuaca = bmkgData.data?.[0]?.cuaca;

  if (!rawCuaca || !Array.isArray(rawCuaca) || rawCuaca.length === 0) {
    throw new Error("Format data cuaca BMKG tidak valid atau kosong.");
  }

  // Flatten if nested array of days
  const isNested = Array.isArray(rawCuaca[0]);
  const flatItems: BMKGCuacaItem[] = isNested 
    ? (rawCuaca as BMKGCuacaItem[][]).flat()
    : (rawCuaca as BMKGCuacaItem[]);

  if (flatItems.length === 0) {
    throw new Error("Tidak ada item perkiraan cuaca dalam data BMKG.");
  }

  // Find the forecast item closest to current time
  const nowMs = Date.now();
  let closestItem = flatItems[0];
  let minDiff = Infinity;

  for (const item of flatItems) {
    const itemDateStr = item.datetime || item.local_datetime?.replace(" ", "T");
    if (!itemDateStr) continue;
    const itemTime = new Date(itemDateStr).getTime();
    const diff = Math.abs(itemTime - nowMs);
    if (diff < minDiff) {
      minDiff = diff;
      closestItem = item;
    }
  }

  // Determine Location Name
  const locParts = [
    lokasi?.kecamatan ? `Kec. ${lokasi.kecamatan}` : "",
    lokasi?.kotkab || ""
  ].filter(Boolean);
  const locationName = locParts.length > 0 ? locParts.join(", ") : (lokasi?.kotkab || "Indonesia");

  // Calculate today's temperature min and max
  const todayTemps = flatItems
    .slice(0, 8)
    .map((item) => item.t)
    .filter((t): t is number => typeof t === "number" && !isNaN(t));

  const minTemp = todayTemps.length > 0 ? Math.min(...todayTemps) : (closestItem.t ?? 24) - 2;
  const maxTemp = todayTemps.length > 0 ? Math.max(...todayTemps) : (closestItem.t ?? 28) + 3;

  const currentCondition = closestItem.weather_desc || "Cerah Berawan";
  const currentTemp = closestItem.t ?? 27;

  // Format time window for today's forecast
  const timeWindow = "06:00 – 18:00";

  const weather: WeatherCurrent = {
    temp: currentTemp,
    condition: currentCondition,
    location: locationName,
    forecastRange: `${minTemp}° – ${maxTemp}°`,
    source: "BMKG",
    lastUpdated: formatIndonesianTimestamp(new Date()),
    humidity: closestItem.hu ?? 65,
    windSpeed: closestItem.ws ?? 4.5,
    precipitationMm: closestItem.tp ?? 0,
    todaySummary: {
      condition: currentCondition,
      range: `${minTemp}° – ${maxTemp}°`,
      timeWindow: timeWindow,
    },
  };

  // Build 3 to 5 day forecast
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
  ];
  
  const forecast: ForecastDay[] = [];

  if (isNested) {
    const dayArrays = rawCuaca as BMKGCuacaItem[][];
    dayArrays.forEach((dayItems, idx) => {
      if (!dayItems || dayItems.length === 0) return;
      const first = dayItems[0];
      const representative = dayItems.find(x => (x.weather_desc && x.weather_desc.includes("Hujan"))) || dayItems[Math.floor(dayItems.length / 2)] || first;
      
      const itemDate = new Date(first.datetime || first.local_datetime?.replace(" ", "T") || Date.now());
      const temps = dayItems.map(x => x.t).filter((t): t is number => typeof t === "number");
      const dMin = temps.length > 0 ? Math.min(...temps) : 22;
      const dMax = temps.length > 0 ? Math.max(...temps) : 30;

      // Approximate rain chance based on weather description
      const cond = representative.weather_desc || "Berawan";
      let rainChance = 20;
      if (cond.includes("Lebat") || cond.includes("Petir")) rainChance = 90;
      else if (cond.includes("Sedang")) rainChance = 75;
      else if (cond.includes("Ringan") || cond.includes("Hujan")) rainChance = 60;
      else if (cond.includes("Berawan")) rainChance = 35;

      forecast.push({
        id: `bmkg-day-${idx + 1}`,
        dayName: getIndonesianDayName(itemDate, idx === 0),
        dateStr: `${itemDate.getDate()} ${months[itemDate.getMonth()]}`,
        condition: cond,
        tempMin: dMin,
        tempMax: dMax,
        rainChance,
      });
    });
  }

  // If forecast has fewer than 5 days, backfill from mockForecast5Days to ensure a full 5-day UI strip
  if (forecast.length < 5) {
    mockForecast5Days.forEach((mockDay, i) => {
      if (!forecast[i]) {
        forecast.push(mockDay);
      }
    });
  }

  return { weather, forecast };
}

/**
 * Fetch BMKG weather forecast for a given adm4 (kode wilayah tingkat IV)
 * Example default: 32.71.01.1001 (Bogor Selatan, Kota Bogor) or 31.71.03.1001 (Jakarta Pusat)
 */
export async function getBMKGWeather(adm4: string = "32.71.01.1001"): Promise<{
  weather: WeatherCurrent;
  forecast: ForecastDay[];
  source: "BMKG" | "Fallback";
}> {
  try {
    const url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(adm4)}`;
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "SiagaKita-WeatherClient/1.0",
      },
      // Next.js caching: revalidate every 5 minutes (300 seconds)
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`BMKG API responded with status ${response.status}`);
    }

    const data: BMKGResponse = await response.json();
    const parsed = parseBMKGWeatherData(data);
    return {
      weather: parsed.weather,
      forecast: parsed.forecast,
      source: "BMKG",
    };
  } catch (err) {
    console.warn("Gagal mengambil data dari BMKG API, beralih ke data fallback:", err);
    return {
      weather: {
        ...mockCurrentWeather,
        source: "BMKG",
        lastUpdated: formatIndonesianTimestamp(new Date()),
      },
      forecast: mockForecast5Days,
      source: "Fallback",
    };
  }
}
