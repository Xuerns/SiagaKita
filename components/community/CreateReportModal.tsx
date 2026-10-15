import React, { useState, useEffect, useCallback } from "react";
import { X, Camera, MapPin, AlertCircle, CheckCircle2, UploadCloud, Crosshair, Loader2, RefreshCw } from "lucide-react";
import { CommunityReport } from "@/types";

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Partial<CommunityReport> & { lat?: number; lng?: number }) => Promise<boolean | void> | void;
  defaultLocationName?: string;
  initialCoords?: { lat: number; lng: number } | null;
  onDetectGPS?: (coords: { lat: number; lng: number; accuracy?: number }) => void;
}

export function CreateReportModal({
  isOpen,
  onClose,
  onSubmit,
  defaultLocationName,
  initialCoords,
  onDetectGPS,
}: CreateReportModalProps) {
  const [category, setCategory] = useState<CommunityReport["category"]>("Banjir");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState(defaultLocationName || "Kota Bandung");
  const [consent, setConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Precise Hardware GPS State
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(
    initialCoords || null
  );
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const detectGps = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsError("Browser tidak mendukung geolokasi GPS.");
      return;
    }
    setIsDetectingGps(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const coords = {
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
        };
        setGpsCoords(coords);
        if (onDetectGPS) onDetectGPS(coords);
      },
      (err) => {
        setIsDetectingGps(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError("Izin GPS ditolak di browser. Silakan aktifkan izin lokasi.");
        } else {
          setGpsError("Gagal mendeteksi sinyal GPS: " + err.message);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onDetectGPS]);

  useEffect(() => {
    if (isOpen) {
      if (initialCoords) {
        setGpsCoords(initialCoords);
      } else {
        detectGps();
      }
    }
  }, [isOpen, initialCoords, detectGps]);

  useEffect(() => {
    if (defaultLocationName) {
      setLocationName(defaultLocationName);
    }
  }, [defaultLocationName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;

    setIsSubmitted(true);
    try {
      await onSubmit({
        category,
        tipe: category,
        title: title || `Laporan ${category} di sekitar wilayah`,
        description,
        deskripsi: description,
        locationName,
        lat: gpsCoords?.lat,
        lng: gpsCoords?.lng,
        status: "Dalam Verifikasi", // Crucial rule: does not become immediately verified!
        confirmationsCount: 1,
        timeAgo: "Baru saja",
      });
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 800);
    } catch {
      setIsSubmitted(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] max-w-lg w-full p-6 shadow-2xl border border-[#CDD7D1]">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F2]">
          <h3 className="text-sm font-bold text-[#17211D]">
            Buat Laporan Kondisi Lapangan
          </h3>
          <button
            onClick={onClose}
            className="text-[#929D96] hover:text-[#17211D] p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#176B4D] mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-[#17211D]">
              Laporan Berhasil Terkirim!
            </h4>
            <p className="text-xs text-[#68756E] max-w-sm mx-auto">
              Laporan Anda sedang menunggu verifikasi oleh relawan lapangan dan BPBD. Terima kasih atas kepedulian Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#17211D] block mb-1.5">
                Jenis Kejadian / Kondisi
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F8FAF9] rounded-[10px] text-xs font-medium border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D]"
              >
                <option value="Banjir">Banjir / Genangan</option>
                <option value="Sungai Naik">Ketinggian Air Sungai Naik</option>
                <option value="Longsor">Longsor / Tebing Labil</option>
                <option value="Jalan Terputus">Akses Jalan Terputus</option>
                <option value="Butuh Bantuan">Warga Butuh Evakuasi Segera</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211D] block mb-1.5">
                Judul Laporan Singkat
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Genangan setinggi lutut di Jl. Raya Cemplang"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAF9] rounded-[10px] text-xs border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211D] block mb-1.5">
                Deskripsi Kondisi Lapangan
              </label>
              <textarea
                required
                rows={3}
                placeholder="Jelaskan kondisi secara objektif (ketinggian air, arus, jalur alternatif terdekat)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAF9] rounded-[10px] text-xs border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D]"
              />
            </div>

            {/* Photo upload mock */}
            <div>
              <label className="text-xs font-bold text-[#17211D] block mb-1.5">
                Foto Lapangan (Opsional)
              </label>
              <div className="border-2 border-dashed border-[#CDD7D1] rounded-[12px] p-3 text-center bg-[#F8FAF9] hover:bg-[#F1F8F3] transition-colors cursor-pointer">
                <UploadCloud className="w-6 h-6 text-[#176B4D] mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-[#176B4D] block">
                  Unggah Foto Situasi
                </span>
                <span className="text-[10px] text-[#929D96]">
                  PNG/JPG hingga 5MB • Disimpan via Supabase Storage
                </span>
              </div>
            </div>

            {/* GPS Precision Card */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#17211D]">
                  Titik Koordinat GPS Lapangan
                </label>
                <button
                  type="button"
                  onClick={detectGps}
                  disabled={isDetectingGps}
                  className="text-[11px] font-semibold text-[#176B4D] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isDetectingGps ? "animate-spin" : ""}`} />
                  <span>{isDetectingGps ? "Mendeteksi..." : "Kunci Ulang GPS"}</span>
                </button>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-[12px] border border-[#E6EBE8] space-y-1.5">
                {isDetectingGps ? (
                  <div className="flex items-center gap-2 text-xs text-[#2563EB]">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Mendeteksi sinyal GPS presisi perangkat Anda...</span>
                  </div>
                ) : gpsCoords ? (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Crosshair className="w-4 h-4 text-[#176B4D] mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-[#17211D] block">
                          GPS Presisi Terkunci
                        </span>
                        <span className="text-[11px] text-[#68756E] font-mono block">
                          {gpsCoords.lat.toFixed(5)}, {gpsCoords.lng.toFixed(5)}
                          {gpsCoords.accuracy ? ` (Akurasi ±${gpsCoords.accuracy}m)` : ""}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#176B4D] bg-[#E5F5EA] px-2 py-0.5 rounded-full shrink-0">
                      ✓ Akurat
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-[#D97706]">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold block">GPS Belum Terdeteksi</span>
                      <span className="text-[11px] text-[#68756E] block">
                        {gpsError || `Akan menggunakan koordinat default ${locationName}.`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={detectGps}
                      className="px-2 py-1 bg-white border border-[#CDD7D1] rounded text-[10px] font-bold text-[#17211D] hover:bg-[#F1F4F2]"
                    >
                      Aktifkan GPS
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Location selector */}
            <div>
              <label className="text-xs font-bold text-[#17211D] block mb-1.5">
                Wilayah / Nama Lokasi
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#F8FAF9] rounded-[10px] border border-[#E6EBE8] text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#176B4D]" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Nama kelurahan, jalan, atau kawasan..."
                  className="bg-transparent w-full text-xs text-[#17211D] focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-[#929D96] mt-1 block">
                Privasi: Sesuai UU PDP, koordinat presisi diburamkan ~100m di peta publik untuk keamanan warga.
              </span>
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-2 pt-2 text-xs text-[#68756E] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-[#176B4D] focus:ring-[#176B4D]"
              />
              <span>
                Saya menyatakan laporan ini dibuat dengan sebenar-benarnya sesuai fakta lapangan dan siap diverifikasi.
              </span>
            </label>

            <div className="pt-3 border-t border-[#F1F4F2] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-[#68756E] hover:bg-[#F5F7F6] rounded-[10px]"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!consent}
                className="px-4 py-2 text-xs font-bold bg-[#176B4D] hover:bg-[#104A35] text-white rounded-[10px] transition-colors disabled:opacity-50"
              >
                Kirim Laporan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
