import React from "react";
import { CloudRain, CloudSun, Sun, Cloud, CloudLightning, Clock, MapPin, RefreshCw } from "lucide-react";
import { WeatherCurrent } from "@/types";

interface WeatherCardProps {
  weather: WeatherCurrent;
  isLoading?: boolean;
  onRefresh?: () => void;
  onOpenLocationModal?: () => void;
}

export function WeatherCard({ weather, isLoading, onRefresh, onOpenLocationModal }: WeatherCardProps) {
  // Dynamic weather icon and colors based on condition description
  const getWeatherIconInfo = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("petir")) {
      return {
        icon: <CloudLightning className="w-4 h-4" />,
        bgColor: "bg-[#FEF3E6]",
        textColor: "text-[#D97706]",
      };
    }
    if (c.includes("hujan")) {
      return {
        icon: <CloudRain className="w-4 h-4" />,
        bgColor: "bg-[#EAF4FB]",
        textColor: "text-[#3983B9]",
      };
    }
    if (c.includes("cerah berawan")) {
      return {
        icon: <CloudSun className="w-4 h-4" />,
        bgColor: "bg-[#FEF9E7]",
        textColor: "text-[#D9A514]",
      };
    }
    if (c.includes("berawan") || c.includes("kabut") || c.includes("kabur")) {
      return {
        icon: <Cloud className="w-4 h-4" />,
        bgColor: "bg-[#F1F4F2]",
        textColor: "text-[#68756E]",
      };
    }
    return {
      icon: <Sun className="w-4 h-4" />,
      bgColor: "bg-[#FEF3C7]",
      textColor: "text-[#E88B26]",
    };
  };

  const iconInfo = getWeatherIconInfo(weather.condition);
  const todayIconInfo = getWeatherIconInfo(weather.todaySummary?.condition || weather.condition);

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#CDD7D1] transition-all relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#176B4D]">
            <RefreshCw className="w-4 h-4 animate-spin text-[#176B4D]" />
            <span>Memperbarui data BMKG...</span>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        {/* Left Side: Current Weather */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-8 h-8 rounded-full ${iconInfo.bgColor} ${iconInfo.textColor} flex items-center justify-center transition-colors`}>
              {iconInfo.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#68756E] block leading-none">
                  Cuaca Saat Ini
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#E8F5E9] text-[#176B4D] border border-[#C8E6C9]">
                  {weather.source}
                </span>
              </div>
              <span className="text-sm font-semibold text-[#17211D]">
                {weather.condition}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#17211D]">
              {weather.temp}°C
            </span>
            {onOpenLocationModal ? (
              <button
                onClick={onOpenLocationModal}
                className="text-xs text-[#176B4D] flex items-center gap-1 group bg-[#F8FAF9] hover:bg-[#E5F5EA] px-2 py-0.5 rounded-full border border-[#E6EBE8] transition-colors cursor-pointer"
                title="Klik untuk ubah lokasi atau deteksi GPS"
              >
                <MapPin className="w-3 h-3 text-[#176B4D] shrink-0" />
                <span className="truncate max-w-[120px] font-medium">{weather.location}</span>
                <span className="text-[10px] text-[#68756E] group-hover:text-[#176B4D]">▾</span>
              </button>
            ) : (
              <span className="text-xs text-[#68756E] flex items-center gap-0.5 truncate max-w-[140px]" title={weather.location}>
                <MapPin className="w-3 h-3 text-[#176B4D] shrink-0" />
                <span className="truncate">{weather.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Today's Window */}
        <div className="bg-[#F8FAF9] border border-[#E6EBE8] rounded-[12px] p-2.5 text-right min-w-[110px]">
          <span className="text-[10px] text-[#929D96] font-medium block">Prakiraan Hari Ini</span>
          <div className="text-xs font-semibold text-[#17211D] mt-0.5 flex items-center justify-end gap-1">
            <span className={todayIconInfo.textColor}>{todayIconInfo.icon}</span>
            <span>{weather.todaySummary?.condition || weather.condition}</span>
          </div>
          <div className="text-xs font-medium text-[#68756E] mt-0.5">
            {weather.todaySummary?.range || weather.forecastRange}
          </div>
          <div className="text-[10px] text-[#929D96] mt-1 flex items-center justify-end gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>{weather.todaySummary?.timeWindow || "24 Jam"}</span>
          </div>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="mt-3 pt-2 border-t border-[#F1F4F2] flex items-center justify-between text-[10px] text-[#929D96]">
        <div className="flex items-center gap-1.5">
          <span>Sumber: {weather.source}</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-[#176B4D] hover:text-[#0f4a34] transition-colors p-0.5"
              title="Perbarui data dari BMKG"
            >
              <RefreshCw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
        <span>{weather.lastUpdated}</span>
      </div>
    </div>
  );
}
