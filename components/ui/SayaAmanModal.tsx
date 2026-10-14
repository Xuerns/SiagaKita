import React, { useState } from "react";
import { UserCheck, X, CheckCircle2, ShieldCheck, Share2 } from "lucide-react";

interface SayaAmanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SayaAmanModal({ isOpen, onClose }: SayaAmanModalProps) {
  const [status, setStatus] = useState("aman_rumah");
  const [familyCount, setFamilyCount] = useState("4");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-[#CDD7D1]">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#17211D]">
              Status Keselamatan "Saya Aman"
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#929D96] hover:text-[#17211D] p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSaved ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#176B4D] mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-[#17211D]">
              Status Aman Berhasil Diperbarui!
            </h4>
            <p className="text-xs text-[#68756E]">
              Keluarga dan kontak darurat Anda telah menerima notifikasi keselamatan Anda.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className="text-xs text-[#68756E] leading-relaxed">
              Beri tahu keluarga dan petugas posko bahwa Anda dan anggota keluarga saat ini dalam kondisi selamat.
            </p>

            <div className="space-y-2">
              <label
                onClick={() => setStatus("aman_rumah")}
                className={`p-3 rounded-[12px] border flex items-center justify-between cursor-pointer transition-colors ${
                  status === "aman_rumah"
                    ? "bg-[#E5F5EA] border-[#176B4D]"
                    : "bg-[#F8FAF9] border-[#E6EBE8]"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#17211D] block">
                    Saya & Keluarga Aman di Rumah
                  </span>
                  <span className="text-[10px] text-[#68756E]">
                    Kondisi lingkungan rumah terkendali dan tidak tergenang
                  </span>
                </div>
                {status === "aman_rumah" && (
                  <CheckCircle2 className="w-4 h-4 text-[#176B4D]" />
                )}
              </label>

              <label
                onClick={() => setStatus("titik_evakuasi")}
                className={`p-3 rounded-[12px] border flex items-center justify-between cursor-pointer transition-colors ${
                  status === "titik_evakuasi"
                    ? "bg-[#E5F5EA] border-[#176B4D]"
                    : "bg-[#F8FAF9] border-[#E6EBE8]"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#17211D] block">
                    Sudah di Titik Evakuasi Aman
                  </span>
                  <span className="text-[10px] text-[#68756E]">
                    Telah tiba di SMPN 5 Bogor atau posko terdekat
                  </span>
                </div>
                {status === "titik_evakuasi" && (
                  <CheckCircle2 className="w-4 h-4 text-[#176B4D]" />
                )}
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211D] block mb-1">
                Jumlah Anggota Keluarga Bersama Anda
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={familyCount}
                onChange={(e) => setFamilyCount(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAF9] rounded-[10px] text-xs font-bold border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D]"
              />
            </div>

            <div className="pt-3 border-t border-[#F1F4F2] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-[#68756E] hover:bg-[#F5F7F6] rounded-[10px]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 text-xs font-bold bg-[#176B4D] hover:bg-[#104A35] text-white rounded-[10px] transition-colors shadow-sm"
              >
                Konfirmasi Status Aman
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
