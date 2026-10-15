import React, { useState } from "react";
import { DownloadCloud, CheckCircle2, X, AlertCircle } from "lucide-react";
import { EvacuationPoint } from "@/types";
import { saveOfflineEvacuationPoints, clearOfflineEvacuationPoints } from "@/lib/offline/db";

interface OfflineMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDownloaded: boolean;
  onDownloadComplete: () => void;
  onRemoveDownload: () => void;
  points?: EvacuationPoint[];
}

export function OfflineMapModal({
  isOpen,
  onClose,
  isDownloaded,
  onDownloadComplete,
  onRemoveDownload,
  points,
}: OfflineMapModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartDownload = () => {
    setDownloading(true);
    setProgress(15);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          if (points && points.length > 0) {
            saveOfflineEvacuationPoints(points);
          }
          onDownloadComplete();
          return 100;
        }
        return prev + 25;
      });
    }, 400);
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
              Kelola Peta Offline (PMTiles)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#929D96] hover:text-[#17211D] p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="bg-[#F8FAF9] p-3 rounded-[12px] border border-[#E6EBE8] text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-[#17211D]">Wilayah Tersedia:</span>
              <span className="text-[#176B4D] font-bold">Kota Bogor (6 Kecamatan)</span>
            </div>
            <div className="flex justify-between items-center text-[#68756E]">
              <span>Format Peta:</span>
              <span>PMTiles Vector Tiles (MapLibre)</span>
            </div>
            <div className="flex justify-between items-center text-[#68756E]">
              <span>Perkiraan Ukuran:</span>
              <span>42.4 MB</span>
            </div>
          </div>

          {downloading && (
            <div className="space-y-2 py-2">
              <div className="flex justify-between text-xs font-semibold text-[#17211D]">
                <span>Mengunduh peta & rute evakuasi...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[#F1F4F2] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#176B4D] h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-[#929D96] block">
                Menyimpan layer vektor ke CacheStorage & IndexedDB (Dexie)
              </span>
            </div>
          )}

          {isDownloaded && !downloading && (
            <div className="bg-[#E5F5EA] border border-[#CDD7D1] p-3 rounded-[12px] flex items-center gap-2.5 text-xs text-[#176B4D]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold block">Peta Siap Digunakan Tanpa Internet</span>
                <span className="text-[11px] text-[#104A35]">
                  Tersimpan di perangkat Anda. Terakhir sinkronisasi: Hari ini 10:15 WIB.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 text-[11px] text-[#68756E] bg-[#FEF8E7] p-2.5 rounded-[10px] border border-[#FCE39E]">
            <AlertCircle className="w-4 h-4 text-[#B58206] shrink-0 mt-0.5" />
            <span>
              Catatan: Saat offline, kondisi rute dan titik evakuasi menggunakan data terakhir yang diunduh. Peringatan langsung memerlukan koneksi internet.
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F1F4F2] flex items-center justify-end gap-2">
          {isDownloaded ? (
            <>
              <button
                onClick={() => {
                  clearOfflineEvacuationPoints().catch(console.error);
                  onRemoveDownload();
                  onClose();
                }}
                className="px-3 py-2 text-xs font-semibold text-[#D64545] hover:bg-[#FDECEC] rounded-[10px] transition-colors"
              >
                Hapus Unduhan
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold bg-[#176B4D] hover:bg-[#104A35] text-white rounded-[10px] transition-colors"
              >
                Selesai
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
                <DownloadCloud className="w-4 h-4" />
                <span>Unduh Peta (42.4 MB)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
