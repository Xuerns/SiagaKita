import React from "react";
import { ArrowLeft, Layers, Crosshair, MapPin, Navigation, Compass, CheckCircle2 } from "lucide-react";
import { EvacuationPoint } from "@/types";

interface MobileRuteViewProps {
  point: EvacuationPoint;
  onBack: () => void;
}

export function MobileRuteView({ point, onBack }: MobileRuteViewProps) {
  return (
    <div className="relative h-screen bg-[#E5EAE6] flex flex-col justify-between overflow-hidden select-none">
      {/* Top Floating Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-[#CDD7D1] flex items-center justify-center text-[#17211D]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-[#CDD7D1] text-xs font-bold text-[#17211D]">
          Rute Evakuasi
        </div>

        <button className="w-10 h-10 rounded-full bg-white shadow-md border border-[#CDD7D1] flex items-center justify-center text-[#17211D]">
          <Layers className="w-5 h-5 text-[#68756E]" />
        </button>
      </div>

      {/* Map Graphic Canvas */}
      <div className="w-full h-full relative">
        <svg className="w-full h-full" viewBox="0 0 390 600" preserveAspectRatio="xMidYMid slice">
          <rect width="390" height="600" fill="#E8EFEA" />

          {/* Streets */}
          <path d="M 60 0 L 100 600" stroke="#FFFFFF" strokeWidth="12" />
          <path d="M 60 0 L 100 600" stroke="#D1DDD4" strokeWidth="4" />

          <path d="M 0 250 L 390 280" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M 0 250 L 390 280" stroke="#D1DDD4" strokeWidth="4" />

          <path d="M 0 450 L 390 420" stroke="#FFFFFF" strokeWidth="8" />

          {/* Evacuation Route Line */}
          <path
            d="M 180 430 L 180 340 L 220 260 L 220 180"
            fill="none"
            stroke="#2563EB"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />

          {/* Start Point: User Location */}
          <g transform="translate(180, 430)">
            <circle cx="0" cy="0" r="16" fill="#3B82F6" fillOpacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="8" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
          </g>

          {/* End Point: Evacuation Center */}
          <g transform="translate(220, 180)">
            <circle cx="0" cy="0" r="18" fill="#176B4D" fillOpacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="14" fill="#176B4D" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="0" y="4.5" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
              ⌂
            </text>
          </g>
        </svg>

        {/* Floating crosshair button */}
        <button className="absolute bottom-48 right-4 w-10 h-10 rounded-full bg-white shadow-md border border-[#CDD7D1] flex items-center justify-center text-[#176B4D] z-10">
          <Crosshair className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Sheet Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-5 shadow-2xl border-t border-[#CDD7D1] z-30 space-y-4">
        <div className="w-10 h-1 bg-[#CDD7D1] rounded-full mx-auto" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#E5F5EA] text-[#176B4D] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#17211D] block">
                {point.name}
              </span>
              <span className="text-xs text-[#68756E]">
                {point.distanceKm} km · {point.travelMinutes} menit jalan kaki
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert("Navigasi Offline diaktifkan. Kompas & peta offline siap memandu Anda.")}
          className="w-full py-3.5 px-4 rounded-[14px] bg-[#176B4D] hover:bg-[#104A35] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4 fill-white" />
          <span>Mulai Navigasi Offline</span>
        </button>

        <p className="text-[11px] text-center text-[#929D96]">
          Peta dan rute ini dapat diakses tanpa internet setelah diunduh ke memori ponsel.
        </p>
      </div>
    </div>
  );
}
