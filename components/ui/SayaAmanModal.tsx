"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, X, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";

interface SayaAmanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoords?: { lat: number; lng: number } | null;
}

export function SayaAmanModal({ isOpen, onClose, userCoords }: SayaAmanModalProps) {
  const [status, setStatus] = useState<"aman_rumah" | "titik_evakuasi" | "butuh_bantuan">("aman_rumah");
  const [familyCount, setFamilyCount] = useState("4");
  const [note, setNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setIsSaved(false);
      // Ambil status sebelumnya jika ada dari API
      fetch("/api/status-aman")
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.my_status) {
            if (json.my_status.status === "butuh_bantuan") {
              setStatus("butuh_bantuan");
            } else if (json.my_status.catatan?.toLowerCase().includes("evakuasi")) {
              setStatus("titik_evakuasi");
            } else {
              setStatus("aman_rumah");
            }
            if (json.my_status.catatan) {
              setNote(json.my_status.catatan);
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    const apiStatus = status === "butuh_bantuan" ? "butuh_bantuan" : "aman";
    const statusNote =
      note ||
      (status === "aman_rumah"
        ? `Saya & keluarga aman di rumah (${familyCount} orang)`
        : status === "titik_evakuasi"
        ? `Telah berada di titik evakuasi aman (${familyCount} orang)`
        : `Membutuhkan bantuan evakuasi segera (${familyCount} orang)`);

    try {
      const res = await fetch("/api/status-aman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: apiStatus,
          catatan: statusNote,
          lat: userCoords?.lat ?? -6.234,
          lng: userCoords?.lng ?? 106.864,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal memperbarui status keselamatan.");
      }

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan status.");
    } finally {
      setIsSubmitting(false);
    }
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

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-[10px] bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {isSaved ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#176B4D] mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-[#17211D]">
              Status Keselamatan Berhasil Diperbarui!
            </h4>
            <p className="text-xs text-[#68756E]">
              Data Anda telah tersimpan di server dan kontak darurat Anda dapat memantau status terkini.
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
                className={`p-3 rounded-[12px] border flex items-center justify-between cursor-pointer transition-colors ${status === "aman_rumah"
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
                className={`p-3 rounded-[12px] border flex items-center justify-between cursor-pointer transition-colors ${status === "titik_evakuasi"
                    ? "bg-[#E5F5EA] border-[#176B4D]"
                    : "bg-[#F8FAF9] border-[#E6EBE8]"
                  }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#17211D] block">
                    Sudah di Titik Evakuasi Aman
                  </span>
                  <span className="text-[10px] text-[#68756E]">
                    Telah tiba di posko atau titik evakuasi terdekat
                  </span>
                </div>
                {status === "titik_evakuasi" && (
                  <CheckCircle2 className="w-4 h-4 text-[#176B4D]" />
                )}
              </label>

              <label
                onClick={() => setStatus("butuh_bantuan")}
                className={`p-3 rounded-[12px] border flex items-center justify-between cursor-pointer transition-colors ${
                  status === "butuh_bantuan"
                    ? "bg-[#FDE8E8] border-[#DC2626]"
                    : "bg-[#F8FAF9] border-[#E6EBE8]"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#DC2626] block">
                    Membutuhkan Bantuan Segera
                  </span>
                  <span className="text-[10px] text-[#68756E]">
                    Terjebak banjir atau butuh bantuan evakuasi tim medis/SAR
                  </span>
                </div>
                {status === "butuh_bantuan" && (
                  <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
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
                disabled={isSubmitting}
                className="px-3 py-2 text-xs font-semibold text-[#68756E] hover:bg-[#F5F7F6] rounded-[10px]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold bg-[#176B4D] hover:bg-[#104A35] text-white rounded-[10px] transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isSubmitting ? "Menyimpan..." : "Konfirmasi Status"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
