"use client";

import React, { useState } from "react";
import { DownloadCloud, CheckCircle2, X, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { EvacuationPoint } from "@/types";
import { downloadRegionalMap, removeRegionalMap } from "@/lib/offline/peta";

interface OfflineMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDownloaded: boolean;
  onDownloadComplete: () => void;
  onRemoveDownload: () => void;
  points?: EvacuationPoint[];
  regionName?: string;
}

export function OfflineMapModal({
  isOpen,
  onClose,
  isDownloaded,
  onDownloadComplete,
  onRemoveDownload,
  regionName = "Kota Bogor",
}: OfflineMapModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("Menyiapkan unduhan peta offline...");
  const [isRemoving, setIsRemoving] = useState(false);

  if (!isOpen) return null;

  const handleStartDownload = async () => {
    setDownloading(true);
    setProgress(5);
    setStepText("Menghubungkan ke repositori peta wilayah...");

    try {
      await downloadRegionalMap(regionName, (percent, text) => {
        setProgress(percent);
        if (text) setStepText(text);
      });
      setDownloading(false);
      onDownloadComplete();
    } catch (err) {
      console.error("Gagal mengunduh peta offline:", err);
      setDownloading(false);
      alert("Terjadi kendala saat mengunduh data peta offline. Pastikan koneksi internet stabil.");
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeRegionalMap();
      setIsRemoving(false);
      onRemoveDownload();
      onClose();
    } catch (err) {
      console.error("Gagal menghapus peta offline:", err);
      setIsRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-[#CDD7D1]">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center">
              <DownloadCloud className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#17211D]">
              Kelola Peta Offline (PMTiles & DB)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#929D96] hover:text-[#17211D] p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="bg-[#F8FAF9] p-3 rounded-[12px] border border-[#E6EBE8] text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#17211D]">Wilayah Peta:</span>
              <span className="text-[#176B4D] font-bold">{regionName}</span>
            </div>
            <div className="flex justify-between items-center text-[#68756E]">
              <span>Format Penyimpanan:</span>
              <span>PMTiles Vector + IndexedDB</span>
            </div>
            <div className="flex justify-between items-center text-[#68756E]">
              <span>Perkiraan Ukuran:</span>
              <span>~42.4 MB (Tersimpan Lokal)</span>
            </div>
          </div>

          {downloading && (
            <div className="space-y-2 py-2">
              <div className="flex justify-between text-xs font-semibold text-[#17211D]">
                <span>{stepText}</span>
                <span className="text-[#176B4D]">{progress}%</span>
              </div>
              <div className="w-full bg-[#F1F4F2] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#176B4D] h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-[#929D96] block">
                Menyimpan layer visual dan titik evakuasi ke memori perangkat...
              </span>
            </div>
          )}

          {isDownloaded && !downloading && (
            <div className="bg-[#E5F5EA] border border-[#CDD7D1] p-3 rounded-[12px] flex items-center gap-2.5 text-xs text-[#176B4D]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold block">Peta Siap Digunakan Tanpa Internet</span>
                <span className="text-[11px] text-[#104A35]">
                  Tersimpan di penyimpanan lokal HP Anda. Posisi GPS akan tetap bergerak mengikuti langkah Anda saat offline.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 text-[11px] text-[#68756E] bg-[#FEF8E7] p-2.5 rounded-[10px] border border-[#FCE39E]">
            <AlertCircle className="w-4 h-4 text-[#B58206] shrink-0 mt-0.5" />
            <span>
              Catatan: Saat offline, GPS tetap berfungsi via satelit. Data shelter dan titik evakuasi akan menggunakan paket unduhan terakhir.
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F1F4F2] flex items-center justify-end gap-2">
          {isDownloaded ? (
            <>
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="px-3 py-2 text-xs font-semibold text-[#D64545] hover:bg-[#FDECEC] rounded-[10px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isRemoving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Hapus Unduhan</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold bg-[#176B4D] hover:bg-[#104A35] text-white rounded-[10px] transition-colors"
              >
                Tutup
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                disabled={downloading}
                className="px-3 py-2 text-xs font-semibold text-[#68756E] hover:bg-[#F5F7F6] rounded-[10px]"
              >
                Batal
              </button>
              <button
                onClick={handleStartDownload}
                disabled={downloading}
                className="px-4 py-2 text-xs font-bold bg-[#176B4D] hover:bg-[#104A35] text-white rounded-[10px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <DownloadCloud className="w-4 h-4" />
                )}
                <span>{downloading ? "Mengunduh..." : "Unduh Peta Wilayah"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
