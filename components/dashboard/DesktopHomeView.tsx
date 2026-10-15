"use client";

import React from "react";
import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { RiskStatusCard } from "@/components/dashboard/RiskStatusCard";
import { WarningCard } from "@/components/dashboard/WarningCard";
import { EarthquakeCard } from "@/components/dashboard/EarthquakeCard";
import { ShortcutCards } from "@/components/dashboard/ShortcutCards";
import { ForecastSection } from "@/components/dashboard/ForecastSection";
import { QuickActionPanel } from "@/components/dashboard/QuickActionPanel";
import { EducationBanner } from "@/components/dashboard/EducationBanner";
import { NavTab } from "@/components/layout/DesktopSidebar";
import { WeatherCurrent, ForecastDay, ActiveWarning, EarthquakeData, RiskLevel } from "@/types";

export interface DesktopHomeViewProps {
  userName?: string;
  isOnline: boolean;
  currentWeather: WeatherCurrent;
  isLoadingWeather: boolean;
  onRefreshWeather: () => void;
  onOpenLocationModal: () => void;
  currentLocation: string;
  currentRiskLevel: RiskLevel;
  dynamicWarning: ActiveWarning;
  onOpenWarning: () => void;
  latestEarthquake: EarthquakeData | null;
  isLoadingEarthquake: boolean;
  forecastDays: ForecastDay[];
  onNavigateTab: (tab: NavTab) => void;
  onOpenSayaAman: () => void;
}

export function DesktopHomeView({
  userName,
  isOnline,
  currentWeather,
  isLoadingWeather,
  onRefreshWeather,
  onOpenLocationModal,
  currentLocation,
  currentRiskLevel,
  dynamicWarning,
  onOpenWarning,
  latestEarthquake,
  isLoadingEarthquake,
  forecastDays,
  onNavigateTab,
  onOpenSayaAman,
}: DesktopHomeViewProps) {
  const firstName = userName ? userName.trim().split(" ")[0] : "Kawan";

  return (
    <div className="space-y-6">
      {/* Greeting & Subtitle matching visual reference */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17211D]">
            Halo, {firstName}
          </h1>
          <p className="text-xs md:text-sm text-[#68756E] mt-1">
            Pantau kondisi cuaca dan risiko bencana di wilayahmu agar selalu siap.
          </p>
        </div>

        {!isOnline && (
          <div className="bg-[#FEF1E6] text-[#C96B10] px-3 py-1 rounded-[10px] border border-[#FBD6B5] text-xs font-semibold flex items-center gap-1.5">
            <span>Mode Offline Aktif (Menampilkan Cache Terakhir)</span>
          </div>
        )}
      </div>

      {/* Top Summary Row (3 Cards: Cuaca, Status Risiko, Peringatan Aktif) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WeatherCard
          weather={currentWeather}
          isLoading={isLoadingWeather}
          onRefresh={onRefreshWeather}
          onOpenLocationModal={onOpenLocationModal}
        />
        <RiskStatusCard
          level={currentRiskLevel}
          location={currentLocation}
          onViewRiskDetails={() => onNavigateTab("peta")}
        />
        <WarningCard
          warning={dynamicWarning}
          onOpenWarning={onOpenWarning}
        />
      </div>

      {/* Gempa Bumi Terkini BMKG (full-width banner) */}
      <EarthquakeCard
        variant="wide"
        earthquake={latestEarthquake}
        isLoading={isLoadingEarthquake}
        onViewOnMap={() => onNavigateTab("peta")}
      />

      {/* 3 Shortcut Cards */}
      <ShortcutCards onNavigate={onNavigateTab} />

      {/* Lower Row: 5-Day Forecast, Tindakan Cepat, Education Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-5">
          <ForecastSection forecast={forecastDays} />
        </div>
        <div className="lg:col-span-4">
          <QuickActionPanel
            onNavigate={onNavigateTab}
            onOpenSayaAman={onOpenSayaAman}
          />
        </div>
        <div className="lg:col-span-3">
          <EducationBanner onNavigate={onNavigateTab} />
        </div>
      </div>
    </div>
  );
}
