"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { InteractiveRiskMap } from "@/components/map/InteractiveRiskMap";
import { MapDetailsPanel } from "@/components/map/MapDetailsPanel";
import { EvacuationPoint, CommunityReport, WeatherCurrent, EarthquakeData, RiskLevel } from "@/types";

export interface DesktopMapViewProps {
  currentLocation: string;
  currentRisk: {
    level: RiskLevel;
    h24: number;
    mukaAirText: string;
  };
  currentWeather: WeatherCurrent;
  currentEvacuationPoints: EvacuationPoint[];
  communityReports: CommunityReport[];
  selectedPoint: EvacuationPoint | null;
  focusTimestamp: number;
  showRoute: boolean;
  mapLayerTab: "evakuasi" | "rute" | "laporan";
  onSelectMapLayerTab: (tab: "evakuasi" | "rute" | "laporan") => void;
  onSelectPoint: (pt: EvacuationPoint) => void;
  onStartRouteNavigation: () => void;
  userCoords: { lat: number; lng: number; accuracy?: number } | null;
  latestEarthquake: EarthquakeData | null;
  onUpdateCoords: (coords: { lat: number; lng: number; accuracy?: number } | null) => void;
  onSelectCity: (loc: string) => void;
  onRefreshReports: () => void;
  isRefreshingReports: boolean;
}

export function DesktopMapView({
  currentLocation,
  currentRisk,
  currentWeather,
  currentEvacuationPoints,
  communityReports,
  selectedPoint,
  focusTimestamp,
  showRoute,
  mapLayerTab,
  onSelectMapLayerTab,
  onSelectPoint,
  onStartRouteNavigation,
  userCoords,
  latestEarthquake,
  onUpdateCoords,
  onSelectCity,
  onRefreshReports,
  isRefreshingReports,
}: DesktopMapViewProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#17211D]">
            Peta Risiko & Evakuasi
          </h1>
          <p className="text-xs text-[#68756E] mt-0.5">
            Pantau area berisiko dan temukan titik evakuasi di wilayahmu.
          </p>
        </div>
      </div>

      {/* Interactive Map Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#E6EBE8] pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "evakuasi", label: "Peta & Titik Evakuasi" },
            { id: "rute", label: "Rute Evakuasi" },
            { id: "laporan", label: "Laporan Warga" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectMapLayerTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                mapLayerTab === tab.id
                  ? "bg-[#176B4D] text-white shadow-sm"
                  : "bg-white text-[#68756E] border border-[#E6EBE8] hover:bg-[#F8FAF9]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mapLayerTab === "laporan" && (
          <button
            onClick={onRefreshReports}
            disabled={isRefreshingReports}
            className="px-3 py-1.5 rounded-[10px] text-xs font-bold bg-white hover:bg-[#F8FAF9] active:bg-[#EFF3F0] text-[#176B4D] border border-[#CDD7D1] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-60 shrink-0"
            title="Segarkan pin laporan warga di peta"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingReports ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">
              {isRefreshingReports ? "Memuat..." : "Segarkan Laporan"}
            </span>
          </button>
        )}
      </div>

      {/* Map Grid Layout (75% Map + 25% Detail Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8">
          <InteractiveRiskMap
            evacuationPoints={currentEvacuationPoints}
            communityReports={communityReports}
            selectedPointId={selectedPoint?.id || currentEvacuationPoints[0]?.id}
            focusTimestamp={focusTimestamp}
            onSelectPoint={onSelectPoint}
            showRoute={showRoute}
            activeLayer={mapLayerTab}
            locationName={currentLocation}
            riskLevel={currentRisk.level}
            userCoords={userCoords}
            earthquakeCoords={
              latestEarthquake
                ? {
                    lat: latestEarthquake.coordinates.lat,
                    lng: latestEarthquake.coordinates.lng,
                    magnitude: latestEarthquake.magnitude,
                    wilayah: latestEarthquake.wilayah,
                  }
                : null
            }
            onUpdateCoords={onUpdateCoords}
            onSelectCity={onSelectCity}
          />
        </div>
        <div className="lg:col-span-4 h-full">
          <MapDetailsPanel
            selectedArea={currentLocation}
            riskLevel={currentRisk.level}
            hujan24jMm={currentRisk.h24}
            mukaAirStatus={currentRisk.mukaAirText}
            weatherCondition={currentWeather.condition}
            temp={currentWeather.temp}
            humidity={currentWeather.humidity}
            windSpeed={currentWeather.windSpeed}
            evacuationPoints={currentEvacuationPoints}
            selectedPointId={selectedPoint?.id || currentEvacuationPoints[0]?.id}
            onSelectPoint={onSelectPoint}
            onStartRouteNavigation={onStartRouteNavigation}
            isGpsActive={Boolean(userCoords)}
          />
        </div>
      </div>
    </div>
  );
}
