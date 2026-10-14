import React from "react";
import { CloudRain, Clock, MapPin } from "lucide-react";
import { WeatherCurrent } from "@/types";

export function WeatherCard({ weather }: { weather: WeatherCurrent }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#CDD7D1] transition-all">
      <div className="flex items-start justify-between">
        {/* Left Side: Current Weather */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-full bg-[#EAF4FB] text-[#3983B9] flex items-center justify-center">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-[#68756E] block leading-none">
                Cuaca Saat Ini
              </span>
              <span className="text-sm font-semibold text-[#17211D]">
                {weather.condition}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#17211D]">
              {weather.temp}°C
            </span>
            <span className="text-xs text-[#68756E] flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-[#176B4D]" />
              {weather.location}
            </span>
          </div>
        </div>

        {/* Right Side: Today's Window */}
        <div className="bg-[#F8FAF9] border border-[#E6EBE8] rounded-[12px] p-2.5 text-right min-w-[110px]">
          <span className="text-[10px] text-[#929D96] font-medium block">Prakiraan Hari Ini</span>
          <div className="text-xs font-semibold text-[#17211D] mt-0.5 flex items-center justify-end gap-1">
            <CloudRain className="w-3 h-3 text-[#3983B9]" />
            <span>{weather.todaySummary.condition}</span>
          </div>
          <div className="text-xs font-medium text-[#68756E] mt-0.5">
            {weather.todaySummary.range}
          </div>
          <div className="text-[10px] text-[#929D96] mt-1 flex items-center justify-end gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>{weather.todaySummary.timeWindow}</span>
          </div>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="mt-3 pt-2 border-t border-[#F1F4F2] flex items-center justify-between text-[10px] text-[#929D96]">
        <span>Sumber: {weather.source}</span>
        <span>{weather.lastUpdated}</span>
      </div>
    </div>
  );
}
