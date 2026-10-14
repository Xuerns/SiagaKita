import React from "react";
import { ShieldCheck, ShieldAlert, Shield, AlertTriangle } from "lucide-react";
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
  const normLevel = (level || "aman").toLowerCase();

  const getRiskDetails = () => {
    switch (normLevel) {
      case "awas":
        return {
          title: "Awas",
          badgeClass: "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5] animate-pulse",
          icon: <ShieldAlert className="w-4 h-4 text-[#DC2626]" />,
          iconBg: "bg-[#FEE2E2]",
          indexDesc: "Indeks Kerentanan: Sangat Tinggi",
          message: "PERINGATAN BAHAYA: Potensi luapan air ekstrem. Bersiaplah menuju titik evakuasi terdekat.",
          shieldColor: "text-[#FEE2E2]/50",
        };
      case "siaga":
        return {
          title: "Siaga",
          badgeClass: "bg-[#FDECEC] text-[#D64545] border-[#F9C1C1]",
          icon: <AlertTriangle className="w-4 h-4 text-[#D64545]" />,
          iconBg: "bg-[#FDECEC]",
          indexDesc: "Indeks Kerentanan: Tinggi",
          message: "Waspada potensi genangan dan kenaikan debit air. Amankan dokumen penting dan pantau jalur evakuasi.",
          shieldColor: "text-[#FDECEC]/50",
        };
      case "waspada":
        return {
          title: "Waspada",
          badgeClass: "bg-[#FEF9E7] text-[#D97706] border-[#FDE68A]",
          icon: <AlertTriangle className="w-4 h-4 text-[#D97706]" />,
          iconBg: "bg-[#FEF9E7]",
          indexDesc: "Indeks Kerentanan: Sedang",
          message: "Potensi genangan air di titik cekungan akibat curah hujan lokal. Tingkatkan kewaspadaan lingkungan.",
          shieldColor: "text-[#FEF9E7]/50",
        };
      case "aman":
      default:
        return {
          title: "Aman",
          badgeClass: "bg-[#E5F5EA] text-[#176B4D] border-[#CDD7D1]",
          icon: <ShieldCheck className="w-4 h-4 text-[#176B4D]" />,
          iconBg: "bg-[#E5F5EA]",
          indexDesc: "Indeks Kerentanan: Rendah",
          message: "Kondisi wilayah saat ini stabil dan kondusif. Tidak ada ancaman banjir atau bencana aktif.",
          shieldColor: "text-[#E5F5EA]/40",
        };
    }
  };

  const details = getRiskDetails();

  return (
    <div 
      onClick={onViewRiskDetails}
      className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#CDD7D1] transition-all cursor-pointer relative overflow-hidden group"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-full ${details.iconBg} flex items-center justify-center transition-colors`}>
            {details.icon}
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
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${details.badgeClass}`}>
            {details.title}
          </span>
          <span className="text-xs text-[#68756E]">{details.indexDesc}</span>
        </div>

        <p className="text-xs text-[#68756E] mt-2 leading-relaxed">
          {details.message}
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-[#F1F4F2] flex items-center justify-between text-[10px] text-[#929D96]">
        <span>Model Risiko: InaRISK & Open Data</span>
        <span className="text-[#176B4D] font-medium group-hover:underline">Detail peta risiko →</span>
      </div>

      {/* Decorative shield background watermark */}
      <Shield className={`w-24 h-24 ${details.shieldColor} absolute -right-3 -bottom-3 pointer-events-none transition-transform group-hover:scale-105`} />
    </div>
  );
}
