"use client";

import React from "react";
import Link from "next/link";
import { Lock, LogIn, UserPlus, ArrowLeft } from "lucide-react";

interface LoginReminderOverlayProps {
  onBackToHome: () => void;
  title?: string;
  description?: string;
}

export function LoginReminderOverlay({
  onBackToHome,
  title = "Masuk untuk Akses Laporan Warga",
  description = "Untuk membagikan laporan kondisi lapangan, memvalidasi situasi bencana, dan mengakses informasi detail, silakan masuk dengan akun terverifikasi terlebih dahulu.",
}: LoginReminderOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-white/30 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Kartu persegi panjang dengan sudut melengkung / sisi tidak tajam (Scribd-style) */}
      <div className="bg-white rounded-[24px] p-6 md:p-8 max-w-[380px] md:max-w-[420px] w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-[#E6EBE8] animate-in zoom-in-95 duration-200 relative overflow-hidden select-none">
        {/* Aksen atas hijau khas SiagaKita */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#176B4D] via-[#2E9E74] to-[#176B4D]" />

        {/* Lingkaran Ikon Gembok */}
        <div className="w-14 h-14 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center mx-auto mb-4 border border-[#CDD7D1] shadow-xs">
          <Lock className="w-6 h-6 text-[#176B4D]" />
        </div>

        {/* Judul & Pesan */}
        <h3 className="text-lg md:text-xl font-extrabold text-[#17211D] tracking-tight">
          {title}
        </h3>

        <p className="text-xs md:text-sm text-[#68756E] mt-2.5 leading-relaxed">
          {description}
        </p>

        {/* Tombol Aksi */}
        <div className="mt-6 space-y-2.5">
          <Link
            href="/login"
            className="w-full py-3 px-4 rounded-[12px] bg-[#176B4D] hover:bg-[#104A35] text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Sekarang</span>
          </Link>

          <Link
            href="/register"
            className="w-full py-2.5 px-4 rounded-[12px] bg-[#F8FAF9] hover:bg-[#EFF3F0] text-[#176B4D] border border-[#CDD7D1] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Akun Baru</span>
          </Link>

          <button
            onClick={onBackToHome}
            className="w-full pt-2 pb-1 text-xs text-[#929D96] hover:text-[#17211D] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
