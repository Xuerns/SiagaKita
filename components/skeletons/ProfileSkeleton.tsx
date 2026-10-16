import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-5 max-w-4xl w-full animate-fadeIn" data-testid="profile-skeleton">
      {/* Title */}
      <div>
        <Skeleton className="h-6 w-48 rounded-[8px]" />
        <Skeleton className="h-3 w-72 max-w-full rounded-[4px] mt-1.5" />
      </div>

      {/* User Info Card Skeleton */}
      <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#E6EBE8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-40 rounded-[6px]" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-48 rounded-[4px]" />
            <Skeleton className="h-3 w-32 rounded-[4px]" />
          </div>
        </div>
        <Skeleton className="h-9 w-28 rounded-[10px]" />
      </div>

      {/* Settings Grid (2 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wilayah & Notifikasi Setting Card */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EBE8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F4F2]">
            <Skeleton className="size-8 rounded-[8px]" />
            <Skeleton className="h-4 w-36 rounded-[4px]" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-32 rounded-[4px]" />
                <Skeleton className="h-3 w-44 rounded-[4px]" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-36 rounded-[4px]" />
                <Skeleton className="h-3 w-48 rounded-[4px]" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-[10px]" />
          </div>
        </div>

        {/* Cache & Offline Map Setting Card */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EBE8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F4F2]">
            <Skeleton className="size-8 rounded-[8px]" />
            <Skeleton className="h-4 w-36 rounded-[4px]" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-28 rounded-[4px]" />
                <Skeleton className="h-3 w-36 rounded-[4px]" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-10 w-full rounded-[10px]" />
          </div>
        </div>
      </div>

      {/* Danger Zone / Logout Skeleton */}
      <div className="p-4 rounded-[16px] bg-[#F8FAF9] border border-[#E6EBE8] flex items-center justify-between">
        <Skeleton className="h-4 w-40 rounded-[4px]" />
        <Skeleton className="h-9 w-28 rounded-[10px]" />
      </div>
    </div>
  );
}
