import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search,
  MapPin, 
  ChevronDown, 
  Crosshair, 
  Bell, 
  Wifi, 
  WifiOff, 
  Check,
} from "lucide-react";
import { INDONESIA_REGIONS } from "@/lib/bmkg";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DesktopTopbarProps {
  currentLocation: string;
  onLocationChange: (loc: string) => void;
  onOpenLocationModal?: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  onOpenNotifications: () => void;
  onOpenProfile?: () => void;
}

export function DesktopTopbar({
  currentLocation,
  onLocationChange,
  onOpenLocationModal,
  isOnline,
  onToggleOnline,
  onOpenNotifications,
}: DesktopTopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const filteredLocations = useMemo(() => {
    if (!dropdownSearch.trim()) return INDONESIA_REGIONS;
    const q = dropdownSearch.toLowerCase();
    return INDONESIA_REGIONS.filter(
      (r) => r.name.toLowerCase().includes(q) || r.province.toLowerCase().includes(q)
    );
  }, [dropdownSearch]);

  return (
    <header className="h-16 bg-white border-b border-[#E6EBE8] px-3 flex items-center justify-between sticky top-0 z-40">
      {/* Sidebar Trigger (hanya desktop/tablet) & Logo untuk mobile */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hidden md:flex size-9 rounded-[10px] border border-[#E6EBE8] bg-white text-[#68756E] hover:border-[#CDD7D1] hover:bg-[#E5F5EA] hover:text-[#176B4D] cursor-pointer transition-colors" />

        {/* Logo tanpa background khusus tampilan mobile */}
        <div className="flex md:hidden items-center gap-1.5 select-none pl-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-[#176B4D] shrink-0"
          >
            <path d="M2.5 14.5L8.5 6.5C9.2 5.5 10.3 5.5 11 6.5L14.5 12L16.5 9.5C17.1 8.7 18.1 8.7 18.7 9.5L21.5 14" />
            <path d="M2.5 18.5C5 16.8 7.5 16.8 10 18.5C12.5 20.2 15 20.2 17.5 18.5C19 17.5 20.2 17.5 21.5 18" />
          </svg>
          <span className="text-sm font-bold tracking-tight text-[#17211D]">
            Siaga<span className="text-[#176B4D]">Kita</span>
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Location Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[10px] bg-[#F8FAF9] border border-[#E6EBE8] text-xs font-medium text-[#17211D] hover:bg-[#F1F4F2] transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#176B4D] shrink-0" />
            <span className="max-w-[95px] sm:max-w-[150px] truncate">{currentLocation}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#929D96] shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white rounded-[14px] shadow-xl border border-[#E6EBE8] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 pb-2 border-b border-[#F1F4F2] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#17211D]">Pilih Kota / Kabupaten</span>
                <span className="text-[10px] text-[#929D96]">{INDONESIA_REGIONS.length} Wilayah</span>
              </div>

              {/* Quick Search Input */}
              <div className="p-2 border-b border-[#F1F4F2]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#929D96] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dropdownSearch}
                    onChange={(e) => setDropdownSearch(e.target.value)}
                    placeholder="Cari kota / daerah..."
                    className="w-full pl-8 pr-2 py-1 text-xs bg-[#F8FAF9] border border-[#E6EBE8] rounded-[8px] focus:outline-none focus:border-[#176B4D]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Scrollable list */}
              <div className="max-h-60 overflow-y-auto no-scrollbar py-1">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      onLocationChange(loc.name);
                      setDropdownOpen(false);
                      setDropdownSearch("");
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      currentLocation === loc.name
                        ? "bg-[#E5F5EA] text-[#176B4D] font-bold"
                        : "text-[#17211D] hover:bg-[#F8FAF9]"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="block truncate">{loc.name}</span>
                      <span className="text-[10px] text-[#929D96] block truncate">{loc.province}</span>
                    </div>
                    {currentLocation === loc.name && <Check className="w-3.5 h-3.5 text-[#176B4D] shrink-0" />}
                  </button>
                ))}
              </div>

              {onOpenLocationModal && (
                <div className="pt-1 border-t border-[#F1F4F2] px-2">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenLocationModal();
                    }}
                    className="w-full text-left px-2 py-1.5 text-[11px] font-semibold text-[#176B4D] hover:bg-[#E5F5EA] rounded-[8px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Crosshair className="w-3 h-3 text-[#176B4D]" />
                    <span>Gunakan GPS / Buka Modal Lengkap</span>
                  </button>
                </div>
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
          className="hidden sm:flex p-2 rounded-[10px] text-[#68756E] hover:text-[#176B4D] hover:bg-[#F8FAF9] border border-transparent hover:border-[#E6EBE8] transition-all cursor-pointer"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Connection status (Online / Offline simulator) */}
        <button
          onClick={onToggleOnline}
          title={isOnline ? "Mode Online (Klik untuk simulasi offline)" : "Mode Offline aktif (Klik untuk online)"}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-[11px] font-medium border transition-colors cursor-pointer ${
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
          className="relative p-2 rounded-[10px] text-[#68756E] hover:text-[#17211D] hover:bg-[#F8FAF9] transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D64545] ring-2 ring-white animate-pulse" />
        </button>

      </div>
    </header>
  );
}

