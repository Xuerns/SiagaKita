"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  LiveLocationCoords,
  LiveGeolocationTracker,
  isGeolocationSupported,
} from "@/lib/offline/geolocation";

export type LiveGeolocationCoords = LiveLocationCoords;

export interface UseLiveGeolocationOptions {
  /** Memaksa penggunaan modul GPS hardware dengan akurasi tinggi (default: true) */
  enableHighAccuracy?: boolean;
  /** Batas usia cache posisi sebelum membaca GPS baru dalam milidetik (default: 1000) */
  maximumAge?: number;
  /** Waktu batas maksimal penantian sinyal GPS dalam milidetik (default: 15000) */
  timeout?: number;
  /** Mulai melacak otomatis saat komponen di-mount (default: false) */
  autoStart?: boolean;
  /** Callback saat ada pembaruan posisi koordinat baru */
  onLocationUpdate?: (coords: LiveGeolocationCoords) => void;
  /** Callback saat terjadi kegagalan sinyal GPS / penolakan izin */
  onError?: (errorMessage: string, errorCode?: number) => void;
}

export interface UseLiveGeolocationReturn {
  coords: LiveGeolocationCoords | null;
  isTracking: boolean;
  error: string | null;
  errorCode: number | null;
  isSupported: boolean;
  startTracking: () => void;
  stopTracking: () => void;
}

/**
 * Hook pelacakan posisi real-time menggunakan LiveGeolocationTracker
 * Dirancang aman untuk SSR, otomatis membersihkan watcher saat unmount,
 * dan mendukung tracking langkah kaki saat offline.
 */
export function useLiveGeolocation(
  options: UseLiveGeolocationOptions = {}
): UseLiveGeolocationReturn {
  const {
    enableHighAccuracy = true,
    maximumAge = 1000,
    timeout = 15000,
    autoStart = false,
    onLocationUpdate,
    onError,
  } = options;

  const [coords, setCoords] = useState<LiveGeolocationCoords | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const trackerRef = useRef<LiveGeolocationTracker | null>(null);
  const onLocationUpdateRef = useRef(onLocationUpdate);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onLocationUpdateRef.current = onLocationUpdate;
    onErrorRef.current = onError;
  }, [onLocationUpdate, onError]);

  const isSupported = isGeolocationSupported();

  const stopTracking = useCallback(() => {
    if (trackerRef.current) {
      trackerRef.current.stop();
    }
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(() => {
    if (!isGeolocationSupported()) {
      const msg = "Perangkat atau browser tidak mendukung fitur Geolocation.";
      setError(msg);
      onErrorRef.current?.(msg);
      return;
    }

    setError(null);
    setErrorCode(null);

    if (!trackerRef.current) {
      trackerRef.current = new LiveGeolocationTracker({
        enableHighAccuracy,
        maximumAge,
        timeout,
        onLocationUpdate: (newCoords) => {
          setCoords(newCoords);
          setError(null);
          setErrorCode(null);
          onLocationUpdateRef.current?.(newCoords);
        },
        onError: (userMsg, code) => {
          setError(userMsg);
          setErrorCode(code ?? null);
          onErrorRef.current?.(userMsg, code);
        },
      });
    } else {
      trackerRef.current.updateOptions({
        enableHighAccuracy,
        maximumAge,
        timeout,
      });
    }

    const started = trackerRef.current.start();
    setIsTracking(started);
  }, [enableHighAccuracy, maximumAge, timeout]);

  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    return () => {
      if (trackerRef.current) {
        trackerRef.current.stop();
      }
    };
  }, [autoStart, startTracking]);

  return {
    coords,
    isTracking,
    error,
    errorCode,
    isSupported,
    startTracking,
    stopTracking,
  };
}
