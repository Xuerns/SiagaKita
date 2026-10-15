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
  // Label status selaras dengan peringatan level kuning (Waspada)
  const isWaspada = !warning.level || warning.level.toLowerCase() === "waspada";
  const badgeLabel = isWaspada ? "STATUS WASPADA" : `STATUS ${warning.level.toUpperCase()}`;

  return (
    <div className="fixed top-16 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-[#faf3d9] text-amber-950 p-4 rounded-[16px] shadow-2xl border border-amber-400/40 animate-in slide-in-from-top duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white text-amber-600 flex items-center justify-center shrink-0 font-bold shadow-xs border border-amber-950/10">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-950/15 text-amber-950 px-2 py-0.5 rounded-full border border-amber-950/10">
                {badgeLabel}
              </span>
              <span className="text-[10px] font-medium text-amber-900/80">Baru Saja</span>
            </div>
            <h4 className="text-xs font-bold mt-1.5 leading-snug text-amber-950">
              {warning.title}
            </h4>
            <p className="text-[11px] font-medium text-amber-900 mt-1 leading-snug line-clamp-2">
              {warning.description}
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-amber-950/70 hover:text-amber-950 hover:bg-amber-950/10 rounded-full p-1 transition-colors cursor-pointer shrink-0"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-amber-950/15 flex items-center justify-end gap-2">
        <button
          onClick={onDismiss}
          className="px-2.5 py-1 text-[11px] font-semibold text-amber-900 hover:text-amber-950 transition-colors cursor-pointer"
        >
          Tutup
        </button>
        <button
          onClick={onOpenWarning}
          className="px-3 py-1 bg-white text-amber-950 hover:bg-amber-50 rounded-[8px] text-[11px] font-bold flex items-center gap-1 shadow-xs border border-amber-950/15 transition-colors cursor-pointer"
        >
          <span>Buka Peringatan</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
