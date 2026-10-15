import { calculateHaversineDistance } from "@/lib/bmkg";
import fallbackAutogempa from "@/data/fallback/autogempa.json";
import fallbackGempadirasakan from "@/data/fallback/gempadirasakan.json";

export interface BMKGGempaRaw {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi?: string;
  Dirasakan?: string;
  Shakemap?: string;
}

export interface EarthquakeData {
  tanggal: string;
  jam: string;
  dateTime: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  lintang: string;
  bujur: string;
  magnitude: number;
  kedalaman: string;
  kedalamanKm: number;
  wilayah: string;
  potensi: string;
  dirasakan?: string;
  shakemapUrl: string | null;
  jarakKm?: number | null;
  level: "Aman" | "Waspada" | "Siaga" | "Awas";
  rekomendasi: {
    apa: string;
    di_mana: string;
    seberapa_parah: string;
    lakukan_ini: string[];
  };
}

export interface RecentEarthquakeItem {
  tanggal: string;
  jam: string;
  dateTime: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  lintang: string;
  bujur: string;
  magnitude: number;
  kedalaman: string;
  wilayah: string;
  potensi?: string;
  dirasakan?: string;
  jarakKm?: number | null;
}

/**
 * Parses coordinate string from BMKG (e.g., "-8.14,120.56")
 */
export function parseBMKGCoordinates(coords: string): { lat: number; lng: number } {
  if (!coords) return { lat: 0, lng: 0 };
  const parts = coords.split(",").map((p) => parseFloat(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] };
  }
  return { lat: 0, lng: 0 };
}

/**
 * Formats BMKG raw earthquake data into application EarthquakeData structure
 */
export function parseBMKGEarthquake(
  raw: BMKGGempaRaw,
  userLat?: number,
  userLng?: number
): EarthquakeData {
  const coords = parseBMKGCoordinates(raw.Coordinates);
  const mag = parseFloat(raw.Magnitude) || 0;
  const depthClean = (raw.Kedalaman || "").replace(/[^\d]/g, "");
  const depthKm = parseInt(depthClean, 10) || 10;

  let jarakKm: number | null = null;
  if (
    typeof userLat === "number" &&
    !isNaN(userLat) &&
    typeof userLng === "number" &&
    !isNaN(userLng)
  ) {
    jarakKm = Math.round(calculateHaversineDistance(userLat, userLng, coords.lat, coords.lng));
  }

  // Tsunami check
  const isTsunamiPotential =
    raw.Potensi &&
    raw.Potensi.toLowerCase().includes("berpotensi tsunami") &&
    !raw.Potensi.toLowerCase().includes("tidak berpotensi");

  // Determine hazard level relative to user or nationally
  let level: "Aman" | "Waspada" | "Siaga" | "Awas" = "Aman";
  if (isTsunamiPotential) {
    level = "Awas";
  } else if (jarakKm !== null) {
    if (jarakKm <= 100 && mag >= 5.5) {
      level = "Awas";
    } else if (jarakKm <= 150 && mag >= 5.0) {
      level = "Siaga";
    } else if (jarakKm <= 350 && mag >= 5.0) {
      level = "Waspada";
    } else if (mag >= 6.5) {
      level = "Waspada";
    }
  } else {
    // If no user location given, base on national severity
    if (mag >= 6.5) level = "Awas";
    else if (mag >= 5.5) level = "Siaga";
    else if (mag >= 4.5) level = "Waspada";
  }

  // 4 Pillars of Information as required by PRD FR-ALR-03
  const jarakText = jarakKm !== null ? ` (${jarakKm} km dari posisimu)` : "";
  const apa = `Gempa Bumi M ${mag.toFixed(1)}, Kedalaman ${raw.Kedalaman}`;
  const di_mana = `${raw.Wilayah}${jarakText}`;
  const seberapa_parah = isTsunamiPotential
    ? "PERINGATAN: Berpotensi Tsunami. Waspadai kenaikan air laut mendadak."
    : raw.Dirasakan
    ? `Dirasakan skala ${raw.Dirasakan}. ${raw.Potensi || "Tidak berpotensi tsunami."}`
    : raw.Potensi || "Tidak berpotensi tsunami.";

  const lakukan_ini = [
    "JANGAN PANIK. Lindungi kepala dan leher (Drop, Cover, and Hold On).",
    "Berlindung di bawah meja yang kokoh atau jauhi kaca, jendela, dan benda gantung.",
    "Bila berada di pesisir dan guncangan kuat dirasakan, segera evakuasi ke tempat tinggi tanpa menunggu sirene.",
    "Bila berada di luar ruangan, jauhi gedung bertingkat, tiang listrik, dan papan reklame.",
    "Periksa instalasi gas dan listrik sebelum menyalakannya kembali pasca gempa.",
  ];

  return {
    tanggal: raw.Tanggal,
    jam: raw.Jam,
    dateTime: raw.DateTime,
    coordinates: coords,
    lintang: raw.Lintang,
    bujur: raw.Bujur,
    magnitude: mag,
    kedalaman: raw.Kedalaman,
    kedalamanKm: depthKm,
    wilayah: raw.Wilayah,
    potensi: raw.Potensi || "Tidak berpotensi tsunami",
    dirasakan: raw.Dirasakan,
    shakemapUrl: raw.Shakemap
      ? `https://data.bmkg.go.id/DataMKG/TEWS/${raw.Shakemap}`
      : null,
    jarakKm,
    level,
    rekomendasi: {
      apa,
      di_mana,
      seberapa_parah,
      lakukan_ini,
    },
  };
}

