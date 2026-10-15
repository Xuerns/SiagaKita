"use client";

import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

export interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirmDelete,
  isDeleting,
}: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl border border-[#CDD7D1]">
        <div className="flex items-center gap-3 text-[#D64545] mb-3">
          <div className="w-10 h-10 rounded-full bg-[#FDECEC] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#D64545]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#17211D]">
              Hapus Akun Permanen?
            </h3>
            <span className="text-[11px] text-[#68756E]">
              Hak Pemusnahan Data Pribadi (UU No. 27 Tahun 2022 / UU PDP)
            </span>
          </div>
        </div>

        <p className="text-xs text-[#68756E] leading-relaxed mb-4">
          Tindakan ini akan <strong>menghapus permanen</strong> akun Anda beserta seluruh riwayat laporan lapangan, data profil, preferensi evakuasi, dan kontak darurat dari database SiagaKita. Data yang dihapus tidak dapat dipulihkan kembali.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F4F2]">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#68756E] hover:bg-[#F8FAF9] rounded-[10px] transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirmDelete}
            className="px-4 py-2 text-xs font-bold text-white bg-[#D64545] hover:bg-[#B83838] rounded-[10px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Permanen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
