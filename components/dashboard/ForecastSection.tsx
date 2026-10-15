import React from "react";
import { CloudRain, Sun, CloudSun, Cloud } from "lucide-react";
import { ForecastDay } from "@/types";

export function ForecastSection({ forecast }: { forecast: ForecastDay[] }) {
  const getWeatherIcon = (cond: string) => {
    if (cond.includes("Hujan")) return <CloudRain className="w-6 h-6 text-[#3983B9]" />;
    if (cond.includes("Cerah Berawan")) return <CloudSun className="w-6 h-6 text-[#D9A514]" />;
    if (cond.includes("Berawan")) return <Cloud className="w-6 h-6 text-[#68756E]" />;
    return <Sun className="w-6 h-6 text-[#E88B26]" />;
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between">
      <div className="mb-3">
        <h3 className="text-xs md:text-sm font-bold text-[#17211D]">
          Prakiraan Cuaca 5 Hari ke Depan
        </h3>
        <span className="text-[10px] text-[#929D96]">Sumber: BMKG & Open-Meteo</span>
      </div>

      <div className="grid grid-cols-5 gap-2 pt-2">
        {forecast.slice(0, 5).map((day) => (
          <div
            key={day.id}
            className="flex flex-col items-center justify-between p-2 rounded-[12px] bg-[#F8FAF9] border border-[#E6EBE8] text-center hover:bg-[#F1F8F3] hover:border-[#CDD7D1] transition-all"
          >
            <div>
              <span className="text-[11px] font-semibold text-[#17211D] block">
                {day.dayName}
              </span>
              <span className="text-[10px] text-[#929D96] block mb-2">
                {day.dateStr}
              </span>
            </div>

            <div className="my-1">
              {getWeatherIcon(day.condition)}
            </div>

            <div className="mt-2 text-[11px] font-medium text-[#17211D]">
              <span className="font-bold">{day.tempMin}°</span>{" "}
              <span className="text-[#68756E]">{day.tempMax}°</span>
            </div>
            
            <div className="text-[9px] text-[#3983B9] font-medium mt-1">
              🌧 {day.rainChance}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
