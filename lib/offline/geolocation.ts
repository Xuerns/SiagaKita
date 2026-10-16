/**
 * Utilitas dan Tracker Geolocation Real-Time untuk Peta Offline & Navigasi SiagaKita
 */

export interface LiveLocationCoords {
  lat: number;
  lng: number;
  accuracy: number;
  heading?: number | null;
  speed?: number | null;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  timestamp: number;
}

export interface GeolocationTrackerOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  onLocationUpdate?: (coords: LiveLocationCoords) => void;
  onError?: (errorMessage: string, errorCode?: number) => void;
}

/**
 * Cek apakah browser & runtime mendukung Geolocation API
 */
export function isGeolocationSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    Boolean(navigator.geolocation)
  );
}

/**
 * Pemetaan pesan kesalahan ramah pengguna untuk GeolocationPositionError
 */
export function formatGeolocationError(err: { code: number; message?: string }): string {
  if (err.code === 1) {
    return "Izin akses lokasi ditolak oleh pengguna atau browser.";
  }
  if (err.code === 2) {
    return "Sinyal GPS / informasi lokasi saat ini tidak tersedia.";
  }
  if (err.code === 3) {
    return "Waktu penantian sinyal GPS habis (timeout).";
  }
  return err.message || "Gagal mengambil lokasi GPS perangkat.";
}

/**
 * Engine pelacak GPS real-time (Watch Position)
 */
export class LiveGeolocationTracker {
  private watchId: number | null = null;
  private options: GeolocationTrackerOptions;
  private isTrackingActive: boolean = false;

  constructor(options: GeolocationTrackerOptions = {}) {
    this.options = options;
  }

  public updateOptions(newOptions: Partial<GeolocationTrackerOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  public start(): boolean {
    if (!isGeolocationSupported()) {
      const msg = "Perangkat atau browser tidak mendukung fitur Geolocation.";
      this.options.onError?.(msg);
      return false;
    }

    this.stop();
    this.isTrackingActive = true;

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords: LiveLocationCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            heading: pos.coords.heading ?? null,
            speed: pos.coords.speed ?? null,
            altitude: pos.coords.altitude ?? null,
            altitudeAccuracy: pos.coords.altitudeAccuracy ?? null,
            timestamp: pos.timestamp || Date.now(),
          };
          this.options.onLocationUpdate?.(coords);
        },
        (err) => {
          const userMsg = formatGeolocationError(err);
          this.options.onError?.(userMsg, err.code);
        },
        {
          enableHighAccuracy: this.options.enableHighAccuracy ?? true,
          maximumAge: this.options.maximumAge ?? 1000,
          timeout: this.options.timeout ?? 15000,
        }
      );
      return true;
    } catch (err: any) {
      this.isTrackingActive = false;
      const userMsg = err?.message || "Terjadi kesalahan saat mengaktifkan sensor lokasi.";
      this.options.onError?.(userMsg);
      return false;
    }
  }

  public stop(): void {
    if (
      this.watchId !== null &&
      typeof navigator !== "undefined" &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTrackingActive = false;
  }

  public isTracking(): boolean {
    return this.isTrackingActive;
  }

  public getWatchId(): number | null {
    return this.watchId;
  }
}
