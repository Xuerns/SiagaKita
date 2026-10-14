import React from "react";
import { AlertTriangle, X, ArrowRight } from "lucide-react";
import { ActiveWarning } from "@/types";

interface NotificationBannerProps {
  warning: ActiveWarning;
  onOpenWarning: () => void;
  onDismiss: () => void;
}

export function NotificationBanner({
  warning,
  onOpenWarning,
  onDismiss,
}: NotificationBannerProps) {
  return (
    <div className="fixed top-16 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-[#D64545] text-white p-4 rounded-[16px] shadow-2xl border border-white/20 animate-in slide-in-from-top duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white text-[#D64545] flex items-center justify-center shrink-0 font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.2 rounded-full">
                WEB PUSH NOTIFICATION
              </span>
              <span className="text-[10px] text-white/80">Baru Saja</span>
            </div>
            <h4 className="text-xs font-bold mt-1 leading-snug">
              {warning.title} ({warning.affectedArea})
            </h4>
            <p className="text-[11px] text-white/90 mt-1 leading-tight line-clamp-2">
              {warning.description}
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-white/70 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-end gap-2">
        <button
          onClick={onDismiss}
          className="px-2.5 py-1 text-[11px] font-medium text-white/80 hover:text-white"
        >
          Tutup
        </button>
        <button
          onClick={onOpenWarning}
          className="px-3 py-1 bg-white text-[#D64545] hover:bg-[#F8FAF9] rounded-[8px] text-[11px] font-bold flex items-center gap-1 shadow-sm"
        >
          <span>Buka Peringatan</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
