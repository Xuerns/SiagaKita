"use client";

import React, { useState, useEffect } from "react";
import { Share, PlusSquare, X, Smartphone, Bell, WifiOff } from "lucide-react";

export function IosInstallPromptModal() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Deteksi perangkat iOS (iPhone, iPad, iPod)
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    
    // Periksa apakah web app sudah berjalan dalam mode standalone (sudah diinstall ke Home Screen)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as unknown as { standalone?: boolean }).standalone);

    // Cek apakah pengguna sudah pernah menutup prompt ini dalam 7 hari terakhir
    const dismissedAt = localStorage.getItem("ios_pwa_prompt_dismissed");
    const isRecentlyDismissed =
      dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 7 * 24 * 60 * 60 * 1000;

    if (isIos && !isStandalone && !isRecentlyDismissed) {
      // Tampilkan setelah delay 2 detik agar tidak mengganggu rendering awal
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("ios_pwa_prompt_dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-t-[24px] sm:rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-[#CDD7D1] animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#17211D]">
                Pasang SiagaKita di iPhone / iPad
              </h3>
              <p className="text-[11px] text-[#68756E]">
                Untuk notifikasi darurat & peta evakuasi offline
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-[#929D96] hover:text-[#17211D] p-1.5 rounded-lg transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-xs text-[#17211D]">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-[#F8FAF9] border border-[#E6EBE8] rounded-[12px] p-2.5 flex flex-col items-center gap-1">
              <Bell className="w-4 h-4 text-[#176B4D]" />
              <span className="font-semibold text-[11px]">Notifikasi BMKG</span>
              <span className="text-[10px] text-[#68756E]">Wajib Home Screen di iOS</span>
            </div>
            <div className="bg-[#F8FAF9] border border-[#E6EBE8] rounded-[12px] p-2.5 flex flex-col items-center gap-1">
              <WifiOff className="w-4 h-4 text-[#176B4D]" />
              <span className="font-semibold text-[11px]">Peta Tanpa Sinyal</span>
              <span className="text-[10px] text-[#68756E]">Bisa dibuka saat sinyal mati</span>
            </div>
          </div>

          <div className="bg-[#F8FAF9] rounded-[14px] p-3.5 border border-[#E6EBE8] space-y-2.5">
            <p className="font-bold text-[#176B4D] text-[11px] uppercase tracking-wide">
              Langkah Pemasangan (Safari):
            </p>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#176B4D] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                1
              </span>
              <p className="text-xs">
                Ketuk tombol <span className="font-semibold text-blue-600 inline-flex items-center gap-0.5"><Share className="w-3.5 h-3.5 inline" /> Bagikan (Share)</span> di bilah navigasi bawah Safari.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#176B4D] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                2
              </span>
              <p className="text-xs">
                Gulir ke bawah dan pilih menu <span className="font-semibold text-[#17211D] inline-flex items-center gap-0.5"><PlusSquare className="w-3.5 h-3.5 inline text-emerald-600" /> Tambah ke Layar Utama</span>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#176B4D] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                3
              </span>
              <p className="text-xs">
                Buka ikon <span className="font-semibold text-[#176B4D]">SiagaKita</span> dari layar utama iPhone Anda untuk pengalaman penuh.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleDismiss}
            className="w-full bg-[#176B4D] hover:bg-[#0F3822] text-white py-2.5 rounded-[12px] font-semibold text-xs transition-colors"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
