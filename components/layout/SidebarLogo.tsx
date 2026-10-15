"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SidebarLogoProps {
  onClick?: () => void;
  /** Optional real logo image; falls back to the placeholder mark. */
  src?: string;
  className?: string;
}

/**
 * Adaptive logo: full lockup when the sidebar is expanded,
 * centered square mark when collapsed to icon width.
 */
export function SidebarLogo({ onClick, src, className }: SidebarLogoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="SiagaKita - Beranda"
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[10px] p-1 text-left cursor-pointer transition-colors hover:bg-[#F5F7F6]",
        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#176B4D] text-emerald-300 shadow-sm">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="size-full rounded-[10px] object-cover" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 text-emerald-300"
          >
            <path d="M2.5 14.5L8.5 6.5C9.2 5.5 10.3 5.5 11 6.5L14.5 12L16.5 9.5C17.1 8.7 18.1 8.7 18.7 9.5L21.5 14" />
            <path d="M2.5 18.5C5 16.8 7.5 16.8 10 18.5C12.5 20.2 15 20.2 17.5 18.5C19 17.5 20.2 17.5 21.5 18" />
          </svg>
        )}
      </span>
      <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
        <span className="flex items-center gap-0.5 text-[16px] font-bold leading-none tracking-tight text-[#17211D]">
          Siaga<span className="text-[#176B4D]">Kita</span>
        </span>
        <span className="mt-0.5 truncate text-[10px] leading-tight text-[#68756E]">
          Siap Hari Ini, Aman Esok
        </span>
      </span>
    </button>
  );
}
