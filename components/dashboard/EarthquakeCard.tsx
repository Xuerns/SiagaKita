"use client";

import React, { useState } from "react";
import { 
  Activity, 
  MapPin, 
  Clock, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  Maximize2,
  Compass,
  AlertTriangle
} from "lucide-react";
import { EarthquakeData } from "@/types";

interface EarthquakeCardProps {
  earthquake: EarthquakeData | null;
  isLoading?: boolean;
  onViewOnMap?: (lat: number, lng: number) => void;
  variant?: "compact" | "wide";
}

export function EarthquakeCard({
  earthquake,
  isLoading = false,
  onViewOnMap,
  variant = "compact",
}: EarthquakeCardProps) {
  const [showShakemapModal, setShowShakemapModal] = useState<boolean>(false);
  const [showProtocolModal, setShowProtocolModal] = useState<boolean>(false);

  if (isLoading || !earthquake) {
    return (
      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-4 w-16 bg-slate-200 rounded"></div>
        </div>
        <div className="h-14 bg-slate-100 rounded-[12px] mb-3"></div>
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
      </div>
    );
  }

  const mag = earthquake.magnitude;
  const isHighSeverity = mag >= 6.0 || earthquake.level === "Awas";
  const isMediumSeverity = mag >= 5.0 || earthquake.level === "Siaga";
  const hasTsunami = earthquake.potensi.toLowerCase().includes("berpotensi tsunami") && 
    !earthquake.potensi.toLowerCase().includes("tidak berpotensi");

  const badgeStyle = isHighSeverity
    ? "bg-[#FDECEC] text-[#D64545] border-[#F9C1C1]"
    : isMediumSeverity
    ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
    : "bg-[#E5F5EA] text-[#176B4D] border-[#CDD7D1]";

  const actionButtons = (
    <>
      {earthquake.shakemapUrl && (
        <button
          onClick={() => setShowShakemapModal(true)}
          className="text-xs font-semibold text-[#176B4D] bg-[#E5F5EA] hover:bg-[#D5EFE0] px-3 py-1.5 rounded-[10px] border border-[#CDD7D1] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Shakemap</span>
        </button>
      )}
      <button
        onClick={() => setShowProtocolModal(true)}
        className="text-xs font-semibold text-[#17211D] bg-white hover:bg-[#F8FAF9] px-3 py-1.5 rounded-[10px] border border-[#CDD7D1] flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-[#176B4D]" />
        <span>Protokol Siaga</span>
      </button>
      {onViewOnMap && (
        <button
          onClick={() => onViewOnMap(earthquake.coordinates.lat, earthquake.coordinates.lng)}
          className="text-xs font-semibold text-white bg-[#176B4D] hover:bg-[#12533B] px-3 py-1.5 rounded-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Lihat di Peta</span>
        </button>
      )}
    </>
  );

  return (
    <>
      {variant === "wide" ? (
        <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:border-[#176B4D]/30">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Magnitude block */}
            <div className={`shrink-0 flex items-center gap-4 px-5 py-3 rounded-[14px] border ${badgeStyle}`}>
              <div>
                <span className="text-[11px] font-medium opacity-80 block">Kekuatan Gempa</span>
                <span className="text-4xl font-black tracking-tight leading-none">M {mag.toFixed(1)}</span>
              </div>
              <div className="h-10 w-px bg-current opacity-20" />
              <div>
                <span className="text-[11px] font-medium opacity-80 block">Kedalaman</span>
                <span className="text-sm font-bold">{earthquake.kedalaman}</span>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-medium text-[#68756E]">Monitoring Seismik Resmi · Gempa Bumi Terkini BMKG</span>
                <span className="inline-flex items-center gap-1 bg-[#F8FAF9] px-2 py-0.5 rounded-full border border-[#E6EBE8] text-[10px] font-semibold text-[#176B4D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live TEWS
                </span>
                {hasTsunami ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#D64545] bg-[#FDECEC] border border-[#F9C1C1] px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> POTENSI TSUNAMI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#176B4D] bg-[#E5F5EA] border border-[#CDD7D1] px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Tidak Berpotensi Tsunami
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-[#17211D] leading-snug">{earthquake.wilayah}</h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-[#68756E]">
                {typeof earthquake.jarakKm === "number" && (
                  <span className="flex items-center gap-1 font-semibold text-[#176B4D]">
                    <MapPin className="w-3 h-3" /> {earthquake.jarakKm.toLocaleString("id-ID")} km dari lokasimu
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {earthquake.tanggal} · {earthquake.jam}
                </span>
                {earthquake.dirasakan && (
                  <span className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-[#176B4D]" /> Dirasakan: {earthquake.dirasakan}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 lg:justify-end shrink-0">
              {actionButtons}
            </div>
          </div>
        </div>
      ) : (
      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all hover:border-[#176B4D]/30 relative overflow-hidden group">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${badgeStyle}`}>
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#68756E] block leading-none">
                  Monitoring Seismik Resmi
                </span>
                <span className="text-xs font-semibold text-[#17211D]">
                  Gempa Bumi Terkini BMKG
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F8FAF9] px-2 py-0.5 rounded-full border border-[#E6EBE8]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] font-semibold text-[#176B4D]">Live TEWS</span>
            </div>
          </div>

          {/* Magnitude & Main Stats Banner */}
          <div className={`p-3 rounded-[12px] border ${badgeStyle} flex items-center justify-between mb-3`}>
            <div>
              <span className="text-[11px] font-medium opacity-80 block">Kekuatan Gempa</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight">M {mag.toFixed(1)}</span>
                <span className="text-xs font-medium opacity-90">Kedalaman {earthquake.kedalaman}</span>
              </div>
            </div>

            {/* Tsunami Status Pill */}
            <div className="text-right">
              {hasTsunami ? (
                <div className="flex items-center gap-1 text-[#D64545] font-bold text-xs bg-white/80 px-2.5 py-1 rounded-lg border border-[#D64545]">
                  <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                  <span>POTENSI TSUNAMI</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[#176B4D] font-medium text-[11px] bg-white/80 px-2 py-0.5 rounded-lg border border-[#CDD7D1]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Tidak Berpotensi Tsunami</span>
                </div>
              )}
            </div>
          </div>

          {/* Epicenter location & Distance */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-[#17211D] leading-snug line-clamp-2">
              {earthquake.wilayah}
            </h4>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#68756E]">
              {typeof earthquake.jarakKm === "number" && (
                <div className="flex items-center gap-1 font-semibold text-[#176B4D] bg-[#F1F8F3] px-1.5 py-0.5 rounded">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{earthquake.jarakKm} km dari lokasimu</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-[#929D96]">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{earthquake.tanggal} · {earthquake.jam}</span>
              </div>
            </div>

            {earthquake.dirasakan && (
              <div className="text-[11px] text-[#68756E] bg-[#F8FAF9] p-2 rounded-lg border border-[#EBEBEB] mt-1.5 flex items-start gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#176B4D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#17211D]">Dirasakan: </span>
                  <span>{earthquake.dirasakan}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-3 pt-2.5 border-t border-[#F1F4F2] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {earthquake.shakemapUrl && (
              <button
                onClick={() => setShowShakemapModal(true)}
                className="text-[11px] font-semibold text-[#176B4D] bg-[#E5F5EA] hover:bg-[#D5EFE0] px-2.5 py-1 rounded-[8px] border border-[#CDD7D1] flex items-center gap-1 transition-colors"
                title="Lihat Peta Guncangan Shakemap BMKG"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Shakemap</span>
              </button>
            )}

            <button
              onClick={() => setShowProtocolModal(true)}
              className="text-[11px] font-medium text-[#68756E] hover:text-[#17211D] px-2 py-1 rounded-[8px] hover:bg-[#F8FAF9] transition-colors"
            >
              Protokol Siaga
            </button>
          </div>

          {onViewOnMap && (
            <button
              onClick={() => onViewOnMap(earthquake.coordinates.lat, earthquake.coordinates.lng)}
              className="text-xs font-semibold text-[#176B4D] hover:underline flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Titik Episentrum</span>
            </button>
          )}
        </div>
      </div>
      )}

      {/* Shakemap Modal */}
      {showShakemapModal && earthquake.shakemapUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#17211D]">Peta Guncangan BMKG (Shakemap)</h3>
                <p className="text-[11px] text-[#68756E]">
                  Intensitas guncangan gempa resmi M {earthquake.magnitude.toFixed(1)}
                </p>
              </div>
              <button
                onClick={() => setShowShakemapModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-center min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={earthquake.shakemapUrl}
                alt="Shakemap BMKG"
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>

            <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-[#68756E]">
              <span>Sumber: BMKG Indonesia</span>
              <a
                href={earthquake.shakemapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#176B4D] font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Buka Gambar Asli</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Modal */}
      {showProtocolModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            <div className="p-4 bg-[#0F3822] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#5AC48A]" />
                <div>
                  <h3 className="text-sm font-bold">Protokol Keselamatan Gempa Bumi</h3>
                  <p className="text-[10px] text-white/80">Panduan Darurat Standar BNPB & BMKG</p>
                </div>
              </div>
              <button
                onClick={() => setShowProtocolModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-xs text-[#17211D]">
              <div className="p-3 bg-[#E6F4EC] rounded-xl border border-[#CDD7D1]">
                <h4 className="font-bold text-[#176B4D] mb-1 flex items-center gap-1">
                  <span>1. Lindungi Diri (Drop, Cover, Hold On)</span>
                </h4>
                <p className="text-[#68756E]">
                  Merunduk ke lantai, lindungi kepala dan leher dengan lengan atau berlindung di bawah meja yang kokoh hingga guncangan mereda.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#E6EBE8]">
                <h4 className="font-bold text-[#17211D] mb-1">2. Jauhi Kaca dan Benda Menggantung</h4>
                <p className="text-[#68756E]">
                  Jauhi jendela kaca, cermin, lemari tinggi, dan lampu gantung yang rawan roboh atau pecah.
                </p>
              </div>

              <div className="p-3 bg-[#FEF3C7] rounded-xl border border-[#FDE68A]">
                <h4 className="font-bold text-[#D97706] mb-1">3. Jika Berada di Pesisir Pantai</h4>
                <p className="text-[#68756E]">
                  Bila guncangan gempa berlangsung lama atau sangat kuat, segera lari ke tempat tinggi (bukit atau bangunan kokoh bertingkat) tanpa menunggu sirine tsunami.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAF9] rounded-xl border border-[#E6EBE8]">
                <h4 className="font-bold text-[#17211D] mb-1">4. Pasca Gempa</h4>
                <p className="text-[#68756E]">
                  Periksa kebocoran gas dan instalasi listrik sebelum menyalakan api. Gunakan tangga darurat, jangan gunakan lift.
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowProtocolModal(false)}
                className="px-4 py-2 bg-[#176B4D] text-white text-xs font-semibold rounded-lg hover:bg-[#0F3822] transition-colors"
              >
                Mengerti & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
