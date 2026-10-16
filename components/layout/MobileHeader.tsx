"use client";

import React from "react";

export interface MobileHeaderProps {
  locationName?: string;
  onOpenNotifications: () => void;
  onOpenLocationSelector: () => void;
}

export function MobileHeader({
  locationName = "Kota Bogor",
  onOpenNotifications,
  onOpenLocationSelector,
}: MobileHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-[#E6EBE8] px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center text-[#176B4D]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-[#176B4D]"
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
          className="px-2.5 py-1 bg-[#F8FAF9] border border-[#E6EBE8] rounded-full text-[11px] font-semibold text-[#17211D] flex items-center gap-1 active:scale-95 transition-transform"
        >
          <span>📍 {locationName}</span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-[#68756E] hover:text-[#17211D] active:scale-95 transition-transform"
          aria-label="Notifikasi"
        >
          <span className="text-sm">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D64545] ring-1 ring-white" />
        </button>
      </div>
    </header>
  );
}
