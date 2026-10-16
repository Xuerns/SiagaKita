import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeSkeleton } from "./HomeSkeleton";

export function DashboardShellSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#17211D] flex" data-testid="dashboard-shell-skeleton">
      {/* Desktop Left Sidebar Skeleton */}
      <aside className="hidden md:flex flex-col w-60 border-r border-[#E6EBE8] bg-white h-screen sticky top-0 p-3 select-none justify-between shrink-0">
        <div className="space-y-4">
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 p-1">
            <Skeleton className="size-8 rounded-[8px]" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24 rounded-[4px]" />
              <Skeleton className="h-3 w-32 rounded-[4px]" />
            </div>
          </div>

          <div className="h-px bg-[#F1F4F2] w-full" />

          {/* Menu Items */}
          <div className="space-y-1.5 pt-1">
            <Skeleton className="h-3 w-20 rounded-[4px] px-2 mb-2" />
            <Skeleton className="h-10 w-full rounded-[10px]" />
            <Skeleton className="h-10 w-full rounded-[10px]" />
            <Skeleton className="h-10 w-full rounded-[10px]" />
            <Skeleton className="h-10 w-full rounded-[10px]" />
          </div>
        </div>

        {/* Bottom User Profile Menu */}
        <div className="pt-3 border-t border-[#F1F4F2] flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="space-y-1 flex-1 min-w-0">
            <Skeleton className="h-3.5 w-24 rounded-[4px]" />
            <Skeleton className="h-2.5 w-32 rounded-[4px]" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Skeleton */}
        <header className="h-16 bg-white border-b border-[#E6EBE8] px-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-[10px] hidden md:block" />
            <Skeleton className="h-5 w-28 rounded-[6px] md:hidden" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32 rounded-[10px]" />
            <Skeleton className="size-8 rounded-[10px]" />
          </div>
        </header>

        {/* Main Content Body with HomeSkeleton */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          <HomeSkeleton />
        </main>
      </div>

      {/* Mobile Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E6EBE8] p-2 flex md:hidden items-center justify-around">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex flex-col items-center gap-1">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-2.5 w-10 rounded-[4px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
