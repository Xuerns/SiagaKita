import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MapSkeleton() {
  return (
    <div className="space-y-4 w-full animate-fadeIn" data-testid="map-skeleton">
      {/* Top Controls: Title, Layer Pills, and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Skeleton className="h-6 w-44 rounded-[8px]" />
          <Skeleton className="h-3 w-64 max-w-full rounded-[4px] mt-1.5" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-[10px]" />
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[520px] md:h-[620px] rounded-[20px] bg-[#EAF2ED]/60 border border-[#CDD7D1] overflow-hidden flex items-center justify-center">
        {/* Animated Radar Pulse Effect */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-44 h-44 rounded-full bg-emerald-500/10 animate-ping" />
          <div className="absolute w-28 h-28 rounded-full bg-emerald-500/15 animate-pulse" />
          <div className="size-12 rounded-full bg-[#176B4D] text-white flex items-center justify-center shadow-lg shadow-emerald-900/20 z-10">
            <div className="size-3 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        {/* Scattered Pin Placeholders */}
        <div className="absolute top-16 left-24 hidden md:block">
          <Skeleton className="size-8 rounded-full ring-4 ring-white/80" />
        </div>
        <div className="absolute top-28 right-32 hidden md:block">
          <Skeleton className="size-8 rounded-full ring-4 ring-white/80" />
        </div>
        <div className="absolute bottom-24 left-36 hidden md:block">
          <Skeleton className="size-8 rounded-full ring-4 ring-white/80" />
        </div>

        {/* Map Control Tools Skeleton */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Skeleton className="size-9 rounded-[10px] bg-white shadow-sm" />
          <Skeleton className="size-9 rounded-[10px] bg-white shadow-sm" />
          <Skeleton className="size-9 rounded-[10px] bg-white shadow-sm" />
        </div>

        {/* Floating Bottom Card / Detail Panel Skeleton */}
        <div className="absolute bottom-4 inset-x-4 max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-[16px] p-4 border border-[#E6EBE8] shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Skeleton className="size-10 rounded-[10px] shrink-0" />
            <div className="space-y-1.5 min-w-0">
              <Skeleton className="h-4 w-40 rounded-[4px]" />
              <Skeleton className="h-3 w-56 max-w-full rounded-[4px]" />
            </div>
          </div>
          <Skeleton className="h-9 w-28 rounded-[10px] shrink-0" />
        </div>
      </div>
    </div>
  );
}
