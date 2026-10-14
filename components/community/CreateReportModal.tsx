import React, { useState } from "react";
import { X, Camera, MapPin, AlertCircle, CheckCircle2, UploadCloud } from "lucide-react";
import { CommunityReport } from "@/types";

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Partial<CommunityReport>) => void;
}

export function CreateReportModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateReportModalProps) {
  const [category, setCategory] = useState<CommunityReport["category"]>("Banjir");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("Kec. Bogor Selatan, Kota Bogor");
  const [consent, setConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;

    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit({
        category,
        title: title || `Laporan ${category} di sekitar wilayah`,
        description,
        locationName,
        status: "Dalam Verifikasi", // Crucial rule: does not become immediately verified!
        confirmationsCount: 1,
        timeAgo: "Baru saja",
        userName: "Adams Nugraha",
      });
      setIsSubmitted(false);
      onClose();
    }, 1000);
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

            {/* Location selector */}
            <div>
              <label className="text-xs font-bold text-[#17211D] block mb-1.5">
                Lokasi Kejadian
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#F8FAF9] rounded-[10px] border border-[#E6EBE8] text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#176B4D]" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="bg-transparent w-full text-xs text-[#17211D] focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-[#929D96] mt-1 block">
                Privasi: Titik koordinat presisi rumah Anda disamarkan untuk keamanan publik.
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
