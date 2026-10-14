import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Crosshair, 
  Bell, 
  Wifi, 
  WifiOff, 
  Check,
  UserCheck
} from "lucide-react";

interface DesktopTopbarProps {
  currentLocation: string;
  onLocationChange: (loc: string) => void;
  onOpenLocationModal?: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export function DesktopTopbar({
  currentLocation,
  onLocationChange,
  onOpenLocationModal,
  isOnline,
  onToggleOnline,
  onOpenNotifications,
  onOpenProfile,
}: DesktopTopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const locations = ["Kota Bandung", "Kota Bogor", "Kab. Bogor", "Kota Depok", "Kab. Sukabumi", "DKI Jakarta", "Kota Surabaya"];

  return (
    <header className="h-16 bg-white border-b border-[#E6EBE8] px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative w-80 md:w-96">
        <Search className="w-4 h-4 text-[#929D96] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari lokasi, wilayah, atau informasi..."
          className="w-full pl-9 pr-4 py-2 bg-[#F8FAF9] rounded-[10px] text-xs md:text-sm text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white transition-all"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Location Selector */}
        <div className="relative">
          <button
            onClick={() => {
              if (onOpenLocationModal) {
                onOpenLocationModal();
              } else {
                setDropdownOpen(!dropdownOpen);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#F8FAF9] border border-[#E6EBE8] text-xs font-medium text-[#17211D] hover:bg-[#F1F4F2] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#176B4D]" />
            <span className="max-w-[150px] truncate">{currentLocation}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#929D96]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-[12px] shadow-lg border border-[#E6EBE8] py-1 z-30">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#929D96] uppercase tracking-wider flex items-center justify-between">
                <span>Pilih Wilayah</span>
                {onOpenLocationModal && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenLocationModal();
                    }}
                    className="text-[#176B4D] text-[10px] hover:underline"
                  >
                    Semua / GPS →
                  </button>
                )}
              </div>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    onLocationChange(loc);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#17211D] hover:bg-[#F1F8F3] hover:text-[#176B4D] flex items-center justify-between transition-colors"
                >
                  <span>{loc}</span>
                  {currentLocation === loc && <Check className="w-3.5 h-3.5 text-[#176B4D]" />}
                </button>
              ))}
              {onOpenLocationModal && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenLocationModal();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#176B4D] bg-[#F8FAF9] hover:bg-[#E5F5EA] border-t border-[#E6EBE8] flex items-center gap-1.5 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Cari Alamat / Gunakan GPS</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* GPS Locate Me */}
        <button
          onClick={() => {
            if (onOpenLocationModal) {
              onOpenLocationModal();
            }
          }}
          title="Gunakan lokasi saya saat ini (GPS)"
          className="p-2 rounded-[10px] text-[#68756E] hover:text-[#176B4D] hover:bg-[#F8FAF9] border border-transparent hover:border-[#E6EBE8] transition-all"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Connection status (Online / Offline simulator) */}
        <button
          onClick={onToggleOnline}
          title={isOnline ? "Mode Online (Klik untuk simulasi offline)" : "Mode Offline aktif (Klik untuk online)"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-[11px] font-medium border transition-colors ${
            isOnline
              ? "bg-[#E5F5EA] text-[#176B4D] border-[#CDD7D1]"
              : "bg-[#FEF1E6] text-[#C96B10] border-[#FBD6B5]"
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline (Cached)</span>
            </>
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-[10px] text-[#68756E] hover:text-[#17211D] hover:bg-[#F8FAF9] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D64545] ring-2 ring-white animate-pulse" />
        </button>

        <div className="h-5 w-px bg-[#E6EBE8] mx-1" />

        {/* User Profile */}
        <button 
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-[10px] hover:bg-[#F8FAF9] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#176B4D] text-white font-semibold text-xs flex items-center justify-center ring-2 ring-[#E5F5EA]">
            AN
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-[#17211D] leading-tight">Adams Nugraha</div>
            <div className="text-[10px] text-[#68756E] flex items-center gap-0.5">
              <UserCheck className="w-2.5 h-2.5 text-[#176B4D]" />
              Pengguna Warga
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
