import React from "react";
import { 
  AlertTriangle, 
  Droplets, 
  Waves, 
  Building, 
  MapPin, 
  ArrowRight, 
  DownloadCloud, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { EvacuationPoint } from "@/types";

interface MapDetailsPanelProps {
  selectedArea: string;
  evacuationPoints: EvacuationPoint[];
  selectedPointId: string | null;
  onSelectPoint: (point: EvacuationPoint) => void;
  onStartRouteNavigation: () => void;
  onOpenOfflineDownload: () => void;
  isMapOfflineDownloaded: boolean;
}

export function MapDetailsPanel({
  selectedArea = "Kec. Bogor Selatan",
  evacuationPoints,
  selectedPointId,
  onSelectPoint,
  onStartRouteNavigation,
  onOpenOfflineDownload,
  isMapOfflineDownloaded,
}: MapDetailsPanelProps) {
  const currentSelected = evacuationPoints.find((p) => p.id === selectedPointId) || evacuationPoints[0];

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-[#17211D] mb-3">Detail Wilayah</h3>

        {/* Warning Callout Box matching reference */}
        <div className="bg-[#FDECEC] border border-[#F9C1C1] rounded-[14px] p-3.5 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#17211D]">{selectedArea}</span>
            <span className="text-[11px] font-bold text-[#D64545] bg-white px-2.5 py-0.5 rounded-full border border-[#F9C1C1] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Risiko Tinggi
            </span>
          </div>
          <p className="text-[11px] text-[#68756E] mt-1.5 leading-relaxed">
            Wilayah ini memiliki potensi genangan banjir dan luapan Daerah Aliran Sungai (DAS) Ciliwung.
          </p>
        </div>

        {/* Faktor Risiko List */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-[#17211D] mb-2.5">Faktor Risiko</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F4F2]">
              <div className="flex items-center gap-2 text-[#68756E]">
                <Droplets className="w-3.5 h-3.5 text-[#3983B9]" />
                <span>Curah hujan 24 Jam</span>
              </div>
              <span className="font-semibold text-[#D64545]">120 mm (Tinggi)</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F4F2]">
              <div className="flex items-center gap-2 text-[#68756E]">
                <Waves className="w-3.5 h-3.5 text-[#3983B9]" />
                <span>Ketinggian air sungai</span>
              </div>
              <span className="font-semibold text-[#E88B26]">Meningkat (Siaga 2)</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-[#68756E]">
                <Building className="w-3.5 h-3.5 text-[#68756E]" />
                <span>Kerentanan wilayah</span>
              </div>
              <span className="font-semibold text-[#17211D]">Permukiman padat</span>
            </div>
          </div>
        </div>

        {/* Titik Evakuasi Terdekat List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#17211D]">Titik Evakuasi Terdekat</h4>
            <span className="text-[10px] text-[#929D96]">Terverifikasi BPBD</span>
          </div>

          <div className="space-y-2">
            {evacuationPoints.slice(0, 3).map((pt) => {
              const isSelected = pt.id === (selectedPointId || evacuationPoints[0].id);
              return (
                <div
                  key={pt.id}
                  onClick={() => onSelectPoint(pt)}
                  className={`p-2.5 rounded-[12px] border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#E5F5EA] border-[#176B4D]"
                      : "bg-[#F8FAF9] border-[#E6EBE8] hover:bg-[#F1F8F3]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-[#176B4D] text-white"
                          : "bg-white border border-[#CDD7D1] text-[#176B4D]"
                      }`}
                    >
                      ⌂
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#17211D] block">
                        {pt.name}
                      </span>
                      <span className="text-[10px] text-[#68756E]">
                        {pt.distanceKm} km · {pt.travelMinutes} menit jalan kaki
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 ${
                      isSelected ? "text-[#176B4D]" : "text-[#929D96]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons & Offline Status */}
      <div className="mt-5 pt-3 border-t border-[#F1F4F2] space-y-2.5">
        <button
          onClick={onStartRouteNavigation}
          className="w-full py-2.5 px-4 rounded-[12px] bg-[#176B4D] hover:bg-[#104A35] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <span>Lihat Rute Evakuasi ({currentSelected.name})</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Offline Map Status / Action */}
        <button
          onClick={onOpenOfflineDownload}
          className="w-full py-2 px-3 rounded-[10px] bg-[#F8FAF9] hover:bg-[#F1F4F2] border border-[#E6EBE8] text-[11px] font-medium text-[#68756E] flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-1.5">
            {isMapOfflineDownloaded ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#176B4D]" />
            ) : (
              <DownloadCloud className="w-3.5 h-3.5 text-[#3983B9]" />
            )}
            <span>
              {isMapOfflineDownloaded
                ? "Peta Offline Tersimpan (PMTiles 42 MB)"
                : "Unduh Peta Offline Wilayah Ini"}
            </span>
          </div>
          <span className="text-[10px] text-[#176B4D] font-semibold">
            {isMapOfflineDownloaded ? "Kelola" : "Unduh"}
          </span>
        </button>
      </div>
    </div>
  );
}
