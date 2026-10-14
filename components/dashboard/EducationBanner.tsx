import React from "react";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { NavTab } from "../layout/DesktopSidebar";

export function EducationBanner({ onNavigate }: { onNavigate: (tab: NavTab) => void }) {
  return (
    <div className="relative rounded-[16px] overflow-hidden p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full bg-[#104A35] text-white">
      {/* Background graphic gradient & pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#176B4D] via-[#104A35] to-[#0A2E21] opacity-95" />
      <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
      <div className="absolute right-4 top-4 text-emerald-400/20 pointer-events-none">
        <ShieldAlert className="w-20 h-20" />
      </div>

      <div className="relative z-10">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-semibold tracking-wide uppercase mb-2">
          Edukasi & Kesiapsiagaan
        </span>
        <h3 className="text-base font-bold leading-snug tracking-tight text-white max-w-[200px]">
          Kenali Risiko, Kurangi Dampak, Selamatkan Nyawa.
        </h3>
        <p className="text-[11px] text-emerald-100/80 mt-1.5 leading-relaxed">
          Ketahui panduan resmi evakuasi dan perlindungan mandiri saat terjadi bencana.
        </p>
      </div>

      <div className="relative z-10 mt-4">
        <button
          onClick={() => onNavigate("mitigasi")}
          className="w-full py-2 px-3 rounded-[10px] bg-white text-[#176B4D] hover:bg-emerald-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
        >
          <span>Pelajari Mitigasi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
