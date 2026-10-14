import React from "react";
import { ShieldCheck, Shield } from "lucide-react";
import { RiskLevel } from "@/types";

interface RiskStatusCardProps {
  level?: RiskLevel;
  location?: string;
  onViewRiskDetails?: () => void;
}

export function RiskStatusCard({
  level = "Aman",
  location = "Kota Bogor",
  onViewRiskDetails,
}: RiskStatusCardProps) {
  return (
    <div 
      onClick={onViewRiskDetails}
      className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#CDD7D1] transition-all cursor-pointer relative overflow-hidden group"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-[#68756E] block leading-none">
              Status Risiko Wilayah
            </span>
            <span className="text-xs font-semibold text-[#17211D]">
              {location}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E5F5EA] text-[#176B4D] border border-[#CDD7D1]">
            Aman
          </span>
          <span className="text-xs text-[#68756E]">Indeks Kerentanan: Rendah</span>
        </div>

        <p className="text-xs text-[#68756E] mt-2 leading-relaxed">
          Tidak ada peringatan aktif di wilayah Anda saat ini. Tetap pantau secara berkala.
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-[#F1F4F2] flex items-center justify-between text-[10px] text-[#929D96]">
        <span>Model Risiko: InaRISK & Open Data</span>
        <span className="text-[#176B4D] font-medium group-hover:underline">Detail risiko →</span>
      </div>

      {/* Decorative shield background watermark */}
      <Shield className="w-24 h-24 text-[#E5F5EA]/40 absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105" />
    </div>
  );
}
