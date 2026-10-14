import React, { useState } from "react";
import { 
  User, 
  MapPin, 
  PhoneCall, 
  Bell, 
  HardDrive, 
  Shield, 
  Lock, 
  Check, 
  LogOut,
  ChevronRight 
} from "lucide-react";

interface MobileProfileViewProps {
  currentLocation: string;
  onOpenOfflineManager: () => void;
}

export function MobileProfileView({
  currentLocation,
  onOpenOfflineManager,
}: MobileProfileViewProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [guestMode, setGuestMode] = useState(false);

  return (
    <div className="p-4 space-y-4 pb-20 select-none">
      {/* Profile Header */}
      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#176B4D] text-white font-bold flex items-center justify-center text-base shadow-sm">
            {guestMode ? "TG" : "AN"}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#17211D]">
              {guestMode ? "Tamu SiagaKita" : "Adams Nugraha"}
            </h3>
            <span className="text-[11px] text-[#68756E] block">
              {guestMode ? "Akses Terbuka Tanpa Akun" : "adams.nugraha@gmail.com"}
            </span>
            <span className="inline-block mt-1 text-[10px] bg-[#E5F5EA] text-[#176B4D] px-2 py-0.2 rounded font-semibold">
              {guestMode ? "Mode Tamu" : "Akun Terverifikasi"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setGuestMode(!guestMode)}
          className="text-[10px] font-bold text-[#176B4D] hover:underline"
        >
          {guestMode ? "Masuk Akun" : "Mode Tamu"}
        </button>
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
              <span className="text-[10px] text-[#68756E]">Peringatan dini Siaga & Awas</span>
            </div>
          </div>
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              pushEnabled ? "bg-[#176B4D]" : "bg-[#CDD7D1]"
            }`}
          >
            <span
              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                pushEnabled ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Offline Storage */}
        <div
          onClick={onOpenOfflineManager}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#F8FAF9]"
        >
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-[#176B4D]" />
            <div>
              <span className="font-semibold text-[#17211D] block">Penyimpanan Offline</span>
              <span className="text-[10px] text-[#68756E]">PMTiles & Checklist (42.4 MB)</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#176B4D]">Kelola</span>
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
      </div>
    </div>
  );
}
