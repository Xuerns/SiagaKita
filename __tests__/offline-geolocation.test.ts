import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isGeolocationSupported,
  formatGeolocationError,
  LiveGeolocationTracker,
  LiveLocationCoords,
} from "@/lib/offline/geolocation";

describe("Live Geolocation Engine & Tracker", () => {
  const originalNavigator = globalThis.navigator;
  const originalWindow = globalThis.window;

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      configurable: true,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  describe("formatGeolocationError", () => {
    it("Good Route: Format error code 1 (PERMISSION_DENIED)", () => {
      const msg = formatGeolocationError({ code: 1 });
      expect(msg).toContain("Izin akses lokasi ditolak");
    });

    it("Good Route: Format error code 2 (POSITION_UNAVAILABLE)", () => {
      const msg = formatGeolocationError({ code: 2 });
      expect(msg).toContain("Sinyal GPS / informasi lokasi saat ini tidak tersedia");
    });

    it("Good Route: Format error code 3 (TIMEOUT)", () => {
      const msg = formatGeolocationError({ code: 3 });
      expect(msg).toContain("Waktu penantian sinyal GPS habis");
    });

    it("Bad Route / Fallback: Format error code tidak dikenal", () => {
      const msg = formatGeolocationError({ code: 99, message: "Custom error" });
      expect(msg).toBe("Custom error");
    });
  });

  describe("SSR & Lingkungan Tanpa Geolocation", () => {
    it("Bad Route: isGeolocationSupported mengembalikan false saat navigator.geolocation tidak ada", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {},
        configurable: true,
        writable: true,
      });

      expect(isGeolocationSupported()).toBe(false);
    });

    it("Bad Route: LiveGeolocationTracker.start() gagal aman dan memanggil onError jika tidak disupport", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {},
        configurable: true,
        writable: true,
      });

      const onError = vi.fn();
      const tracker = new LiveGeolocationTracker({ onError });

      const result = tracker.start();
      expect(result).toBe(false);
      expect(tracker.isTracking()).toBe(false);
      expect(onError).toHaveBeenCalledWith(
        "Perangkat atau browser tidak mendukung fitur Geolocation."
      );
    });
  });

  describe("Browser Environment dengan Geolocation Mock", () => {
    let mockWatchPosition: any;
    let mockClearWatch: any;
    let successCallback: ((pos: any) => void) | null = null;
    let errorCallback: ((err: any) => void) | null = null;

    beforeEach(() => {
      successCallback = null;
      errorCallback = null;

      mockWatchPosition = vi.fn((success, error) => {
        successCallback = success;
        errorCallback = error;
        return 999;
      });

      mockClearWatch = vi.fn();

      Object.defineProperty(globalThis, "window", {
        value: {},
        configurable: true,
        writable: true,
      });

      Object.defineProperty(globalThis, "navigator", {
        value: {
          geolocation: {
            watchPosition: mockWatchPosition,
            clearWatch: mockClearWatch,
          },
        },
        configurable: true,
        writable: true,
      });
    });

    it("Good Route: tracker.start() berhasil mendaftarkan watchPosition dengan parameter akurasi tinggi", () => {
      const onLocationUpdate = vi.fn();
      const tracker = new LiveGeolocationTracker({
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
        onLocationUpdate,
      });

      expect(isGeolocationSupported()).toBe(true);
      const started = tracker.start();

      expect(started).toBe(true);
      expect(tracker.isTracking()).toBe(true);
      expect(mockWatchPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        }
      );

      // Simulasikan pergerakan langkah pengguna (posisi pertama)
      const fakePos1 = {
        coords: {
          latitude: -6.5971,
          longitude: 106.806,
          accuracy: 4.8,
          heading: 180,
          speed: 1.4,
          altitude: 250,
          altitudeAccuracy: 3,
        },
        timestamp: 1700000000000,
      };

      successCallback?.(fakePos1);

      expect(onLocationUpdate).toHaveBeenCalledWith<[LiveLocationCoords]>({
        lat: -6.5971,
        lng: 106.806,
        accuracy: 5,
        heading: 180,
        speed: 1.4,
        altitude: 250,
        altitudeAccuracy: 3,
        timestamp: 1700000000000,
      });

      // Simulasikan langkah berikutnya (posisi bergeser)
      const fakePos2 = {
        coords: {
          latitude: -6.5975,
          longitude: 106.8062,
          accuracy: 4.2,
          heading: 185,
          speed: 1.5,
          altitude: 251,
          altitudeAccuracy: 3,
        },
        timestamp: 1700000001000,
      };

      successCallback?.(fakePos2);

      expect(onLocationUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          lat: -6.5975,
          lng: 106.8062,
          speed: 1.5,
        })
      );
    });

    it("Bad Route: tracker menangani callback error dari watchPosition (misal PERMISSION_DENIED)", () => {
      const onError = vi.fn();
      const tracker = new LiveGeolocationTracker({ onError });

      tracker.start();

      // Simulasikan error kode 1 (PERMISSION_DENIED)
      errorCallback?.({ code: 1, message: "User denied" });

      expect(onError).toHaveBeenCalledWith(
        "Izin akses lokasi ditolak oleh pengguna atau browser.",
        1
      );
    });

    it("Good Route: tracker.stop() membersihkan watchId via clearWatch", () => {
      const tracker = new LiveGeolocationTracker();
      tracker.start();

      expect(tracker.getWatchId()).toBe(999);
      expect(tracker.isTracking()).toBe(true);

      tracker.stop();

      expect(mockClearWatch).toHaveBeenCalledWith(999);
      expect(tracker.getWatchId()).toBeNull();
      expect(tracker.isTracking()).toBe(false);
    });
  });
});
