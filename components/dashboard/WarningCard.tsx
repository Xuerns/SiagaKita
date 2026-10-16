import React from "react";
import { AlertTriangle, Clock, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { ActiveWarning } from "@/types";

interface WarningCardProps {
  warning: ActiveWarning;
  onOpenWarning?: () => void;
}

export function WarningCard({ warning, onOpenWarning }: WarningCardProps) {
  const isSafe = warning.level === "Aman";

  return (
    <div className={`bg-white rounded-[16px] border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all relative overflow-hidden group ${
      isSafe ? "border-[#E6EBE8] hover:border-[#CDD7D1]" : "border-[#F9C1C1] hover:border-[#D64545]"
    }`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isSafe ? "bg-[#E5F5EA] text-[#176B4D]" : "bg-[#FDECEC] text-[#D64545]"
            }`}>
              {isSafe ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[11px] font-medium text-[#68756E] block leading-none">
                {isSafe ? "Peringatan Dini" : "Peringatan Aktif"}
              </span>
              <span className={`text-xs font-semibold ${isSafe ? "text-[#176B4D]" : "text-[#D64545]"}`}>
                {warning.hazardType}
              </span>
            </div>
          </div>

          <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm ${
            isSafe ? "bg-[#E5F5EA] text-[#176B4D] border border-[#CDD7D1]" : "bg-[#D64545] text-white animate-pulse"
          }`}>
            {isSafe ? "0" : "1"}
          </span>
        </div>

        <h4 className="text-sm font-bold text-[#17211D] mt-1.5 leading-snug">
          {warning.title}
        </h4>

        <div className="text-xs text-[#68756E] mt-1 flex items-center gap-1">
          <MapPin className={`w-3 h-3 shrink-0 ${isSafe ? "text-[#176B4D]" : "text-[#D64545]"}`} />
          <span className="truncate">{warning.affectedArea}</span>
        </div>

        <div className="text-[11px] text-[#929D96] mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Berlaku: {warning.validPeriod}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#F1F4F2] flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#176B4D] bg-[#E5F5EA] px-2 py-0.5 rounded border border-[#CDD7D1]">
          Sumber: {warning.source}
        </span>

        {!isSafe && onOpenWarning && (
          <button
            onClick={onOpenWarning}
            className="text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all hover:underline text-[#D64545]"
          >
            <span>Lihat detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
