"use client";

import React from "react";
import Link from "next/link";
import { Lock, LogIn, UserPlus, ArrowLeft } from "lucide-react";

interface LoginReminderOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBackToHome?: () => void;
  title?: string;
  description?: string;
}

export function LoginReminderOverlay({
  isOpen = true,
  onClose,
  onBackToHome,
  title = "Masuk untuk Buat Laporan",
  description = "Untuk membagikan laporan kondisi lapangan, memvalidasi situasi bencana, dan membantu warga sekitar, silakan masuk dengan akun terverifikasi. Mode tamu tidak diizinkan membuat laporan guna menjaga keaslian data.",
}: LoginReminderOverlayProps) {
  if (!isOpen) return null;

  const handleClose = onClose || onBackToHome || (() => {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Kartu persegi panjang dengan sudut melengkung halus */}
      <div className="bg-white rounded-[24px] p-6 md:p-8 max-w-[380px] md:max-w-[420px] w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-[#E6EBE8] animate-in zoom-in-95 duration-200 relative overflow-hidden select-none z-10">
        {/* Tombol Tutup (X) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#929D96] hover:text-[#17211D] hover:bg-[#F0F4F2] transition-colors cursor-pointer"
          title="Tutup dialog"
          aria-label="Tutup"
        >
          <ArrowLeft className="w-4 h-4 sr-only" />
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

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
            onClick={handleClose}
            className="w-full pt-2 pb-1 text-xs text-[#929D96] hover:text-[#17211D] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>Nanti Saja</span>
          </button>
        </div>
      </div>
    </div>
  );
}
