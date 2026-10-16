import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthSkeletonProps {
  mode?: "login" | "register";
}

export function AuthSkeleton({ mode = "login" }: AuthSkeletonProps) {
  return (
    <div
      className="min-h-screen bg-[#F5F7F6] text-[#17211D] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 font-sans animate-fadeIn"
      data-testid="auth-skeleton"
    >
      {/* Container Frame */}
      <div className="w-full max-w-5xl bg-white rounded-[24px] sm:rounded-[32px] border border-[#E6EBE8] shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        {/* Left Visual Hero Column (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0F3822] via-[#176B4D] to-[#25845F] p-8 sm:p-10 text-white flex-col justify-between relative overflow-hidden select-none">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-10 rounded-[12px] bg-white/20" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-28 rounded-[4px] bg-white/30" />
                <Skeleton className="h-3 w-36 rounded-[4px] bg-white/20" />
              </div>
            </div>
            <div className="pt-6 space-y-3">
              <Skeleton className="h-4 w-40 rounded-full bg-white/20" />
              <Skeleton className="h-7 w-64 rounded-[6px] bg-white/30" />
              <Skeleton className="h-4 w-52 rounded-[4px] bg-white/20" />
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <Skeleton className="h-3.5 w-44 rounded-[4px] bg-white/20" />
            <Skeleton className="h-3.5 w-40 rounded-[4px] bg-white/20" />
            <Skeleton className="h-3 w-32 rounded-[4px] bg-white/15" />
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          {/* Top Actions: Mobile Brand indicator placeholder */}
          <div className="flex lg:hidden items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-7 rounded-[8px]" />
              <Skeleton className="h-4 w-24 rounded-[4px]" />
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-md w-full mx-auto my-auto space-y-5">
            <div className="space-y-2 text-center sm:text-left">
              <Skeleton className="h-7 w-56 rounded-[8px]" />
              <Skeleton className="h-4 w-72 max-w-full rounded-[4px]" />
            </div>

            <div className="space-y-3.5 pt-2">
              {mode === "register" && (
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24 rounded-[4px]" />
                  <Skeleton className="h-10 w-full rounded-[10px]" />
                </div>
              )}

              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24 rounded-[4px]" />
                <Skeleton className="h-10 w-full rounded-[10px]" />
              </div>

              {mode === "register" && (
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-32 rounded-[4px]" />
                  <Skeleton className="h-10 w-full rounded-[10px]" />
                </div>
              )}

              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-20 rounded-[4px]" />
                <Skeleton className="h-10 w-full rounded-[10px]" />
              </div>

              <div className="pt-2 space-y-2.5">
                <Skeleton className="h-11 w-full rounded-[12px]" />
                <Skeleton className="h-10 w-full rounded-[12px]" />
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <Skeleton className="h-4 w-48 rounded-[4px]" />
            </div>
          </div>

          {/* Bottom Security / Privacy Note */}
          <div className="pt-6 border-t border-[#F1F4F2] flex justify-center">
            <Skeleton className="h-3 w-56 rounded-[4px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
