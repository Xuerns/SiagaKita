import React from "react";
import { Monitor, Smartphone, Palette, AlertTriangle, BellRing } from "lucide-react";

export type ViewportMode = "desktop" | "mobile" | "tokens";

interface DeviceViewportSwitcherProps {
  currentMode: ViewportMode;
  onChangeMode: (mode: ViewportMode) => void;
  onTriggerEmergency: () => void;
  onSimulatePushNotification: () => void;
}

export function DeviceViewportSwitcher({
  currentMode,
  onChangeMode,
  onTriggerEmergency,
  onSimulatePushNotification,
}: DeviceViewportSwitcherProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 bg-[#17211D]/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/20 select-none text-xs">
      <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full">
        <button
          onClick={() => onChangeMode("desktop")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all ${
            currentMode === "desktop"
              ? "bg-[#176B4D] text-white shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
          title="Tampilan Desktop (1440 × 1024 px)"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Desktop</span>
        </button>

        <button
          onClick={() => onChangeMode("mobile")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all ${
            currentMode === "mobile"
              ? "bg-[#176B4D] text-white shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
          title="Tampilan Mobile PWA (390 × 844 px)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mobile PWA</span>
        </button>

        <button
          onClick={() => onChangeMode("tokens")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all ${
            currentMode === "tokens"
              ? "bg-[#176B4D] text-white shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
          title="Figma 01: Design System & Tokens"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tokens</span>
        </button>
      </div>

      <div className="h-4 w-px bg-white/20 mx-1" />

      {/* Emergency Simulation Trigger */}
      <button
        onClick={onTriggerEmergency}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#D64545] hover:bg-[#b83232] text-white font-extrabold text-[11px] transition-all shadow-md active:scale-95 animate-pulse"
        title="Simulasi Peringatan Darurat Awas (Full Screen)"
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Tes Peringatan Awas</span>
      </button>

      {/* Web Push Simulation Trigger */}
      <button
        onClick={onSimulatePushNotification}
        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        title="Simulasi Web Push Notification"
      >
        <BellRing className="w-3.5 h-3.5 text-amber-300" />
      </button>
    </div>
  );
}
