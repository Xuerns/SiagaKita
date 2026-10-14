import React, { useState } from "react";
import { 
  X, 
  MapPin, 
  Search, 
  Crosshair, 
  Check, 
  Loader2, 
  Navigation, 
  Building2,
  AlertCircle
} from "lucide-react";
import { INDONESIA_REGIONS, findClosestBMKGRegion, BMKGRegionInfo } from "@/lib/bmkg";

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (locationName: string, adm4Code: string, preciseCoords?: { lat: number; lng: number; accuracy?: number }) => void;
}

export function LocationSelectorModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}: LocationSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsDetected, setGpsDetected] = useState<{
    region: BMKGRegionInfo;
    distanceKm: number;
    coords: { lat: number; lon: number };
  } | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("Semua");

  if (!isOpen) return null;

  // Filter regions based on search query and group
  const filteredRegions = INDONESIA_REGIONS.filter((region) => {
    const matchesSearch =
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.adm4.includes(searchQuery.trim());
    
    if (selectedGroup === "Semua") return matchesSearch;
    return matchesSearch && region.group === selectedGroup;
  });

  // Handle GPS Locate
  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung deteksi lokasi (Geolocation).");
      return;
    }

    setIsLocatingGPS(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const result = findClosestBMKGRegion(latitude, longitude);

        setGpsDetected({
          region: result.region,
          distanceKm: result.distanceKm,
          coords: { lat: latitude, lon: longitude },
        });
        setIsLocatingGPS(false);

        // Otomatis terapkan stasiun BMKG terdekat dan kirim koordinat GPS presisi
        onSelectLocation(result.region.name, result.region.adm4, { 
          lat: latitude, 
          lng: longitude, 
          accuracy: Math.round(accuracy || 15) 
        });
        setTimeout(() => {
          onClose();
        }, 500);
      },
      (error) => {
        setIsLocatingGPS(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError("Izin lokasi ditolak. Silakan aktifkan izin lokasi di browser Anda.");
        } else {
          setGpsError("Gagal mendeteksi lokasi GPS Anda. Coba pilih wilayah secara manual.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0, // Paksa perolehan koordinat GPS baru
      }
    );
  };

  // Handle Custom ADM4 submit
  const isCustomAdm4 = /^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(searchQuery.trim());

  const handleCustomAdm4Submit = () => {
    if (isCustomAdm4) {
      onSelectLocation(`Wilayah (${searchQuery.trim()})`, searchQuery.trim());
      onClose();
    }
  };

  const groups = [
    "Semua", 
    "Jabodetabek & Banten", 
    "Jawa Barat", 
    "Jawa Tengah & DIY", 
    "Jawa Timur", 
    "Sumatera", 
    "Kalimantan", 
    "Sulawesi", 
    "Bali & Nusa Tenggara", 
    "Maluku & Papua"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] max-w-lg w-full shadow-2xl border border-[#E6EBE8] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E6EBE8] flex items-center justify-between bg-gradient-to-r from-[#F8FAF9] to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17211D]">Pilih Lokasi & Cuaca</h2>
              <p className="text-xs text-[#68756E]">Hubungkan data live BMKG berdasarkan GPS atau wilayah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#929D96] hover:text-[#17211D] hover:bg-[#F1F4F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & GPS */}
        <div className="p-4 border-b border-[#F1F4F2] space-y-3">
          {/* GPS Locate Button */}
          <button
            onClick={handleGPSDetect}
            disabled={isLocatingGPS}
            className="w-full py-2.5 px-4 rounded-[14px] bg-[#176B4D] hover:bg-[#12583e] active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70 cursor-pointer"
          >
            {isLocatingGPS ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mendeteksi Koordinat GPS...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4" />
                <span>Gunakan Lokasi Saya Saat Ini (GPS)</span>
              </>
            )}
          </button>

          {/* GPS Feedback */}
          {gpsError && (
            <div className="p-2.5 rounded-[12px] bg-[#FDECEC] border border-[#F9C1C1] text-xs text-[#D64545] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{gpsError}</span>
            </div>
          )}

          {gpsDetected && (
            <div 
              onClick={() => {
                onSelectLocation(gpsDetected.region.name, gpsDetected.region.adm4, {
                  lat: gpsDetected.coords.lat,
                  lng: gpsDetected.coords.lon,
                  accuracy: 15,
                });
                onClose();
              }}
              className="p-2.5 rounded-[12px] bg-[#E5F5EA] border border-[#C8E6C9] text-xs text-[#176B4D] flex items-center justify-between cursor-pointer hover:bg-[#d8efe0] transition-colors"
              title="Klik untuk menerapkan posisi GPS presisi ini"
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#176B4D]" />
                <span>
                  Terdeteksi: <strong>{gpsDetected.region.name}</strong> (~{gpsDetected.distanceKm} km)
                </span>
              </div>
              <span className="text-[10px] bg-white text-[#176B4D] border border-[#C8E6C9] px-2 py-0.5 rounded-full font-bold">
                Terapkan Presisi ✓
              </span>
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#929D96] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ketik nama kota, kabupaten, atau kode ADM4..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAF9] rounded-[12px] text-xs md:text-sm text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#929D96] hover:text-[#17211D]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Custom ADM4 Quick Prompt */}
          {isCustomAdm4 && (
            <div className="p-2.5 rounded-[12px] bg-[#EAF4FB] border border-[#C5E1F6] flex items-center justify-between">
              <div className="text-xs text-[#176B4D]">
                <span>Kode Wilayah BMKG Terdeteksi: <strong>{searchQuery.trim()}</strong></span>
              </div>
              <button
                onClick={handleCustomAdm4Submit}
                className="px-2.5 py-1 bg-[#176B4D] text-white rounded-[8px] text-xs font-bold hover:bg-[#12583e]"
              >
                Gunakan Kode Ini
              </button>
            </div>
          )}

          {/* Group Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedGroup === grp
                    ? "bg-[#17211D] text-white"
                    : "bg-[#F1F4F2] text-[#68756E] hover:bg-[#E6EBE8]"
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Region List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#F1F4F2]">
          {filteredRegions.length === 0 ? (
            <div className="py-8 text-center text-[#929D96] space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-[#CDD7D1]" />
              <p className="text-xs">Wilayah &quot;{searchQuery}&quot; tidak ditemukan di daftar cepat.</p>
              <p className="text-[11px] text-[#68756E]">
                Anda juga dapat memasukkan kode Kemendagri ADM4 langsung (contoh: <code>31.71.03.1001</code>).
              </p>
            </div>
          ) : (
            filteredRegions.map((region) => {
              const isSelected =
                currentLocation === region.name ||
                currentLocation.includes(region.name);

              return (
                <button
                  key={region.adm4}
                  onClick={() => {
                    onSelectLocation(region.name, region.adm4);
                    onClose();
                  }}
                  className={`w-full py-2.5 px-3 rounded-[12px] flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? "bg-[#E5F5EA] text-[#176B4D]"
                      : "hover:bg-[#F8FAF9] text-[#17211D]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isSelected
                          ? "bg-[#176B4D] text-white"
                          : "bg-[#F1F4F2] text-[#68756E]"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                        <span>{region.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/70 border border-[#CDD7D1] text-[#68756E] font-normal">
                          {region.province}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#929D96] block font-mono">
                        ADM4: {region.adm4}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#176B4D]">
                        <Check className="w-4 h-4" />
                        <span>Aktif</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F8FAF9] border-t border-[#E6EBE8] flex items-center justify-between text-[11px] text-[#929D96]">
          <span>Data BMKG Open Data Terbuka</span>
          <span>Resmi Kemendagri Tingkat IV</span>
        </div>
      </div>
    </div>
  );
}