/**
 * Fetch latest earthquake from BMKG TEWS Open Data
 */
export async function getBMKGLatestEarthquake(
  userLat?: number,
  userLng?: number
): Promise<{
  data: EarthquakeData;
  source: "BMKG" | "Fallback";
}> {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json", {
      headers: {
        Accept: "application/json",
        "User-Agent": "SiagaKita-EarthquakeClient/1.0",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`BMKG autogempa HTTP ${res.status}`);
    }

    const json = await res.json();
    const raw = json.Infogempa?.gempa;
    if (!raw) {
      throw new Error("Format respon BMKG autogempa tidak valid");
    }

    const data = parseBMKGEarthquake(raw, userLat, userLng);
    return { data, source: "BMKG" };
  } catch (err) {
    console.warn("Gagal mengambil autogempa BMKG, menggunakan rekaman data resmi terakhir:", err);
    const rawFallback = (fallbackAutogempa as any).Infogempa?.gempa;
    const data = parseBMKGEarthquake(rawFallback, userLat, userLng);
    return { data, source: "Fallback" };
  }
}

/**
 * Fetch recent felt earthquakes from BMKG TEWS Open Data
 */
export async function getBMKGRecentFeltEarthquakes(
  userLat?: number,
  userLng?: number,
  limit: number = 10
): Promise<RecentEarthquakeItem[]> {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json", {
      headers: {
        Accept: "application/json",
        "User-Agent": "SiagaKita-EarthquakeClient/1.0",
      },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      throw new Error(`BMKG gempadirasakan HTTP ${res.status}`);
    }

    const json = await res.json();
    const rawList: BMKGGempaRaw[] = json.Infogempa?.gempa || [];

    return rawList.slice(0, limit).map((item) => {
      const coords = parseBMKGCoordinates(item.Coordinates);
      let jarakKm: number | null = null;
      if (
        typeof userLat === "number" &&
        !isNaN(userLat) &&
        typeof userLng === "number" &&
        !isNaN(userLng)
      ) {
        jarakKm = Math.round(calculateHaversineDistance(userLat, userLng, coords.lat, coords.lng));
      }

      return {
        tanggal: item.Tanggal,
        jam: item.Jam,
        dateTime: item.DateTime,
        coordinates: coords,
        lintang: item.Lintang,
        bujur: item.Bujur,
        magnitude: parseFloat(item.Magnitude) || 0,
        kedalaman: item.Kedalaman,
        wilayah: item.Wilayah,
        potensi: item.Potensi,
        dirasakan: item.Dirasakan,
        jarakKm,
      };
    });
  } catch (err) {
    console.warn("Gagal mengambil gempadirasakan BMKG, beralih ke fallback:", err);
    const rawList: BMKGGempaRaw[] = (fallbackGempadirasakan as any).Infogempa?.gempa || [];
    return rawList.slice(0, limit).map((item) => {
      const coords = parseBMKGCoordinates(item.Coordinates);
      let jarakKm: number | null = null;
      if (
        typeof userLat === "number" &&
        !isNaN(userLat) &&
        typeof userLng === "number" &&
        !isNaN(userLng)
      ) {
        jarakKm = Math.round(calculateHaversineDistance(userLat, userLng, coords.lat, coords.lng));
      }

      return {
        tanggal: item.Tanggal,
        jam: item.Jam,
        dateTime: item.DateTime,
        coordinates: coords,
        lintang: item.Lintang,
        bujur: item.Bujur,
        magnitude: parseFloat(item.Magnitude) || 0,
        kedalaman: item.Kedalaman,
        wilayah: item.Wilayah,
        potensi: item.Potensi,
        dirasakan: item.Dirasakan,
        jarakKm,
      };
    });
  }
}
