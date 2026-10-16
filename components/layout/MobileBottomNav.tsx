"use client";

import React from "react";
import { Home, Map, FileText, ShieldAlert, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { type NavTab } from "@/components/layout/DesktopSidebar";

export type MobileTab = "beranda" | "peta" | "laporan" | "mitigasi" | "profil" | "pengaturan";

export interface MobileBottomNavProps {
  currentTab: NavTab | MobileTab | string;
  onSelectTab: (tab: any) => void;
  warningCount?: number;
  className?: string;
}

interface BottomNavItem {
  id: "beranda" | "peta" | "laporan" | "mitigasi" | "pengaturan";
  fallbackId?: "profil";
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: BottomNavItem[] = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "peta", label: "Peta", icon: Map },
  { id: "laporan", label: "Laporan", icon: FileText },
  { id: "mitigasi", label: "Mitigasi", icon: ShieldAlert },
  { id: "pengaturan", fallbackId: "profil", label: "Profil", icon: User },
];

export function MobileBottomNav({
  currentTab,
  onSelectTab,
  warningCount = 0,
  className,
}: MobileBottomNavProps) {
  return (
    <nav
      role="navigation"
      aria-label="Mobile Navigation"
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6EBE8] select-none",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden",
        "pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-1.5 px-2",
        className
      )}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto w-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentTab === item.id ||
            (item.fallbackId && currentTab === item.fallbackId);

          return (
            <button
              key={item.id}
              onClick={() => {
                // If caller uses "profil" or "pengaturan", respect both
                if (item.id === "pengaturan" && currentTab === "profil") {
                  onSelectTab("profil");
                } else {
                  onSelectTab(item.id);
                }
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all rounded-xl",
                "min-h-[48px] min-w-[48px] active:scale-95 cursor-pointer",
                isActive
                  ? "text-[#176B4D]"
                  : "text-[#68756E] hover:text-[#17211D]"
              )}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-9 h-7 rounded-full transition-all duration-200",
                    isActive ? "bg-[#E5F5EA]" : "bg-transparent"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      isActive
                        ? "text-[#176B4D] scale-105 stroke-[2.4]"
                        : "text-[#68756E] stroke-[1.8]"
                    )}
                  />
                </div>

                {/* Warning dot for Peta */}
                {item.id === "peta" && warningCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D64545] ring-2 ring-white animate-pulse"
                    title={`${warningCount} peringatan aktif`}
                  />
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] sm:text-[11px] mt-0.5 tracking-tight leading-none transition-colors",
                  isActive ? "font-bold text-[#176B4D]" : "font-medium text-[#68756E]"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// Re-export MobileHeader from dedicated file for backwards-compatibility
export { MobileHeader } from "./MobileHeader";
export type { MobileHeaderProps } from "./MobileHeader";
