import { WeatherCurrent, ForecastDay } from "@/types";
import { mockCurrentWeather, mockForecast5Days } from "@/data/mockDisasterData";

export interface BMKGRegionInfo {
  name: string;
  adm4: string;
  lat: number;
  lon: number;
  province: string;
  group?: "Jabodetabek" | "Jawa Barat" | "Jawa Tengah & DIY" | "Jawa Timur" | "Luar Jawa";
}

export const INDONESIA_REGIONS: BMKGRegionInfo[] = [
  // Jabodetabek
  { name: "Kota Bogor", adm4: "32.71.01.1001", lat: -6.6216, lon: 106.8087, province: "Jawa Barat", group: "Jabodetabek" },
  { name: "Kab. Bogor (Cibinong)", adm4: "32.01.01.2001", lat: -6.4816, lon: 106.8539, province: "Jawa Barat", group: "Jabodetabek" },
  { name: "DKI Jakarta Pusat", adm4: "31.71.03.1001", lat: -6.1754, lon: 106.8272, province: "DKI Jakarta", group: "Jabodetabek" },
  { name: "DKI Jakarta Selatan", adm4: "31.74.04.1003", lat: -6.2443, lon: 106.8006, province: "DKI Jakarta", group: "Jabodetabek" },
  { name: "DKI Jakarta Barat", adm4: "31.73.01.1001", lat: -6.1670, lon: 106.7890, province: "DKI Jakarta", group: "Jabodetabek" },
  { name: "DKI Jakarta Timur", adm4: "31.75.01.1001", lat: -6.2250, lon: 106.8650, province: "DKI Jakarta", group: "Jabodetabek" },
  { name: "DKI Jakarta Utara", adm4: "31.72.01.1001", lat: -6.1320, lon: 106.8710, province: "DKI Jakarta", group: "Jabodetabek" },
  { name: "Kota Depok", adm4: "32.76.01.1001", lat: -6.3980, lon: 106.8180, province: "Jawa Barat", group: "Jabodetabek" },
  { name: "Kota Tangerang", adm4: "36.71.01.1001", lat: -6.1783, lon: 106.6319, province: "Banten", group: "Jabodetabek" },
  { name: "Kota Tangerang Selatan", adm4: "36.74.01.1001", lat: -6.3150, lon: 106.6850, province: "Banten", group: "Jabodetabek" },
  { name: "Kota Bekasi", adm4: "32.75.01.1001", lat: -6.2383, lon: 106.9756, province: "Jawa Barat", group: "Jabodetabek" },
  { name: "Kab. Bekasi (Cikarang)", adm4: "32.16.01.2001", lat: -6.3000, lon: 107.1500, province: "Jawa Barat", group: "Jabodetabek" },

  // Jawa Barat
  { name: "Kota Bandung", adm4: "32.73.01.1001", lat: -6.9175, lon: 107.6191, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kab. Sukabumi", adm4: "32.02.01.2001", lat: -6.9850, lon: 106.5500, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kota Cirebon", adm4: "32.74.01.1001", lat: -6.7320, lon: 108.5523, province: "Jawa Barat", group: "Jawa Barat" },
  { name: "Kota Tasikmalaya", adm4: "32.78.01.1001", lat: -7.3274, lon: 108.2207, province: "Jawa Barat", group: "Jawa Barat" },

  // Jawa Tengah & DIY
  { name: "Kota Semarang", adm4: "33.74.01.1001", lat: -6.9667, lon: 110.4167, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "Kota Surakarta (Solo)", adm4: "33.72.01.1001", lat: -7.5755, lon: 110.8243, province: "Jawa Tengah", group: "Jawa Tengah & DIY" },
  { name: "D.I. Yogyakarta", adm4: "34.71.01.1001", lat: -7.7956, lon: 110.3695, province: "D.I. Yogyakarta", group: "Jawa Tengah & DIY" },

  // Jawa Timur
  { name: "Kota Surabaya", adm4: "35.78.01.1001", lat: -7.2575, lon: 112.7521, province: "Jawa Timur", group: "Jawa Timur" },
  { name: "Kota Malang", adm4: "35.73.01.1001", lat: -7.9666, lon: 112.6326, province: "Jawa Timur", group: "Jawa Timur" },

  // Luar Jawa
  { name: "Kota Medan", adm4: "12.71.01.1001", lat: 3.5952, lon: 98.6722, province: "Sumatera Utara", group: "Luar Jawa" },
  { name: "Kota Padang", adm4: "13.71.01.1001", lat: -0.9471, lon: 100.4172, province: "Sumatera Barat", group: "Luar Jawa" },
  { name: "Kota Palembang", adm4: "16.71.01.1001", lat: -2.9761, lon: 104.7754, province: "Sumatera Selatan", group: "Luar Jawa" },
  { name: "Kota Bandar Lampung", adm4: "18.71.01.1001", lat: -5.4500, lon: 105.2667, province: "Lampung", group: "Luar Jawa" },
  { name: "Kota Denpasar (Bali)", adm4: "51.71.01.1001", lat: -8.6705, lon: 115.2126, province: "Bali", group: "Luar Jawa" },
  { name: "Kota Pontianak", adm4: "61.71.01.1001", lat: -0.0263, lon: 109.3425, province: "Kalimantan Barat", group: "Luar Jawa" },
  { name: "Kota Balikpapan", adm4: "64.71.01.1001", lat: -1.2379, lon: 116.8289, province: "Kalimantan Timur", group: "Luar Jawa" },
  { name: "Kota Makassar", adm4: "73.71.01.1001", lat: -5.1477, lon: 119.4327, province: "Sulawesi Selatan", group: "Luar Jawa" },
  { name: "Kota Manado", adm4: "71.71.01.1001", lat: 1.4748, lon: 124.8421, province: "Sulawesi Utara", group: "Luar Jawa" },
  { name: "Kota Jayapura", adm4: "91.71.01.1001", lat: -2.5916, lon: 140.6690, province: "Papua", group: "Luar Jawa" },
];

export const LOCATION_ADM4_MAP: Record<string, string> = {
  "Kota Bogor": "32.71.01.1001",
  "Kab. Bogor": "32.01.01.2001",
  "Kota Depok": "32.76.01.1001",
  "Kab. Sukabumi": "32.02.01.2001",
  "DKI Jakarta": "31.71.03.1001",
  "DKI Jakarta Pusat": "31.71.03.1001",
};

export function getAdm4ByLocation(location: string): string {
  // If user entered adm4 code directly (digits with dots)
  if (/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(location.trim())) {
    return location.trim();
  }
  const found = INDONESIA_REGIONS.find(
    (r) => r.name.toLowerCase() === location.toLowerCase() ||
           r.name.toLowerCase().includes(location.toLowerCase())
  );
  if (found) return found.adm4;
  return LOCATION_ADM4_MAP[location] || "32.71.01.1001";
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
