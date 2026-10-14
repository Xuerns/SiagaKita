import React from "react";
import { Compass, CheckSquare, UserCheck, ChevronRight } from "lucide-react";
import { NavTab } from "../layout/DesktopSidebar";

interface QuickActionPanelProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSayaAman: () => void;
}

export function QuickActionPanel({ onNavigate, onOpenSayaAman }: QuickActionPanelProps) {
  const actions = [
    {
      id: "rute",
      title: "Lihat Rute Evakuasi",
      desc: "Temukan jalur teraman di sekitarmu",
      icon: Compass,
      onClick: () => onNavigate("peta"),
    },
    {
      id: "checklist",
      title: "Checklist Tas Siaga",
      desc: "Pastikan perlengkapanmu lengkap",
      icon: CheckSquare,
      onClick: () => onNavigate("mitigasi"),
    },
    {
      id: "aman",
      title: "Saya Aman",
      desc: "Bagikan status keselamatanmu",
      icon: UserCheck,
      onClick: onOpenSayaAman,
    },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-xs md:text-sm font-bold text-[#17211D]">Tindakan Cepat</h3>
        <p className="text-[11px] text-[#68756E]">Aksi penting untuk keselamatan darurat</p>
      </div>

      <div className="space-y-2 mt-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className="w-full flex items-center justify-between p-2.5 rounded-[12px] bg-[#F8FAF9] border border-[#E6EBE8] hover:bg-[#F1F8F3] hover:border-[#176B4D] transition-all text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[8px] bg-white border border-[#CDD7D1] flex items-center justify-center text-[#176B4D] group-hover:bg-[#176B4D] group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#17211D] block leading-tight group-hover:text-[#176B4D] transition-colors">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-[#68756E] block mt-0.5">
                    {act.desc}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#929D96] group-hover:text-[#176B4D] group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
