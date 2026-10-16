"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DownloadCloud,
  ShieldCheck,
  AlertTriangle,
  LogIn,
  LogOut,
  Bell,
  BellRing,
  Loader2,
} from "lucide-react";
import { AuthUser } from "@/lib/context/AuthContext";
import {
  checkPushSubscriptionStatus,
  subscribeUserToPush,
  unsubscribeUserFromPush,
} from "@/lib/push-client";

export interface DesktopProfileViewProps {

  user: AuthUser | null;
  isGuest: boolean;
  currentLocation: string;
  onLogout: () => void;
  onOpenOfflineModal: () => void;
  onOpenNotifications: () => void;
  onOpenDeleteModal: () => void;
}

export function DesktopProfileView({
  user,
  isGuest,
  currentLocation,
  onLogout,
  onOpenOfflineModal,
  onOpenNotifications,
  onOpenDeleteModal,
}: DesktopProfileViewProps) {
  const isAnonymousOrGuest = isGuest || user?.is_anonymous;
  const userInitials = user?.nama ? user.nama.trim().slice(0, 2).toUpperCase() : "WG";

  const [pushStatus, setPushStatus] = useState<"unsupported" | "denied" | "subscribed" | "unsubscribed">("unsubscribed");
  const [isPushLoading, setIsPushLoading] = useState(false);
  const [pushMsg, setPushMsg] = useState<string | null>(null);

  useEffect(() => {
    checkPushSubscriptionStatus().then(setPushStatus);
  }, []);

  const handleTogglePush = async () => {
    setIsPushLoading(true);
    setPushMsg(null);
    if (pushStatus === "subscribed") {
      const res = await unsubscribeUserFromPush();
      setPushMsg(res.message);
      if (res.success) setPushStatus("unsubscribed");
    } else {
      const res = await subscribeUserToPush();
      setPushMsg(res.message);
      if (res.success) setPushStatus("subscribed");
    }
    setIsPushLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#17211D]">
          Pengaturan & Profil Akun
        </h1>
        <p className="text-xs text-[#68756E] mt-0.5">
          Kelola profil identitas, hak privasi (UU PDP), penyimpanan peta offline, dan notifikasi darurat.
        </p>
      </div>

      {/* KARTU PROFIL PENGGUNA */}
      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F4F2]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#176B4D] text-white flex items-center justify-center font-bold text-base ring-4 ring-[#E5F5EA] shrink-0">
              {userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-bold text-[#17211D]">
                  {user?.nama || "Pengguna Siaga"}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isAnonymousOrGuest
                      ? "bg-[#FEF1E6] text-[#C96B10]"
                      : "bg-[#E5F5EA] text-[#176B4D]"
                  }`}
                >
                  {isAnonymousOrGuest
                    ? "Mode Tamu"
                    : "Pengguna Warga Terdaftar"}
                </span>
              </div>
              <p className="text-xs text-[#68756E] mt-0.5">
                {user?.email || (isAnonymousOrGuest ? "Sesi penjelajahan tamu terbatas" : "Tidak ada email")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAnonymousOrGuest ? (
              <Link
                href="/login"
                className="py-2 px-3.5 rounded-[10px] bg-[#176B4D] hover:bg-[#12533B] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Daftar / Masuk Akun</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={onLogout}
                className="py-2 px-3.5 rounded-[10px] bg-[#F8FAF9] hover:bg-[#F1F4F2] border border-[#CDD7D1] text-[#68756E] hover:text-[#17211D] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Sesi</span>
              </button>
            )}
          </div>
        </div>

        {/* Detail Akun Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-[10px] bg-[#F8FAF9] border border-[#E6EBE8]">
            <span className="text-[10px] uppercase font-bold text-[#68756E] block mb-1">
              Status Identitas
            </span>
            <span className="font-semibold text-[#17211D] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#176B4D]" />
              {isAnonymousOrGuest ? "Tamu Sementara" : "Terverifikasi Aktif"}
            </span>
          </div>
          <div className="p-3 rounded-[10px] bg-[#F8FAF9] border border-[#E6EBE8]">
            <span className="text-[10px] uppercase font-bold text-[#68756E] block mb-1">
              Wilayah Pantauan
            </span>
            <span className="font-semibold text-[#17211D]">
              {currentLocation}
            </span>
          </div>
        </div>
      </div>

      {/* LAYANAN OFFLINE & NOTIFIKASI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-[#17211D]">Penyimpanan PWA Offline</h3>
          <p className="text-xs text-[#68756E]">
            Data peta vektor (PMTiles) dan checklist Tas Siaga disimpan secara lokal di peramban Anda untuk akses darurat tanpa internet.
          </p>
          <button
            type="button"
            onClick={onOpenOfflineModal}
            className="py-2 px-4 rounded-[10px] bg-[#176B4D] hover:bg-[#12533B] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Kelola Peta Offline</span>
          </button>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#17211D]">Notifikasi Peringatan Darurat (Web Push)</h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                pushStatus === "subscribed"
                  ? "bg-[#E5F5EA] text-[#176B4D]"
                  : pushStatus === "denied"
                  ? "bg-[#FEE2E2] text-[#DC2626]"
                  : "bg-[#F5F7F6] text-[#68756E]"
              }`}
            >
              {pushStatus === "subscribed"
                ? "Aktif (Terhubung)"
                : pushStatus === "denied"
                ? "Izin Ditolak"
                : pushStatus === "unsupported"
                ? "Tidak Didukung"
                : "Belum Aktif"}
            </span>
          </div>

          <p className="text-xs text-[#68756E]">
            Menerima siaran push darurat VAPID saat terjadi potensi banjir bandang, gempa, atau cuaca ekstrem di wilayah Anda langsung ke perangkat.
          </p>

          {pushMsg && (
            <p className="text-[11px] font-medium text-[#176B4D] bg-[#E5F5EA] p-2 rounded-[8px]">
              {pushMsg}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleTogglePush}
              disabled={isPushLoading || pushStatus === "unsupported"}
              className={`py-2 px-4 rounded-[10px] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                pushStatus === "subscribed"
                  ? "bg-[#F8FAF9] hover:bg-[#F1F4F2] border border-[#CDD7D1] text-[#68756E]"
                  : "bg-[#176B4D] hover:bg-[#12533B] text-white shadow-sm"
              }`}
            >
              {isPushLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : pushStatus === "subscribed" ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellRing className="w-4 h-4" />
              )}
              <span>
                {isPushLoading
                  ? "Memproses..."
                  : pushStatus === "subscribed"
                  ? "Nonaktifkan Push"
                  : "Aktifkan Web Push"}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenNotifications}
              className="py-2 px-3.5 rounded-[10px] bg-[#F8FAF9] hover:bg-[#F1F8F3] border border-[#CDD7D1] text-[#176B4D] text-xs font-bold cursor-pointer transition-colors"
            >
              Tes Suara & Banner
            </button>
          </div>
        </div>
      </div>

      {/* ZONA BAHAYA: HAK PEMUSNAHAN DATA PRIBADI (UU PDP NO. 27 TAHUN 2022) */}
      {!isAnonymousOrGuest ? (
        <div className="bg-[#FFF8F8] rounded-[16px] border border-[#F9C1C1] p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#D64545]">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Zona Bahaya: Hak Pemusnahan Data Pribadi (UU PDP)
            </h3>
          </div>
          <p className="text-xs text-[#68756E] leading-relaxed">
            Berdasarkan <strong>Pasal 8 & Pasal 43 UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong>, sebagai subjek data Anda berhak mengakhiri pemrosesan dan memusnahkan data pribadi Anda secara permanen. Menghapus akun akan memusnahkan akun, riwayat laporan warga, data foto/koordinat lapangan, dan preferensi Anda dari sistem kami tanpa dapat dipulihkan kembali.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenDeleteModal}
              className="py-2 px-4 rounded-[10px] bg-[#D64545] hover:bg-[#B83838] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>Hapus Akun & Data Pribadi Permanen</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#F8FAF9] rounded-[16px] border border-[#E6EBE8] p-4 text-xs text-[#68756E] flex items-center justify-between">
          <span>Anda saat ini menggunakan akun tamu sementara. Tidak ada data profil pribadi permanen yang tersimpan di server.</span>
          <Link href="/login" className="font-bold text-[#176B4D] hover:underline shrink-0 ml-3">
            Daftar Akun Warga &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
