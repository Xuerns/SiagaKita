import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="space-y-6 w-full animate-fadeIn" data-testid="home-skeleton">
      {/* Header Greeting Skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-[8px]" />
          <Skeleton className="h-4 w-72 max-w-full rounded-[6px]" />
        </div>
        <Skeleton className="hidden sm:block h-6 w-32 rounded-full" />
      </div>

      {/* Top Summary Row (3 Cards: Cuaca, Status Risiko, Peringatan) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weather Card Skeleton */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E6EBE8] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-9 rounded-[10px]" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20 rounded-[4px]" />
                <Skeleton className="h-4 w-28 rounded-[4px]" />
              </div>
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="flex items-baseline gap-3 pt-1">
            <Skeleton className="h-9 w-20 rounded-[8px]" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F1F4F2]">
            <Skeleton className="h-7 rounded-[6px]" />
            <Skeleton className="h-7 rounded-[6px]" />
            <Skeleton className="h-7 rounded-[6px]" />
          </div>
        </div>

        {/* Risk Status Card Skeleton */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E6EBE8] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-[4px]" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-7 w-36 rounded-[6px]" />
          <Skeleton className="h-3 w-full rounded-[4px]" />
          <div className="pt-2">
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <div className="pt-2 flex justify-between items-center border-t border-[#F1F4F2]">
            <Skeleton className="h-3 w-24 rounded-[4px]" />
            <Skeleton className="h-3 w-16 rounded-[4px]" />
          </div>
        </div>

        {/* Warning Card Skeleton */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E6EBE8] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-28 rounded-[4px]" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-5 w-4/5 rounded-[6px]" />
          <Skeleton className="h-3 w-full rounded-[4px]" />
          <Skeleton className="h-3 w-3/4 rounded-[4px]" />
          <div className="pt-2 border-t border-[#F1F4F2] flex justify-end">
            <Skeleton className="h-4 w-24 rounded-[4px]" />
          </div>
        </div>
      </div>

      {/* Gempa Bumi Terkini Wide Card Skeleton */}
      <div className="bg-white rounded-[16px] p-4 sm:p-5 border border-[#E6EBE8] shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 rounded-[8px]" />
            <Skeleton className="h-5 w-40 rounded-[6px]" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-28 rounded-[4px]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#F1F4F2]">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16 rounded-[4px]" />
            <Skeleton className="h-6 w-20 rounded-[6px]" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16 rounded-[4px]" />
            <Skeleton className="h-5 w-24 rounded-[6px]" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16 rounded-[4px]" />
            <Skeleton className="h-5 w-24 rounded-[6px]" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16 rounded-[4px]" />
            <Skeleton className="h-5 w-24 rounded-[6px]" />
          </div>
        </div>
        <div className="pt-3 flex justify-between items-center">
          <Skeleton className="h-4 w-52 max-w-full rounded-[4px]" />
          <Skeleton className="h-7 w-28 rounded-[8px]" />
        </div>
      </div>

      {/* 3 Shortcut Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[16px] p-4 border border-[#E6EBE8] shadow-2xs flex items-center gap-3">
            <Skeleton className="size-11 rounded-[12px] shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-4 w-28 rounded-[4px]" />
              <Skeleton className="h-3 w-full rounded-[4px]" />
            </div>
          </div>
        ))}
      </div>

      {/* Lower Row: Forecast (5-col), Quick Action (4-col), Education (3-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-5 bg-white rounded-[16px] p-4 border border-[#E6EBE8] shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32 rounded-[4px]" />
            <Skeleton className="h-4 w-16 rounded-[4px]" />
          </div>
          <div className="grid grid-cols-5 gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((d) => (
              <div key={d} className="flex flex-col items-center space-y-2 p-2 rounded-[10px] bg-[#F8FAF9]">
                <Skeleton className="h-3 w-8 rounded-[4px]" />
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-3 w-10 rounded-[4px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-[16px] p-4 border border-[#E6EBE8] shadow-2xs space-y-3">
          <Skeleton className="h-4 w-28 rounded-[4px]" />
          <Skeleton className="h-10 w-full rounded-[10px]" />
          <Skeleton className="h-10 w-full rounded-[10px]" />
          <Skeleton className="h-10 w-full rounded-[10px]" />
        </div>

        <div className="lg:col-span-3 bg-white rounded-[16px] p-4 border border-[#E6EBE8] shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-[4px]" />
            <Skeleton className="h-5 w-4/5 rounded-[6px]" />
            <Skeleton className="h-3 w-full rounded-[4px]" />
            <Skeleton className="h-3 w-3/4 rounded-[4px]" />
          </div>
          <Skeleton className="h-8 w-full rounded-[8px]" />
        </div>
      </div>
    </div>
  );
}
