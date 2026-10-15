"use client";

import React, { useEffect } from "react";
import { AlertTriangle, X, MapPin } from "lucide-react";
import { ActiveWarning } from "@/types";

interface RiskAlertModalProps {
  warning: ActiveWarning;
  onClose: () => void;
  onConfirmSayaAman?: () => void;
  onNavigateToEvacuationRoute?: () => void;
  onOpenMitigationGuide?: () => void;
}

export function RiskAlertModal({ warning, onClose }: RiskAlertModalProps) {
  // Tutup jika pengguna menekan tombol Escape di keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[360px] rounded-[20px] shadow-2xl bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] text-white p-5 border border-red-400/30 relative flex flex-col cursor-default animate-in zoom-in-95 duration-200"
      >
        {/* Tombol X Langsung di Pojok Kanan Atas */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          aria-label="Tutup peringatan"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: Ikon + Status Peringatan */}
        <div className="flex items-center gap-2.5 pr-8 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
            Peringatan Risiko Tinggi
          </span>
        </div>

        {/* Tulisan Peringatan / Terjadi Apa */}
        <h3 className="text-base font-bold leading-snug text-white mb-2">
          {warning.title}
        </h3>

        {/* Sedikit Penjelasan */}
        <p className="text-xs text-white/95 leading-relaxed mb-3">
          {warning.whatHappened || warning.description}
        </p>

        {/* Lokasi Terkait */}
        {warning.affectedArea && (
          <div className="flex items-center gap-1.5 text-[11px] text-white/80 pt-2 border-t border-white/15">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-white/90" />
            <span className="truncate">{warning.affectedArea}</span>
          </div>
        )}
      </div>
    </div>
  );
}
