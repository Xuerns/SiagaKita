import React, { useState } from "react";
import { Plus, ThumbsUp, RefreshCw, AlertCircle } from "lucide-react";
import { CommunityReport } from "@/types";
import { VerificationBadge } from "../ui/Badge";

interface MobileCommunityViewProps {
  reports: CommunityReport[];
  onOpenCreateModal: () => void;
  onConfirmReport: (reportId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function MobileCommunityView({
  reports,
  onOpenCreateModal,
  onConfirmReport,
  onRefresh,
  isRefreshing = false,
}: MobileCommunityViewProps) {
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const filters = ["Semua", "Banjir", "Longsor", "Jalan Terputus"];

  const filtered = reports.filter(
    (r) => selectedFilter === "Semua" || (r.category || r.tipe || "").includes(selectedFilter)
  );

  return (
    <div className="p-4 space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-[#17211D]">Laporan Warga</h2>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="w-8 h-8 rounded-full bg-white border border-[#E6EBE8] text-[#176B4D] hover:bg-[#F8FAF9] active:scale-95 flex items-center justify-center shadow-xs disabled:opacity-60 transition-all cursor-pointer"
              title="Segarkan laporan"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          )}
          <button
            onClick={onOpenCreateModal}
            className="w-8 h-8 rounded-full bg-[#176B4D] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Buat Laporan Baru"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === f
                ? "bg-[#176B4D] text-white"
                : "bg-white text-[#68756E] border border-[#E6EBE8]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Report Cards List matching the reference image */}
      <div className="space-y-3">
        {filtered.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-[16px] border border-[#E6EBE8] p-3.5 shadow-sm space-y-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center text-xs font-bold shrink-0">
                  📍
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17211D]">
                    {rep.title}
                  </h4>
                  <span className="text-[10px] text-[#68756E] block">
                    {rep.locationName} • {rep.timeAgo}
                  </span>
                </div>
              </div>
              <VerificationBadge status={rep.status} />
            </div>

            <p className="text-[11px] text-[#68756E] leading-relaxed pl-10">
              {rep.description}
            </p>

            {/* Foto Lapangan Terlampir (Mobile) */}
            {rep.foto_urls && rep.foto_urls.length > 0 && (
              <div className="pl-10 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {rep.foto_urls.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-[8px] overflow-hidden border border-[#CDD7D1] w-16 h-16 shrink-0 bg-[#F8FAF9] shadow-2xs"
                  >
                    <img
                      src={photoUrl}
                      alt={`Foto laporan ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-[#F1F4F2] flex items-center justify-between text-[11px] pl-10">
              <span className="text-[#929D96]">Oleh: {rep.userName}</span>
              <button
                onClick={() => !rep.userConfirmed && onConfirmReport(rep.id)}
                disabled={rep.userConfirmed}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 transition-colors ${
                  rep.userConfirmed
                    ? "bg-[#E5F5EA] text-[#176B4D] border-[#CDD7D1] cursor-default opacity-95"
                    : "text-[#176B4D] bg-[#F8FAF9] border-[#E6EBE8] hover:bg-[#EFF5F1] cursor-pointer active:scale-95"
                }`}
                title={rep.userConfirmed ? "Sudah dikonfirmasi" : "Konfirmasi laporan ini"}
              >
                <ThumbsUp className={`w-3 h-3 ${rep.userConfirmed ? "fill-[#176B4D]" : ""}`} />
                <span>{rep.confirmationsCount} {rep.userConfirmed ? "Dikonfirmasi" : "Konfirmasi"}</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-10 text-center bg-white rounded-[16px] border border-[#E6EBE8] p-6 flex flex-col items-center">
            <AlertCircle className="w-7 h-7 text-[#929D96] mb-1.5" />
            <h4 className="text-xs font-bold text-[#17211D]">Belum Ada Laporan</h4>
            <p className="text-[11px] text-[#68756E] mt-1 max-w-xs">
              Tidak ada laporan aktif untuk filter ini di sekitar wilayah Anda.
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="mt-3 px-3.5 py-1.5 bg-[#F8FAF9] hover:bg-[#EFF3F0] text-[#176B4D] border border-[#CDD7D1] rounded-[8px] text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>{isRefreshing ? "Memuat..." : "Segarkan"}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
