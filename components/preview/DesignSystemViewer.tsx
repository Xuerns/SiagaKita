import React from "react";
import { 
  Palette, 
  Type, 
  Layers, 
  Cpu
} from "lucide-react";
import { RiskBadge, SourceBadge, VerificationBadge } from "../ui/Badge";

export function DesignSystemViewer() {
  const brandColors = [
    { name: "Primary Green", hex: "#176B4D", role: "Primary branding, primary buttons, active items" },
    { name: "Deep Green", hex: "#104A35", role: "Hero cards, hover states, strong contrast" },
    { name: "Emerald", hex: "#25845F", role: "Safe status, accent icons, success tokens" },
    { name: "Light Green", hex: "#E5F5EA", role: "Subtle active backgrounds, safe badges" },
    { name: "Pale Green", hex: "#F1F8F3", role: "Navigation active highlight, illustrated cards" },
  ];

  const surfaceColors = [
    { name: "Main Background", hex: "#F5F7F6", role: "App scaffold canvas background" },
    { name: "Card Background", hex: "#FFFFFF", role: "Cards, modals, popovers" },
    { name: "Subtle Surface", hex: "#F8FAF9", role: "Input fields, secondary containers" },
    { name: "Default Border", hex: "#E6EBE8", role: "Card borders, dividers" },
    { name: "Strong Border", hex: "#CDD7D1", role: "Focused borders, map frames" },
  ];

  const riskColors = [
    { level: "Aman", hex: "#25845F", desc: "Kondisi normal, tidak ada ancaman aktif" },
    { level: "Waspada", hex: "#D9A514", desc: "Potensi ancaman, pantau perkembangan cuaca" },
    { level: "Siaga", hex: "#E88B26", desc: "Ancaman nyata mendekat, siapkan tas siaga" },
    { level: "Awas", hex: "#D64545", desc: "Bahaya ekstrem, evakuasi segera ke titik aman" },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Intro Header */}
      <div className="bg-white rounded-[20px] p-6 border border-[#E6EBE8] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-[12px] bg-[#176B4D] text-white flex items-center justify-center">
            <Palette className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#17211D]">
              SiagaKita Design System & Tokens Specification
            </h2>
            <p className="text-xs text-[#68756E]">
              Figma Page 01 — Design System • Aligned with Next.js, Tailwind CSS & shadcn/ui
            </p>
          </div>
        </div>
      </div>

      {/* 1. Color Palette Tokens */}
      <div className="bg-white rounded-[20px] p-6 border border-[#E6EBE8] shadow-sm space-y-6">
        <h3 className="text-sm font-extrabold text-[#17211D] flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#176B4D]" />
          <span>Design Tokens: Color Palette</span>
        </h3>

        {/* Brand */}
        <div>
          <h4 className="text-xs font-bold text-[#68756E] uppercase tracking-wider mb-3">
            Brand Palette
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {brandColors.map((c) => (
              <div key={c.hex} className="p-3 rounded-[12px] border border-[#E6EBE8] bg-[#F8FAF9]">
                <div
                  className="w-full h-12 rounded-[8px] mb-2 shadow-inner border border-black/5"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-bold text-[#17211D] block">{c.name}</span>
                <span className="text-[11px] font-mono text-[#68756E] block">{c.hex}</span>
                <span className="text-[10px] text-[#929D96] mt-1 block leading-tight">{c.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Surfaces */}
        <div>
          <h4 className="text-xs font-bold text-[#68756E] uppercase tracking-wider mb-3">
            Surfaces & Borders
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {surfaceColors.map((c) => (
              <div key={c.hex} className="p-3 rounded-[12px] border border-[#E6EBE8] bg-[#F8FAF9]">
                <div
                  className="w-full h-12 rounded-[8px] mb-2 shadow-inner border border-black/5"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-bold text-[#17211D] block">{c.name}</span>
                <span className="text-[11px] font-mono text-[#68756E] block">{c.hex}</span>
                <span className="text-[10px] text-[#929D96] mt-1 block leading-tight">{c.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Colors */}
        <div>
          <h4 className="text-xs font-bold text-[#68756E] uppercase tracking-wider mb-3">
            Tingkat Risiko (Disaster Warning Levels)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {riskColors.map((r) => (
              <div key={r.level} className="p-3 rounded-[12px] border border-[#E6EBE8] bg-[#F8FAF9]">
                <div
                  className="w-full h-12 rounded-[8px] mb-2 shadow-inner border border-black/5"
                  style={{ backgroundColor: r.hex }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17211D]">{r.level}</span>
                  <span className="text-[11px] font-mono text-[#68756E]">{r.hex}</span>
                </div>
                <span className="text-[10px] text-[#929D96] mt-1 block leading-tight">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Typography Hierarchy */}
      <div className="bg-white rounded-[20px] p-6 border border-[#E6EBE8] shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#17211D] flex items-center gap-2">
          <Type className="w-4 h-4 text-[#176B4D]" />
          <span>Typography Tokens (Inter Sans-Serif)</span>
        </h3>

        <div className="space-y-3 divide-y divide-[#F1F4F2] text-xs">
          <div className="pt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#17211D]">Display 32px Semibold</span>
            <span className="text-[#929D96] font-mono">32px / 1.25 / Semibold 700</span>
          </div>
          <div className="pt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#17211D]">Heading 1 (28px)</span>
            <span className="text-[#929D96] font-mono">28px / 1.3 / Bold 700</span>
          </div>
          <div className="pt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-[#17211D]">Heading 2 (22px)</span>
            <span className="text-[#929D96] font-mono">22px / 1.35 / Semibold 600</span>
          </div>
          <div className="pt-2 flex items-baseline justify-between">
            <span className="text-base font-semibold text-[#17211D]">Heading 3 (18px)</span>
            <span className="text-[#929D96] font-mono">18px / 1.4 / Semibold 600</span>
          </div>
          <div className="pt-2 flex items-baseline justify-between">
            <span className="text-sm font-normal text-[#17211D]">Body Default (14px) - Teks informasi utama sistem</span>
            <span className="text-[#929D96] font-mono">14px / 1.5 / Regular 400</span>
          </div>
          <div className="pt-2 flex items-baseline justify-between">
            <span className="text-xs text-[#68756E]">Labels & Meta (12px) - Timestamp dan atribusi sumber</span>
            <span className="text-[#929D96] font-mono">12px / 1.4 / Medium 500</span>
          </div>
        </div>
      </div>

      {/* 3. Reusable Component Variants Preview */}
      <div className="bg-white rounded-[20px] p-6 border border-[#E6EBE8] shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#17211D] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#176B4D]" />
          <span>Component Variants Preview</span>
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-[#68756E] mb-2">Risk Badges</h4>
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge level="Aman" />
              <RiskBadge level="Waspada" />
              <RiskBadge level="Siaga" />
              <RiskBadge level="Awas" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#68756E] mb-2">Source Badges</h4>
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge source="BMKG" />
              <SourceBadge source="InaRISK" />
              <SourceBadge source="Open-Meteo" />
              <SourceBadge source="PVMBG" />
              <SourceBadge source="Simulasi" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#68756E] mb-2">Verification Badges</h4>
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge status="Terverifikasi" />
              <VerificationBadge status="Dalam Verifikasi" />
              <VerificationBadge status="Belum Terverifikasi" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tech Stack Architecture Alignment */}
      <div className="bg-[#104A35] text-white rounded-[20px] p-6 shadow-md space-y-3">
        <h3 className="text-sm font-extrabold flex items-center gap-2 text-emerald-300">
          <Cpu className="w-4 h-4" />
          <span>Arsitektur & Spesifikasi Teknologi SiagaKita</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-white/10 p-3 rounded-[12px] border border-white/10">
            <span className="font-bold text-emerald-300 block mb-1">Frontend & PWA</span>
            <p className="text-white/80 leading-relaxed text-[11px]">
              Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Serwist (@serwist/next), Lucide Icons.
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-[12px] border border-white/10">
            <span className="font-bold text-emerald-300 block mb-1">Geospatial & Map</span>
            <p className="text-white/80 leading-relaxed text-[11px]">
              MapLibre GL JS, PMTiles vector offline storage, OpenStreetMap data, Supabase PostGIS queries.
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-[12px] border border-white/10">
            <span className="font-bold text-emerald-300 block mb-1">Backend & Persistence</span>
            <p className="text-white/80 leading-relaxed text-[11px]">
              Supabase PostgreSQL (RLS), Supabase Storage for photos, Dexie/IndexedDB for local caching, Web Push (VAPID).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
