import React from "react";
import { Home, Map, Users, ShieldAlert, User, AlertTriangle } from "lucide-react";

export type MobileTab = "beranda" | "peta" | "komunitas" | "mitigasi" | "profil";

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
    { id: "komunitas" as MobileTab, label: "Komunitas", icon: Users },
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
        <div className="w-7 h-7 rounded-[8px] bg-[#176B4D] text-white flex items-center justify-center shadow-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-emerald-300"
          >
            <path d="M2.5 14.5L8.5 6.5C9.2 5.5 10.3 5.5 11 6.5L14.5 12L16.5 9.5C17.1 8.7 18.1 8.7 18.7 9.5L21.5 14" />
            <path d="M2.5 18.5C5 16.8 7.5 16.8 10 18.5C12.5 20.2 15 20.2 17.5 18.5C19 17.5 20.2 17.5 21.5 18" />
          </svg>
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
