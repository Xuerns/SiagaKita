import React, { useState } from "react";
import { 
  Plus, 
  Minus, 
  Crosshair, 
  Layers, 
  MapPin, 
  Navigation2, 
  ShieldCheck, 
  Building2, 
  AlertTriangle,
  Info
} from "lucide-react";
import { EvacuationPoint, CommunityReport } from "@/types";

interface InteractiveRiskMapProps {
  evacuationPoints: EvacuationPoint[];
  communityReports: CommunityReport[];
  selectedPointId: string | null;
  onSelectPoint: (point: EvacuationPoint) => void;
  showRoute: boolean;
  activeLayer: "risiko" | "evakuasi" | "rute" | "laporan";
}

export function InteractiveRiskMap({
  evacuationPoints,
  communityReports,
  selectedPointId,
  onSelectPoint,
  showRoute,
  activeLayer,
}: InteractiveRiskMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredPoint, setHoveredPoint] = useState<EvacuationPoint | null>(null);

  // User coordinate in SVG space
  const userPos = { x: 380, y: 440 };

  // Evacuation points mapped to SVG coordinates
  const svgPoints = [
    { ...evacuationPoints[0], x: 340, y: 220 }, // SMPN 5 Bogor
    { ...evacuationPoints[1], x: 450, y: 150 }, // GOR Pajajaran
    { ...evacuationPoints[2], x: 500, y: 410 }, // Masjid Al-Ikhlas
    { ...evacuationPoints[3], x: 210, y: 310 }, // RSUD Kota Bogor
  ];

  const selectedPoint = svgPoints.find((p) => p.id === selectedPointId) || svgPoints[0];

  return (
    <div className="relative w-full h-[580px] bg-[#E9EFEA] rounded-[16px] overflow-hidden border border-[#CDD7D1] shadow-inner select-none">
      {/* SVG Map Canvas */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Risk Gradient concentric rings */}
          <radialGradient id="riskHeat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D64545" stopOpacity="0.75" />
            <stop offset="30%" stopColor="#E88B26" stopOpacity="0.65" />
            <stop offset="65%" stopColor="#E88B26" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#D9A514" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#25845F" stopOpacity="0.05" />
          </radialGradient>

          {/* Water pattern */}
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A2CDED" />
            <stop offset="100%" stopColor="#7EBAE5" />
          </linearGradient>

          {/* Route glow filter */}
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#176B4D" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 1. Map Base - Ground Landmass & Neighborhoods */}
        <rect width="800" height="600" fill="#EDF3EE" />

        {/* Green Parks / Botanical Garden (Kebun Raya Bogor representation) */}
        <path
          d="M 330 260 C 360 250, 430 270, 440 330 C 450 380, 400 410, 360 400 C 320 390, 310 320, 330 260 Z"
          fill="#D6EAD8"
          stroke="#C2E0C5"
          strokeWidth="1.5"
        />
        <text x="365" y="335" fill="#25845F" fontSize="11" fontWeight="600" textAnchor="middle" opacity="0.8">
          Kebun Raya Bogor
        </text>

        {/* 2. Rivers (Sungai Ciliwung & Cisadane) */}
        <path
          d="M 120 0 C 140 100, 180 180, 200 260 C 220 340, 210 420, 230 520 C 240 560, 230 600, 230 600"
          fill="none"
          stroke="url(#riverGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 460 0 C 440 120, 410 210, 390 280 C 370 350, 390 430, 420 500 C 450 560, 470 600, 470 600"
          fill="none"
          stroke="url(#riverGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <text x="425" y="470" fill="#3983B9" fontSize="10" fontWeight="600" transform="rotate(45, 425, 470)">
          Sungai Ciliwung
        </text>

        {/* 3. Major Arterial Road Grid */}
        <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 0 160 L 800 140" />
          <path d="M 0 320 L 800 300" />
          <path d="M 0 460 L 800 480" />
          <path d="M 260 0 L 290 600" />
          <path d="M 520 0 L 490 600" />
          <path d="M 100 0 L 700 600" />
          <path d="M 700 0 L 100 600" />
        </g>
        <g stroke="#DCE4DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 0 160 L 800 140" />
          <path d="M 0 320 L 800 300" />
          <path d="M 0 460 L 800 480" />
          <path d="M 260 0 L 290 600" />
          <path d="M 520 0 L 490 600" />
          <path d="M 100 0 L 700 600" />
          <path d="M 700 0 L 100 600" />
        </g>

        {/* Secondary residential streets */}
        <g stroke="#E7EDE8" strokeWidth="2">
          <path d="M 180 80 L 320 80" />
          <path d="M 380 90 L 520 120" />
          <path d="M 210 200 L 330 230" />
          <path d="M 450 220 L 620 220" />
          <path d="M 240 380 L 340 390" />
          <path d="M 440 390 L 610 370" />
          <path d="M 330 500 L 480 520" />
        </g>

        {/* 4. Risk Overlays (Active when "risiko" or default) */}
        {(activeLayer === "risiko" || activeLayer === "rute" || activeLayer === "evakuasi") && (
          <g>
            {/* Concentric risk polygons representing flood/landslide danger zones */}
            <circle cx="430" cy="380" r="160" fill="url(#riskHeat)" />
            
            {/* Inner high-risk core */}
            <path
              d="M 380 340 C 420 310, 480 320, 500 360 C 510 400, 470 440, 420 440 C 380 430, 360 380, 380 340 Z"
              fill="#D64545"
              fillOpacity="0.45"
              stroke="#D64545"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Warning Region Label Box */}
            <g transform="translate(420, 380)">
              <rect x="-70" y="-14" width="140" height="28" rx="6" fill="#FFFFFF" fillOpacity="0.95" stroke="#CDD7D1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
              <text x="0" y="4" fill="#D64545" fontSize="11" fontWeight="700" textAnchor="middle">
                Kec. Bogor Selatan
              </text>
            </g>
          </g>
        )}

        {/* 5. Navigation Evacuation Route (Drawn when route is active) */}
        {(showRoute || activeLayer === "rute") && selectedPoint && (
          <g filter="url(#routeGlow)">
            {/* Background shadow path */}
            <path
              d={`M ${userPos.x} ${userPos.y} Q 360 330, 350 270 T ${selectedPoint.x} ${selectedPoint.y}`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Primary navigation blue/green line */}
            <path
              d={`M ${userPos.x} ${userPos.y} Q 360 330, 350 270 T ${selectedPoint.x} ${selectedPoint.y}`}
              fill="none"
              stroke="#2563EB"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 4"
              className="animate-pulse"
            />
          </g>
        )}

        {/* 6. Community Hazard Reports on Map */}
        {activeLayer === "laporan" && (
          <g>
            <circle cx="460" cy="360" r="14" fill="#D64545" fillOpacity="0.2" className="animate-ping" />
            <circle cx="460" cy="360" r="10" fill="#D64545" />
            <text x="460" y="364" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">!</text>

            <circle cx="410" cy="490" r="10" fill="#E88B26" />
            <text x="410" y="494" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">!</text>
          </g>
        )}

        {/* 7. Evacuation & Hospital Markers */}
        {svgPoints.map((pt) => {
          const isSelected = pt.id === selectedPointId;
          const isHospital = pt.type === "Rumah Sakit";

          return (
            <g
              key={pt.id}
              transform={`translate(${pt.x}, ${pt.y})`}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectPoint(pt)}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {isSelected && (
                <circle cx="0" cy="0" r="22" fill="#176B4D" fillOpacity="0.2" className="animate-ping" />
              )}
              
              {/* Pin bubble */}
              <circle
                cx="0"
                cy="0"
                r="16"
                fill={isHospital ? "#3983B9" : "#176B4D"}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
              />
              
              {/* Icon in Pin */}
              <text
                x="0"
                y="4.5"
                fill="#FFFFFF"
                fontSize={isHospital ? "12" : "10"}
                fontWeight="bold"
                textAnchor="middle"
              >
                {isHospital ? "H" : "⌂"}
              </text>

              {/* Pin Callout Badge */}
              <g transform="translate(0, -24)">
                <rect
                  x="-45"
                  y="-12"
                  width="90"
                  height="18"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#CDD7D1"
                  strokeWidth="1"
                  filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
                />
                <text x="0" y="0.5" fill="#17211D" fontSize="9" fontWeight="600" textAnchor="middle">
                  {pt.name}
                </text>
              </g>
            </g>
          );
        })}

        {/* 8. User Current Location Pin */}
        <g transform={`translate(${userPos.x}, ${userPos.y})`}>
          <circle cx="0" cy="0" r="18" fill="#3B82F6" fillOpacity="0.25" className="animate-ping" />
          <circle cx="0" cy="0" r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
          
          <g transform="translate(0, 18)">
            <rect x="-35" y="-9" width="70" height="15" rx="3" fill="#1E293B" fillOpacity="0.9" />
            <text x="0" y="2" fill="#FFFFFF" fontSize="8" fontWeight="600" textAnchor="middle">
              Lokasi Saya
            </text>
          </g>
        </g>
      </svg>

      {/* Map Legend (Bottom-Left as in reference image) */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-[14px] p-3 border border-[#E6EBE8] shadow-md z-10 text-xs">
        <div className="font-bold text-[#17211D] mb-1.5 text-[11px] flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#176B4D]" />
          <span>Legenda Peta</span>
        </div>

        <div className="text-[10px] text-[#68756E] mb-1 font-semibold">Tingkat Risiko:</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A514]" />
            <span>Rendah</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E88B26]" />
            <span>Sedang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D64545]" />
            <span>Tinggi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#991B1B]" />
            <span>Sangat Tinggi</span>
          </div>
        </div>

        <div className="border-t border-[#F1F4F2] pt-1.5 space-y-1 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#176B4D] text-white flex items-center justify-center text-[8px] font-bold">⌂</span>
            <span>Titik Evakuasi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#3983B9] text-white flex items-center justify-center text-[8px] font-bold">H</span>
            <span>Rumah Sakit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2563EB] ring-2 ring-white" />
            <span>Lokasi Saya</span>
          </div>
        </div>
      </div>

      {/* Floating Map Controls (Top-Right) */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2))}
          className="w-8 h-8 rounded-[8px] bg-white border border-[#CDD7D1] shadow-sm flex items-center justify-center text-[#17211D] hover:bg-[#F8FAF9] transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
          className="w-8 h-8 rounded-[8px] bg-white border border-[#CDD7D1] shadow-sm flex items-center justify-center text-[#17211D] hover:bg-[#F8FAF9] transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSelectPoint(svgPoints[0])}
          className="w-8 h-8 rounded-[8px] bg-white border border-[#CDD7D1] shadow-sm flex items-center justify-center text-[#176B4D] hover:bg-[#F8FAF9] transition-colors"
          title="Pusatkan ke Lokasi Saya"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom attribution notice */}
      <div className="absolute bottom-2 right-4 text-[9px] text-[#68756E] bg-white/80 px-2 py-0.5 rounded border border-[#E6EBE8]">
        MapLibre GL JS • © OpenStreetMap contributors • PMTiles Ready
      </div>
    </div>
  );
}
