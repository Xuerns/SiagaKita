import React from "react";
import { ArrowLeft, AlertTriangle, CheckCircle2, Compass, Share2 } from "lucide-react";
import { ActiveWarning } from "@/types";

interface MobilePeringatanViewProps {
  warning: ActiveWarning;
  onBack: () => void;
  onOpenRoute: () => void;
}

export function MobilePeringatanView({
  warning,
  onBack,
  onOpenRoute,
}: MobilePeringatanViewProps) {
  return (
    <div className="bg-[#F5F7F6] min-h-screen pb-20 select-none">
      {/* Header */}
      <div className="h-14 bg-white border-b border-[#E6EBE8] px-4 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="p-1 -ml-1 text-[#17211D]">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold text-[#17211D]">Peringatan</h1>
        <div className="w-5" />
      </div>

      <div className="p-4 space-y-4">
        {/* Red Warning Card */}
        <div className="bg-[#D64545] text-white rounded-[20px] p-5 shadow-md space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white text-[#D64545] flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/80 block">
                  Peringatan Dini
                </span>
                <span className="text-base font-extrabold leading-tight block">
                  {warning.title}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-white text-[#D64545] px-2 py-0.5 rounded-full">
              {warning.source}
            </span>
          </div>

          <div className="text-xs text-white/90 pt-1 border-t border-white/20">
            <div>📍 {warning.affectedArea}</div>
            <div className="text-[11px] text-white/80 mt-0.5">
              🕒 Berlaku: {warning.validPeriod}
            </div>
          </div>
        </div>

        {/* Informasi Section */}
        <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-[#17211D]">Informasi</h3>
          <p className="text-xs text-[#68756E] leading-relaxed">
            {warning.description}
          </p>
        </div>

        {/* Yang Harus Dilakukan */}
        <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-[#17211D]">Yang harus dilakukan</h3>
          <div className="space-y-2.5">
            {warning.instructions.map((inst, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-[#17211D]">
                <CheckCircle2 className="w-4 h-4 text-[#176B4D] shrink-0 mt-0.5" />
                <span>{inst}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onOpenRoute}
            className="w-full py-3 px-4 rounded-[12px] bg-[#176B4D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Lihat Peta & Rute Evakuasi</span>
          </button>

          <button
            onClick={() => alert("Pesan peringatan telah disalin untuk dibagikan ke keluarga!")}
            className="w-full py-2.5 px-4 rounded-[12px] bg-white border border-[#CDD7D1] text-[#17211D] text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-[#68756E]" />
            <span>Bagikan Peringatan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
