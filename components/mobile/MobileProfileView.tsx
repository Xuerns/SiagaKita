import React, { useState } from "react";
import { 
  MapPin, 
  PhoneCall, 
  Bell, 
  Lock, 
  LogOut,
  LogIn,
  ChevronRight,
  Trash2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { getUserInitials, getUserRoleLabel } from "@/lib/utils";
import {
  checkPushSubscriptionStatus,
  subscribeUserToPush,
  unsubscribeUserFromPush,
} from "@/lib/push-client";

interface MobileProfileViewProps {
  currentLocation: string;
  onOpenOfflineManager?: () => void;
}

export function MobileProfileView({
  currentLocation,
}: MobileProfileViewProps) {
  const { user, isGuest, logout, deleteAccount } = useAuth();
  const [pushStatus, setPushStatus] = useState<"subscribed" | "unsubscribed" | "denied" | "unsupported">("unsubscribed");
  const [isPushLoading, setIsPushLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    checkPushSubscriptionStatus().then(setPushStatus);
  }, []);

  const handleTogglePush = async () => {
    setIsPushLoading(true);
    if (pushStatus === "subscribed") {
      const res = await unsubscribeUserFromPush();
      if (res.success) setPushStatus("unsubscribed");
    } else {
      const res = await subscribeUserToPush();
      if (res.success) setPushStatus("subscribed");
    }
    setIsPushLoading(false);
  };

  const initials = getUserInitials(user?.nama, "TM");
  const roleLabel = getUserRoleLabel(user, isGuest);

  return (
    <div className="p-4 space-y-4 pb-20 select-none">
      {/* Profile Header */}
      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#176B4D] text-white font-bold flex items-center justify-center text-base shadow-sm">
            {initials}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#17211D]">
              {user?.nama || "Tamu SiagaKita"}
            </h3>
            <span className="text-[11px] text-[#68756E] block">
              {user?.email || (isGuest ? "Akses Terbuka Tanpa Akun" : "Tanpa Alamat Email")}
            </span>
            <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-semibold ${
              isGuest ? "bg-[#FEF1E6] text-[#C96B10]" : "bg-[#E5F5EA] text-[#176B4D]"
            }`}>
              {roleLabel}
            </span>
          </div>
        </div>

        {isGuest ? (
          <a
            href="/login"
            className="text-[11px] font-bold text-[#176B4D] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </a>
        ) : (
          <button
            onClick={() => logout()}
            className="text-[11px] font-bold text-[#D64545] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        )}
      </div>

      {/* Emergency Contacts Widget */}
      <div className="bg-[#FDECEC] border border-[#F9C1C1] rounded-[16px] p-3.5 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D64545] flex items-center gap-1">
          <PhoneCall className="w-3.5 h-3.5" />
          Nomor Darurat Kota Bogor
        </span>
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-[#17211D]">Call Center Darurat</span>
          <a href="tel:112" className="font-extrabold text-[#D64545] underline">112 (Bebas Pulsa)</a>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-[#17211D]">BPBD Kota Bogor</span>
          <a href="tel:02518321456" className="font-bold text-[#17211D]">0251-8321456</a>
        </div>
      </div>

      {/* Settings list */}
      <div className="bg-white rounded-[16px] border border-[#E6EBE8] divide-y divide-[#F1F4F2] shadow-sm text-xs">
        {/* Wilayah */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#176B4D]" />
            <div>
              <span className="font-semibold text-[#17211D] block">Wilayah Terpilih</span>
              <span className="text-[10px] text-[#68756E]">{currentLocation}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#929D96]" />
        </div>

        {/* Notifikasi Push */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#176B4D]" />
            <div>
              <span className="font-semibold text-[#17211D] block">Notifikasi Web Push</span>
              <span className="text-[10px] text-[#68756E]">
                {pushStatus === "subscribed"
                  ? "Aktif · Peringatan Siaga & Awas"
                  : pushStatus === "denied"
                  ? "Izin Browser Ditolak"
                  : "Ketuk untuk mengaktifkan"}
              </span>
            </div>
          </div>
          <button
            onClick={handleTogglePush}
            disabled={isPushLoading || pushStatus === "unsupported"}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              pushStatus === "subscribed" ? "bg-[#176B4D]" : "bg-[#CDD7D1]"
            }`}
          >
            <span
              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                pushStatus === "subscribed" ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Privacy */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#176B4D]" />
            <div>
              <span className="font-semibold text-[#17211D] block">Privasi Lokasi</span>
              <span className="text-[10px] text-[#68756E]">Penyamaran koordinat publik aktif</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#176B4D]">Aktif</span>
        </div>

        {/* Logout item */}
        <div
          onClick={() => logout()}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#F8FAF9] text-[#68756E]"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-[#68756E]" />
            <div>
              <span className="font-semibold block">Keluar dari Akun</span>
              <span className="text-[10px] text-[#929D96]">Akhiri sesi di perangkat ini</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#929D96]" />
        </div>

        {/* Hak Hapus Akun Permanen (UU PDP) - Khusus Pengguna Terdaftar */}
        {!isGuest && !user?.is_anonymous && (
          <div
            onClick={() => setShowDeleteModal(true)}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#FDECEC]/50 text-[#D64545] border-t border-[#F1F4F2]"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 text-[#D64545]" />
              <div>
                <span className="font-semibold block">Hapus Akun Permanen</span>
                <span className="text-[10px] text-[#D64545]/70">Hak Pemusnahan Data Pribadi (UU PDP)</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#D64545]" />
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus Akun Mobile */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-[20px] bg-white p-5 shadow-2xl border border-[#CDD7D1]">
            <div className="flex items-center gap-2.5 text-[#D64545] mb-2.5">
              <div className="w-9 h-9 rounded-full bg-[#FDECEC] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-[#D64545]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#17211D]">Hapus Akun Permanen?</h4>
                <span className="text-[10px] text-[#68756E]">Hak Privasi UU PDP No. 27 Tahun 2022</span>
              </div>
            </div>

            <p className="text-[11px] text-[#68756E] leading-relaxed mb-4">
              Seluruh riwayat laporan, profil, kontak darurat, dan data akun Anda akan dihapus permanen dari database. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F4F2]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-[#68756E] hover:bg-[#F8FAF9] rounded-[8px] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  const ok = await deleteAccount();
                  if (!ok) {
                    setIsDeleting(false);
                    alert("Gagal menghapus akun. Silakan coba lagi.");
                  }
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#D64545] hover:bg-[#B83838] rounded-[8px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Permanen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

