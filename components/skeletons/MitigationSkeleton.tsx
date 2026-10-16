import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MitigationSkeleton() {
  return (
    <div className="space-y-4 w-full animate-fadeIn" data-testid="mitigation-skeleton">
      {/* Title & Description */}
      <div>
        <Skeleton className="h-6 w-56 rounded-[8px]" />
        <Skeleton className="h-3 w-80 max-w-full rounded-[4px] mt-1.5" />
      </div>

      {/* Disaster Category Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {["w-28", "w-24", "w-32", "w-36", "w-40"].map((w, idx) => (
          <Skeleton key={idx} className={`h-9 ${w} rounded-[10px] shrink-0`} />
        ))}
      </div>

      {/* Main Guide Card Container */}
      <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#E6EBE8] shadow-2xs space-y-5">
        {/* Phase selector tabs */}
        <div className="flex items-center gap-2 border-b border-[#F1F4F2] pb-3">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>

        {/* Steps List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="p-4 rounded-[14px] bg-[#F8FAF9] border border-[#E6EBE8] flex items-start gap-3.5"
            >
              <Skeleton className="size-10 rounded-[10px] shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <Skeleton className="h-4 w-36 rounded-[4px]" />
                <Skeleton className="h-3 w-full rounded-[4px]" />
                <Skeleton className="h-3 w-4/5 rounded-[4px]" />
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Kit Tracker Box Skeleton */}
        <div className="p-4 rounded-[14px] bg-[#E5F5EA]/40 border border-[#CDD7D1] space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-44 rounded-[4px]" />
              <Skeleton className="h-3 w-64 rounded-[4px]" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
