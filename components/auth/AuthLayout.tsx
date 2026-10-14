"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Bell, 
  MapPin, 
  Users, 
  Radio, 
  Sparkles,
  CheckCircle2,
  Shield
} from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthLayoutProps {
  initialMode?: "login" | "register";
}

export function AuthLayout({ initialMode = "login" }: AuthLayoutProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#17211D] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#E5F5EA] selection:text-[#176B4D]">
      {/* Container Frame */}
      <div className="w-full max-w-5xl bg-white rounded-[24px] sm:rounded-[32px] border border-[#E6EBE8] shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* Left Visual Column (Showcase / Brand Hero) - Visible on lg screens */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0F3822] via-[#176B4D] to-[#25845F] p-8 sm:p-10 text-white flex-col justify-between relative overflow-hidden select-none">
          {/* Subtle decorative background watermarks & circles */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -left-10 top-1/4 w-40 h-40 rounded-full bg-[#5AC48A]/10 blur-xl pointer-events-none" />
          <Shield className="absolute -right-8 -bottom-8 w-52 h-52 text-white/5 pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-[12px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-sm group-hover:bg-white/20 transition-all">
                <ShieldCheck className="w-6 h-6 text-[#5AC48A]" />
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight text-white leading-none">
                  Siaga<span className="text-emerald-300">Kita</span>
                </div>
                <div className="text-[11px] text-white/70 mt-1">
                  Siap Hari Ini, Aman Esok
                </div>
              </div>
            </Link>

            {/* Tagline / Subtitle */}
            <div className="mt-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-emerald-200 mb-3">
                <Radio className="w-3 h-3 animate-pulse text-emerald-300" />
                <span>Sistem Peringatan Dini Cerdas</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-snug">
                Lindungi Diri, Keluarga, dan Komunitas Terdekat.
              </h2>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">
                Platform terpadu mitigasi bencana, jalur evakuasi offline, dan koordinasi relawan dengan presisi data BMKG & InaRISK.
              </p>
            </div>
          </div>

          {/* Middle Bento Showcase Cards */}
          <div className="relative z-10 space-y-2.5 my-6">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[14px] p-3 transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Peringatan Dini Real-time
                  </div>
                  <div className="text-[10px] text-white/70">
                    Notifikasi push lokal otomatis saat level risiko naik ke Siaga/Awas
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[14px] p-3 transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Peta Evakuasi Offline
                  </div>
                  <div className="text-[10px] text-white/70">
                    Akses rute evakuasi & titik posko tanpa koneksi internet
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[14px] p-3 transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Jaringan Komunitas & Relawan
                  </div>
                  <div className="text-[10px] text-white/70">
                    Validasi laporan cepat untuk koordinasi bantuan tanggap darurat
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Standar Keamanan Terverifikasi</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-200">v1.0 • SiagaKita</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          {/* Top Actions: Back to Home */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68756E] hover:text-[#176B4D] transition-colors py-1 px-2.5 rounded-[8px] hover:bg-[#F5F7F6]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>

            {/* Mobile Brand indicator */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] bg-[#176B4D] flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-sm font-bold text-[#17211D]">
                Siaga<span className="text-[#176B4D]">Kita</span>
              </span>
            </div>
          </div>

          {/* Form Content Header */}
          <div className="max-w-md w-full mx-auto my-auto">
            <div className="mb-6 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] tracking-tight">
                {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun SiagaKita"}
              </h1>
              <p className="text-xs sm:text-sm text-[#68756E] mt-1.5">
                {mode === "login"
                  ? "Masuk untuk mengakses dasbor kesiapsiagaan dan notifikasi wilayah Anda."
                  : "Bergabung bersama ribuan warga dan relawan untuk kesiapsiagaan bencana."}
              </p>

              {/* Mode Switcher Tabs */}
              <div className="mt-5 p-1 bg-[#F8FAF9] rounded-[12px] border border-[#E6EBE8] flex gap-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2 rounded-[9px] text-xs font-bold transition-all cursor-pointer ${
                    mode === "login"
                      ? "bg-white text-[#176B4D] shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#E6EBE8]"
                      : "text-[#68756E] hover:text-[#17211D]"
                  }`}
                >
                  Masuk ke Akun
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`flex-1 py-2 rounded-[9px] text-xs font-bold transition-all cursor-pointer ${
                    mode === "register"
                      ? "bg-white text-[#176B4D] shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#E6EBE8]"
                      : "text-[#68756E] hover:text-[#17211D]"
                  }`}
                >
                  Daftar Akun Baru
                </button>
              </div>
            </div>

            {/* Active Form */}
            {mode === "login" ? (
              <LoginForm onSwitchToRegister={() => setMode("register")} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setMode("login")} />
            )}
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-[#F1F4F2] text-center text-[11px] text-[#929D96]">
            SiagaKita © 2026 • Terintegrasi dengan BMKG, BNPB, dan BPBD Daerah
          </div>
        </div>

      </div>
    </div>
  );
}
