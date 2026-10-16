import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CommunitySkeleton() {
  return (
    <div className="space-y-4 w-full animate-fadeIn" data-testid="community-skeleton">
      {/* Title & Description Skeleton */}
      <div>
        <Skeleton className="h-6 w-52 rounded-[8px]" />
        <Skeleton className="h-3 w-80 max-w-full rounded-[4px] mt-1.5" />
      </div>

      {/* Action Bar: Category Chips & Search & Post Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {["w-16", "w-16", "w-24", "w-20", "w-24"].map((width, idx) => (
            <Skeleton key={idx} className={`h-8 ${width} rounded-full shrink-0`} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-40 rounded-[10px] hidden sm:block" />
          <Skeleton className="h-9 w-32 rounded-[10px] shrink-0" />
        </div>
      </div>

      {/* Report Cards List */}
      <div className="space-y-3.5 pt-1">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="bg-white rounded-[16px] p-4 sm:p-5 border border-[#E6EBE8] shadow-2xs space-y-3"
          >
            {/* Author header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-10 rounded-full shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28 rounded-[4px]" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-36 rounded-[4px]" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Title & Body content */}
            <div className="space-y-2 pt-1">
              <Skeleton className="h-5 w-3/4 rounded-[6px]" />
              <Skeleton className="h-3.5 w-full rounded-[4px]" />
              <Skeleton className="h-3.5 w-5/6 rounded-[4px]" />
            </div>

            {/* Photo thumbnails placeholder for 1st & 2nd card */}
            {card <= 2 && (
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="size-20 rounded-[10px] shrink-0" />
                <Skeleton className="size-20 rounded-[10px] shrink-0" />
              </div>
            )}

            {/* Footer with actions */}
            <div className="pt-3 border-t border-[#F1F4F2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-28 rounded-[4px]" />
                <Skeleton className="h-3 w-20 rounded-[4px]" />
              </div>
              <Skeleton className="h-8 w-32 rounded-[8px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
