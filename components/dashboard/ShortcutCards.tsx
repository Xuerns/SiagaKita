import React from "react";
import { Map, MessageSquare, BookOpen, ArrowRight } from "lucide-react";
import { NavTab } from "../layout/DesktopSidebar";

interface ShortcutCardsProps {
  onNavigate: (tab: NavTab) => void;
}

export function ShortcutCards({ onNavigate }: ShortcutCardsProps) {
  const cards = [
    {
      id: "peta",
      tab: "peta" as NavTab,
      title: "Peta Risiko & Evakuasi",
      desc: "Lihat area berisiko, titik aman, dan rute evakuasi terdekat.",
      buttonLabel: "Buka Peta",
      icon: Map,
    },
    {
      id: "laporan",
      tab: "laporan" as NavTab,
      title: "Laporan Warga",
      desc: "Informasi kondisi lapangan langsung dari warga sekitar.",
      buttonLabel: "Lihat Laporan",
      icon: MessageSquare,
    },
    {
      id: "mitigasi",
      tab: "mitigasi" as NavTab,
      title: "Panduan Mitigasi",
      desc: "Pelajari langkah-langkah sebelum, saat, dan setelah bencana.",
      buttonLabel: "Pelajari",
      icon: BookOpen,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => onNavigate(item.tab)}
            className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#176B4D] hover:shadow-[0_4px_12px_rgba(23,107,77,0.08)] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 rounded-[12px] bg-[#176B4D] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5 text-emerald-200" />
              </div>
              <h3 className="text-sm font-bold text-[#17211D] group-hover:text-[#176B4D] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#68756E] mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F4F2]">
              <button className="w-full py-2 px-3 rounded-[10px] bg-[#176B4D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 group-hover:bg-[#104A35] transition-colors shadow-sm">
                <span>{item.buttonLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
