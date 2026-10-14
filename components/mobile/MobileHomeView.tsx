import React from "react";
import { 
  ShieldCheck, 
  CloudRain, 
  AlertTriangle, 
  ArrowRight, 
  Compass, 
  CheckSquare, 
  UserCheck, 
  DownloadCloud,
  ChevronRight
} from "lucide-react";
import { WeatherCurrent, ActiveWarning, ForecastDay } from "@/types";
import { MobileTab } from "../layout/MobileBottomNav";

interface MobileHomeViewProps {
  weather: WeatherCurrent;
  warning: ActiveWarning;
  forecast: ForecastDay[];
  onNavigateTab: (tab: MobileTab) => void;
  onOpenWarningDetail: () => void;
  onOpenSayaAman: () => void;
  onOpenOfflineMap: () => void;
}

export function MobileHomeView({
  weather,
  warning,
  forecast,
  onNavigateTab,
  onOpenWarningDetail,
  onOpenSayaAman,
  onOpenOfflineMap,
}: MobileHomeViewProps) {
  return (
    <div className="p-4 space-y-4 pb-20 select-none">
      {/* Greeting Header */}
      <div>
        <h2 className="text-lg font-extrabold text-[#17211D]">Halo, Adam 👋</h2>
        <p className="text-xs text-[#68756E]">
          Tetap waspada dan jaga keselamatan di sekitarmu.
        </p>
      </div>

      {/* 1. Status Wilayah Card */}
      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#68756E] block">Status Wilayah</span>
            <span className="text-sm font-bold text-[#176B4D]">Aman</span>
            <span className="text-[11px] text-[#929D96] block">
              Tidak ada peringatan aktif di wilayah Anda.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Cuaca Saat Ini Card */}
      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EAF4FB] text-[#3983B9] flex items-center justify-center">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#68756E] block">Cuaca Saat Ini</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-[#17211D]">
                {weather.temp}°C
              </span>
              <span className="text-xs font-semibold text-[#17211D]">
                {weather.condition}
              </span>
            </div>
            <span className="text-[10px] text-[#929D96] block">
              {weather.location}
            </span>
          </div>
        </div>
        <div className="text-right text-[11px] text-[#68756E]">
          <span>{weather.forecastRange}</span>
        </div>
      </div>

      {/* 3. Peringatan Aktif Banner (Red Callout) */}
      <div
        onClick={onOpenWarningDetail}
        className="bg-[#FDECEC] border border-[#F9C1C1] rounded-[16px] p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#D64545] text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#D64545] uppercase">
                Peringatan Aktif
              </span>
              <span className="text-[9px] bg-[#D64545] text-white px-1.5 py-0.2 rounded-full font-bold">
                BMKG
              </span>
            </div>
            <span className="text-xs font-bold text-[#17211D] block mt-0.5">
              {warning.title}
            </span>
            <span className="text-[10px] text-[#68756E] block">
              {warning.affectedArea} • {warning.validPeriod}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#D64545] shrink-0" />
      </div>

      {/* 4. Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={() => onNavigateTab("peta")}
          className="p-3 bg-white rounded-[14px] border border-[#E6EBE8] flex flex-col items-center text-center shadow-sm active:bg-[#F8FAF9]"
        >
          <div className="w-8 h-8 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center mb-1.5">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-[#17211D]">Rute Evakuasi</span>
        </button>

        <button
          onClick={() => onNavigateTab("mitigasi")}
          className="p-3 bg-white rounded-[14px] border border-[#E6EBE8] flex flex-col items-center text-center shadow-sm active:bg-[#F8FAF9]"
        >
          <div className="w-8 h-8 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center mb-1.5">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-[#17211D]">Tas Siaga</span>
        </button>

        <button
          onClick={onOpenSayaAman}
          className="p-3 bg-white rounded-[14px] border border-[#E6EBE8] flex flex-col items-center text-center shadow-sm active:bg-[#F8FAF9]"
        >
          <div className="w-8 h-8 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center mb-1.5">
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-[#17211D]">Saya Aman</span>
        </button>
      </div>

      {/* 5. 5-Day Forecast Compact preview */}
      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#17211D]">Prakiraan 5 Hari</span>
          <span className="text-[10px] text-[#929D96]">Kota Bogor</span>
        </div>
        <div className="grid grid-cols-5 gap-1 text-center">
          {forecast.map((day) => (
            <div key={day.id} className="p-1.5 rounded-lg bg-[#F8FAF9]">
              <span className="text-[10px] font-semibold text-[#68756E] block">
                {day.dayName}
              </span>
              <span className="text-xs my-1 block">
                {day.condition.includes("Hujan") ? "🌧" : "⛅"}
              </span>
              <span className="text-[10px] font-bold text-[#17211D]">
                {day.tempMin}°
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Offline Map Shortcut */}
      <div
        onClick={onOpenOfflineMap}
        className="bg-[#104A35] text-white rounded-[16px] p-3.5 flex items-center justify-between cursor-pointer shadow-md"
      >
        <div className="flex items-center gap-2.5">
          <DownloadCloud className="w-5 h-5 text-emerald-300" />
          <div>
            <span className="text-xs font-bold block">Peta Siap Akses Offline</span>
            <span className="text-[10px] text-emerald-100/80 block">
              Simpan data peta sebelum sinyal hilang
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold bg-white text-[#176B4D] px-2.5 py-1 rounded-full">
          Unduh
        </span>
      </div>
    </div>
  );
}
