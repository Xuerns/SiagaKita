"use client";

import React from "react";
import { Navigation, Compass, Footprints, ShieldAlert } from "lucide-react";
import { EvacuationPoint } from "@/types";

interface NavigationCompassCardProps {
  selectedPoint: EvacuationPoint | null;
  userCoords: { lat: number; lng: number } | null;
  distanceMeters: number | null;
  isFollowMode: boolean;
  onToggleFollowMode: () => void;
  isOffline: boolean;
}

/**
 * Menghitung sudut arah (bearing) dari posisi user ke titik evakuasi (0° - 360°)
 */
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

/**
 * Konversi sudut derajat ke nama mata angin dalam Bahasa Indonesia
 */
export function getCompassDirection(bearing: number): string {
  const directions = [
    "Utara",
    "Timur Laut",
    "Timur",
    "Tenggara",
    "Selatan",
    "Barat Daya",
    "Barat",
    "Barat Laut",
  ];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

export function NavigationCompassCard({
  selectedPoint,
  userCoords,
  distanceMeters,
  isFollowMode,
  onToggleFollowMode,
  isOffline,
}: NavigationCompassCardProps) {
  if (!selectedPoint || !userCoords || distanceMeters === null) {
    return null;
  }

  const bearing = calculateBearing(
    userCoords.lat,
    userCoords.lng,
    selectedPoint.lat,
    selectedPoint.lng
  );
  const directionName = getCompassDirection(bearing);

  // Estimasi jalan kaki darurat (asumsi kecepatan 4.5 km/jam = 75 meter/menit)
  const walkingMinutes = Math.max(1, Math.round(distanceMeters / 75));

  const distanceText =
    distanceMeters >= 1000
      ? `${(distanceMeters / 1000).toFixed(1)} km`
      : `${Math.round(distanceMeters)} meter`;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[16px] border border-[#CDD7D1] shadow-lg p-3.5 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#176B4D] text-white flex items-center justify-center shadow-sm">
            <Compass
              className="w-4 h-4 transition-transform duration-500"
              style={{ transform: `rotate(${Math.round(bearing)}deg)` }}
            />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#17211D] flex items-center gap-1.5">
              <span>Menuju: {selectedPoint.name}</span>
              {isOffline && (
                <span className="bg-[#FEF3C7] text-[#92400E] text-[9px] px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                  <ShieldAlert className="w-2.5 h-2.5" />
                  Mode Offline
                </span>
              )}
            </div>
            <div className="text-[10px] text-[#68756E]">
              Arah {directionName} ({Math.round(bearing)}°)
            </div>
          </div>
        </div>

        <button
          onClick={onToggleFollowMode}
          className={`px-2.5 py-1.5 rounded-[10px] text-[10px] font-bold flex items-center gap-1 transition-all ${
            isFollowMode
              ? "bg-[#176B4D] text-white shadow-sm"
              : "bg-[#F5F7F6] text-[#68756E] hover:bg-[#EAEFEA]"
          }`}
          title="Otomatis geser peta mengikuti pergerakan langkah kaki"
        >
          <Navigation className={`w-3 h-3 ${isFollowMode ? "animate-pulse" : ""}`} />
          <span>{isFollowMode ? "Kamera Mengikuti" : "Ikuti Langkah"}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F1F4F2]">
        <div className="bg-[#F8FAF9] p-2 rounded-[10px] flex items-center gap-2">
          <Footprints className="w-4 h-4 text-[#176B4D] shrink-0" />
          <div>
            <span className="text-[9px] text-[#929D96] block font-medium">Jarak Langsung</span>
            <span className="text-xs font-bold text-[#17211D]">{distanceText}</span>
          </div>
        </div>

        <div className="bg-[#F8FAF9] p-2 rounded-[10px] flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center text-[10px] font-black shrink-0">
            ⏱
          </div>
          <div>
            <span className="text-[9px] text-[#929D96] block font-medium">Estimasi Jalan Kaki</span>
            <span className="text-xs font-bold text-[#17211D]">±{walkingMinutes} Menit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
