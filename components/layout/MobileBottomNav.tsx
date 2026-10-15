import React from "react";
import { Home, Map, FileText, ShieldAlert, User, AlertTriangle } from "lucide-react";

export type MobileTab = "beranda" | "peta" | "laporan" | "mitigasi" | "profil";

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  warningCount?: number;
}

export function MobileBottomNav({
  currentTab,
  onSelectTab,
  warningCount = 1,
}: MobileBottomNavProps) {
  const tabs = [
    { id: "beranda" as MobileTab, label: "Beranda", icon: Home },
    { id: "peta" as MobileTab, label: "Peta", icon: Map },
    { id: "laporan" as MobileTab, label: "Laporan", icon: FileText },
    { id: "mitigasi" as MobileTab, label: "Mitigasi", icon: ShieldAlert },
    { id: "profil" as MobileTab, label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E6EBE8] py-2 px-3 flex items-center justify-around z-40 select-none max-w-[440px] mx-auto shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all min-h-[44px] ${
              isActive
                ? "text-[#176B4D] font-bold"
                : "text-[#929D96] hover:text-[#17211D]"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "text-[#176B4D]" : "text-[#929D96]"}`} />
              {tab.id === "peta" && warningCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D64545]" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight leading-none">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function MobileHeader({
  locationName = "Kota Bogor",
  onOpenNotifications,
  onOpenLocationSelector,
}: {
  locationName?: string;
  onOpenNotifications: () => void;
  onOpenLocationSelector: () => void;
}) {
  return (
    <header className="h-14 bg-white border-b border-[#E6EBE8] px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[8px] bg-[#176B4D] text-white flex items-center justify-center font-bold text-xs shadow-sm">
          SK
        </div>
        <span className="text-sm font-bold text-[#17211D]">
          Siaga<span className="text-[#176B4D]">Kita</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenLocationSelector}
          className="px-2.5 py-1 bg-[#F8FAF9] border border-[#E6EBE8] rounded-full text-[11px] font-semibold text-[#17211D] flex items-center gap-1"
        >
          <span>📍 {locationName}</span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-[#68756E] hover:text-[#17211D]"
        >
          <span className="text-sm">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D64545] ring-1 ring-white" />
        </button>
      </div>
    </header>
  );
}
