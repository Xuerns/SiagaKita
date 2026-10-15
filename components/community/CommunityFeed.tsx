import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Filter,
  RefreshCw 
} from "lucide-react";
import { CommunityReport } from "@/types";
import { VerificationBadge } from "../ui/Badge";
import { NavTab } from "../layout/DesktopSidebar";

interface CommunityFeedProps {
  reports: CommunityReport[];
  onOpenCreateModal: () => void;
  onNavigateToMap: (report: CommunityReport) => void;
  onConfirmReport: (reportId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function CommunityFeed({
  reports,
  onOpenCreateModal,
  onNavigateToMap,
  onConfirmReport,
  onRefresh,
  isRefreshing = false,
}: CommunityFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "Semua",
    "Banjir",
    "Sungai Naik",
    "Longsor",
    "Jalan Terputus",
    "Butuh Bantuan",
  ];

  const filteredReports = reports.filter((rep) => {
    const matchCategory =
      selectedCategory === "Semua" || rep.category === selectedCategory;
    const title = rep.title || rep.tipe || "";
    const desc = rep.description || rep.deskripsi || "";
    const loc = rep.locationName || "";
    const q = searchQuery.toLowerCase();
    const matchSearch =
      title.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q) ||
      loc.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[16px] border border-[#E6EBE8] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#929D96] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari laporan kondisi jalan, banjir, longsor..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAF9] rounded-[10px] text-xs md:text-sm text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="py-2.5 px-3.5 bg-white hover:bg-[#F8FAF9] active:bg-[#EFF3F0] text-[#176B4D] border border-[#CDD7D1] text-xs font-bold rounded-[10px] flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              title="Segarkan daftar laporan warga dari database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{isRefreshing ? "Memuat..." : "Refresh"}</span>
            </button>
          )}

          <button
            onClick={onOpenCreateModal}
            className="py-2.5 px-4 bg-[#176B4D] hover:bg-[#104A35] text-white text-xs font-bold rounded-[10px] flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Laporan Kondisi</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-[#176B4D] text-white shadow-sm"
                : "bg-white text-[#68756E] border border-[#E6EBE8] hover:bg-[#F8FAF9]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reports Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#CDD7D1] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#176B4D] bg-[#E5F5EA] px-2.5 py-0.5 rounded-md">
                  {report.category}
                </span>
                <VerificationBadge status={report.status} />
              </div>

              <h4 className="text-sm font-bold text-[#17211D] leading-snug">
                {report.title}
              </h4>

              <p className="text-xs text-[#68756E] mt-1.5 leading-relaxed">
                {report.description}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-[#929D96] mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#176B4D]" />
                  {report.locationName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {report.timeAgo}
                </span>
                <span>Oleh: {report.userName}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F4F2] flex items-center justify-between">
              <button
                onClick={() => onNavigateToMap(report)}
                className="text-xs font-semibold text-[#176B4D] hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat di Peta</span>
              </button>

              <button
                onClick={() => onConfirmReport(report.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[8px] transition-colors ${
                  report.userConfirmed
                    ? "bg-[#E5F5EA] text-[#176B4D] border border-[#CDD7D1]"
                    : "bg-[#F8FAF9] hover:bg-[#F1F4F2] text-[#68756E] border border-[#E6EBE8]"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>
                  {report.userConfirmed ? "Dikonfirmasi" : "Konfirmasi"} (
                  {report.confirmationsCount})
                </span>
              </button>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-[16px] border border-[#E6EBE8] p-8 flex flex-col items-center">
            <AlertCircle className="w-8 h-8 text-[#929D96] mb-2" />
            <h4 className="text-sm font-bold text-[#17211D]">Belum Ada Laporan</h4>
            <p className="text-xs text-[#68756E] mt-1 max-w-sm">
              Tidak ada laporan aktif pada kategori ini di wilayah Anda saat ini.
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="mt-4 px-4 py-2 bg-[#F8FAF9] hover:bg-[#EFF3F0] text-[#176B4D] border border-[#CDD7D1] rounded-[10px] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>{isRefreshing ? "Memeriksa data..." : "Segarkan Data"}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
