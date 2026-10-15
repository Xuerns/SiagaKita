import React from "react";
import { 
  Home, 
  Map, 
  AlertTriangle, 
  FileText, 
  ShieldAlert, 
  Users, 
  Settings,
  TreePine,
  Home as HouseIcon
} from "lucide-react";

export type NavTab = "beranda" | "peta" | "peringatan" | "laporan" | "mitigasi" | "komunitas" | "pengaturan" | "tokens";

interface DesktopSidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  warningCount?: number;
}

export function DesktopSidebar({ currentTab, onSelectTab, warningCount = 1 }: DesktopSidebarProps) {
  const navItems = [
    { id: "beranda", label: "Beranda", icon: Home },
    { id: "peta", label: "Peta", icon: Map },
    { id: "peringatan", label: "Peringatan", icon: AlertTriangle, badge: warningCount },
    { id: "laporan", label: "Laporan Warga", icon: FileText },
    { id: "mitigasi", label: "Mitigasi", icon: ShieldAlert },
    { id: "komunitas", label: "Komunitas", icon: Users },
  ];

  return (
    <aside className="w-[190px] min-w-[190px] h-screen sticky top-0 bg-white border-r border-[#E6EBE8] flex flex-col justify-between p-4 z-20 select-none">
      {/* Top Branding */}
      <div>
        <div 
          onClick={() => onSelectTab("beranda")}
          className="flex items-center gap-2.5 mb-8 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-[10px] bg-[#176B4D] flex items-center justify-center text-white shadow-sm group-hover:bg-[#104A35] transition-colors">
            {/* Logo Bencana Alam: Simbol Gunung (Geologi/Gempa/Longsor) & Gelombang Air (Banjir/Tsunami) */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-emerald-300"
            >
              <path d="M2.5 14.5L8.5 6.5C9.2 5.5 10.3 5.5 11 6.5L14.5 12L16.5 9.5C17.1 8.7 18.1 8.7 18.7 9.5L21.5 14" />
              <path d="M2.5 18.5C5 16.8 7.5 16.8 10 18.5C12.5 20.2 15 20.2 17.5 18.5C19 17.5 20.2 17.5 21.5 18" />
            </svg>
          </div>
          <div>
            <div className="text-[17px] font-bold tracking-tight text-[#17211D] leading-none flex items-center gap-0.5">
              Siaga<span className="text-[#176B4D]">Kita</span>
            </div>
            <div className="text-[10px] text-[#68756E] mt-0.5 leading-tight">
              Siap Hari Ini, Aman Esok
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-[#E5F5EA] text-[#176B4D] font-semibold"
                    : "text-[#68756E] hover:bg-[#F5F7F6] hover:text-[#17211D]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#176B4D]" : "text-[#929D96]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-[#D64545] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings & Education Graphic */}
      <div className="space-y-4 pt-4 border-t border-[#F1F4F2]">
        <button
          onClick={() => onSelectTab("pengaturan")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors ${
            currentTab === "pengaturan"
              ? "bg-[#E5F5EA] text-[#176B4D] font-semibold"
              : "text-[#68756E] hover:bg-[#F5F7F6] hover:text-[#17211D]"
          }`}
        >
          <Settings className="w-4 h-4 text-[#929D96]" />
          <span>Pengaturan</span>
        </button>

        {/* Stylized Illustrated Widget */}
        <div className="bg-[#F1F8F3] rounded-[14px] p-3 border border-[#E5F5EA] text-center relative overflow-hidden">
          <div className="flex justify-center items-center gap-2 mb-2 text-[#25845F]">
            <TreePine className="w-4 h-4" />
            <HouseIcon className="w-5 h-5 text-[#176B4D]" />
            <TreePine className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-[#104A35] font-medium leading-relaxed">
            Bersama kita lebih siap menghadapi bencana.
          </p>
          <div className="mt-2">
            <span className="text-[9px] text-[#25845F] font-semibold bg-white/70 px-2 py-0.5 rounded-full border border-[#CDD7D1]">
              PWA Aktif • Offline Ready
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
