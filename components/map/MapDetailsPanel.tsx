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
  ShieldCheck,
  Wind,
  Thermometer,
  Clock 
} from "lucide-react";
import { EvacuationPoint } from "@/types";

interface MapDetailsPanelProps {
  selectedArea: string;
  riskLevel?: string;
  hujan24jMm?: number;
  mukaAirStatus?: string;
  weatherCondition?: string;
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  evacuationPoints: EvacuationPoint[];
  selectedPointId: string | null;
  onSelectPoint: (point: EvacuationPoint) => void;
  onStartRouteNavigation: () => void;
  onOpenOfflineDownload: () => void;
  isMapOfflineDownloaded: boolean;
}

export function MapDetailsPanel({
  selectedArea = "Kota Bogor",
  riskLevel = "aman",
  hujan24jMm = 0,
  mukaAirStatus,
  weatherCondition = "Cerah",
  temp = 24,
  humidity = 65,
  windSpeed = 4,
  evacuationPoints,
  selectedPointId,
  onSelectPoint,
  onStartRouteNavigation,
  onOpenOfflineDownload,
  isMapOfflineDownloaded,
}: MapDetailsPanelProps) {
  const currentSelected = evacuationPoints.find((p) => p.id === selectedPointId) || evacuationPoints[0];
  const normRisk = (riskLevel || "aman").toLowerCase();

  const getRiskPresentation = () => {
    switch (normRisk) {
      case "awas":
        return {
          title: "Bahaya Ekstrem",
          calloutBg: "bg-[#FEF2F2] border-[#F87171]",
          badgeClass: "text-[#DC2626] bg-white border-[#FCA5A5]",
          icon: <AlertTriangle className="w-3 h-3 text-[#DC2626]" />,
          desc: `PERINGATAN DARURAT di ${selectedArea}: Luapan air ekstrem terdeteksi. Segera ikuti jalur evakuasi resmi.`,
          rainText: `${hujan24jMm || 155} mm (Ekstrem)`,
          rainColor: "text-[#DC2626]",
          riverText: mukaAirStatus || "Kritis (Siaga 1)",
          riverColor: "text-[#DC2626]",
        };
      case "siaga":
        return {
          title: "Risiko Tinggi",
          calloutBg: "bg-[#FDECEC] border-[#F9C1C1]",
          badgeClass: "text-[#D64545] bg-white border-[#F9C1C1]",
          icon: <AlertTriangle className="w-3 h-3 text-[#D64545]" />,
          desc: `Wilayah ${selectedArea} memiliki potensi genangan banjir dan kenaikan debit air sungai.`,
          rainText: `${hujan24jMm || 120} mm (Tinggi)`,
          rainColor: "text-[#D64545]",
          riverText: mukaAirStatus || "Meningkat (Siaga 2)",
          riverColor: "text-[#E88B26]",
        };
      case "waspada":
        return {
          title: "Risiko Sedang",
          calloutBg: "bg-[#FEF9E7] border-[#FDE68A]",
          badgeClass: "text-[#D97706] bg-white border-[#FDE68A]",
          icon: <AlertTriangle className="w-3 h-3 text-[#D97706]" />,
          desc: `Potensi genangan di titik-titik cekungan wilayah ${selectedArea}. Tetap waspada terhadap perubahan cuaca.`,
          rainText: `${hujan24jMm || 50} mm (Sedang)`,
          rainColor: "text-[#D97706]",
          riverText: mukaAirStatus || "Waspada (Siaga 3)",
          riverColor: "text-[#D97706]",
        };
      case "aman":
      default:
        return {
          title: "Risiko Rendah",
          calloutBg: "bg-[#E5F5EA] border-[#C8E6C9]",
          badgeClass: "text-[#176B4D] bg-white border-[#C8E6C9]",
          icon: <ShieldCheck className="w-3 h-3 text-[#176B4D]" />,
          desc: `Wilayah ${selectedArea} dalam kondisi stabil dan kondusif. Pemantauan sensor menunjukkan debit air normal.`,
          rainText: `${hujan24jMm || 0} mm (Rendah / Normal)`,
          rainColor: "text-[#176B4D]",
          riverText: mukaAirStatus || "Normal (Aman)",
          riverColor: "text-[#176B4D]",
        };
    }
  };

  const riskPres = getRiskPresentation();

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-[#17211D] mb-3">Detail Wilayah</h3>

        {/* Dynamic Warning Callout Box */}
        <div className={`border rounded-[14px] p-3.5 mb-4 transition-all ${riskPres.calloutBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#17211D] truncate max-w-[150px]">{selectedArea}</span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${riskPres.badgeClass}`}>
              {riskPres.icon}
              {riskPres.title}
            </span>
          </div>
          <p className="text-[11px] text-[#68756E] mt-1.5 leading-relaxed">
            {riskPres.desc}
          </p>
        </div>

        {/* Faktor Risiko List */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#17211D]">Faktor Risiko & Cuaca BMKG</h4>
            <span className="text-[10px] text-[#176B4D] font-semibold bg-[#E5F5EA] px-2 py-0.2 rounded">Live BMKG</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Cuaca & Suhu BMKG */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F4F2]">
              <div className="flex items-center gap-2 text-[#68756E]">
                <Thermometer className="w-3.5 h-3.5 text-[#E88B26]" />
                <span>Cuaca & Suhu ({selectedArea})</span>
              </div>
              <span className="font-semibold text-[#17211D]">{temp}°C • {weatherCondition}</span>
            </div>

            {/* Curah Hujan 24 Jam */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F4F2]">
              <div className="flex items-center gap-2 text-[#68756E]">
                <Droplets className="w-3.5 h-3.5 text-[#3983B9]" />
                <span>Curah Hujan 24 Jam</span>
              </div>
              <span className={`font-semibold ${riskPres.rainColor}`}>{riskPres.rainText}</span>
            </div>

            {/* Kelembaban & Angin */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F4F2]">
              <div className="flex items-center gap-2 text-[#68756E]">
                <Wind className="w-3.5 h-3.5 text-[#68756E]" />
                <span>Kelembaban & Angin</span>
              </div>
              <span className="font-semibold text-[#17211D]">{humidity}% • {windSpeed} km/j</span>
            </div>

            {/* Ketinggian Air Sungai */}
            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F4F2]">
              <div className="flex items-center gap-2 text-[#68756E]">
                <Waves className="w-3.5 h-3.5 text-[#3983B9]" />
                <span>Ketinggian Air Sungai</span>
              </div>
              <span className={`font-semibold ${riskPres.riverColor}`}>{riskPres.riverText}</span>
            </div>

            {/* Kerentanan Wilayah */}
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-[#68756E]">
                <Building className="w-3.5 h-3.5 text-[#68756E]" />
                <span>Kerentanan Wilayah</span>
              </div>
              <span className="font-semibold text-[#17211D]">Permukiman Padat</span>
            </div>
          </div>
        </div>

        {/* Titik Evakuasi Terdekat List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#17211D]">Titik Evakuasi Terdekat ({selectedArea})</h4>
            <span className="text-[10px] text-[#929D96]">Terverifikasi BPBD</span>
          </div>

          <div className="space-y-2">
            {evacuationPoints.slice(0, 4).map((pt) => {
              const isSelected = pt.id === (selectedPointId || evacuationPoints[0]?.id);
              const distText = (pt as any).distance || `${pt.distanceKm ?? 1.5} km`;

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
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? "bg-[#176B4D] text-white"
                          : "bg-white border border-[#CDD7D1] text-[#176B4D]"
                      }`}
                    >
                      {pt.type === "Rumah Sakit" ? "H" : pt.type === "Masjid" ? "☪" : "⌂"}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#17211D] block truncate">
                        {pt.name}
                      </span>
                      <span className="text-[10px] text-[#68756E] block flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#176B4D] shrink-0" />
                        <span className="truncate">{distText} • Kapasitas: {pt.capacity || 500} orang</span>
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-[#176B4D] font-bold shrink-0">
                    {isSelected ? "Terpilih ✓" : "Pilih"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#F1F4F2] space-y-2">
        <button
          onClick={onStartRouteNavigation}
          className="w-full py-2.5 rounded-[12px] bg-[#176B4D] hover:bg-[#12583e] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <span>Lihat Rute Evakuasi ({currentSelected?.name || "Terdekat"})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenOfflineDownload}
          className={`w-full py-2 rounded-[12px] text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
            isMapOfflineDownloaded
              ? "bg-[#E5F5EA] text-[#176B4D] border-[#CDD7D1]"
              : "bg-[#F8FAF9] text-[#68756E] border-[#E6EBE8] hover:bg-[#F1F4F2]"
          }`}
        >
          {isMapOfflineDownloaded ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#176B4D]" />
              <span>Peta Offline Tersimpan ({selectedArea})</span>
            </>
          ) : (
            <>
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Simpan Peta Offline {selectedArea}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
