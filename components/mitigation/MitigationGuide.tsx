import React, { useState } from "react";
import { 
  Droplets, 
  Mountain, 
  Activity, 
  Wind, 
  Flame, 
  CheckCircle2, 
  DownloadCloud, 
  FileCheck,
  Info 
} from "lucide-react";
import { mockMitigationGuides } from "@/data/mockDisasterData";
import { TasSiagaChecklist } from "./TasSiagaChecklist";

export function MitigationGuide() {
  const [selectedDisasterId, setSelectedDisasterId] = useState<string>("banjir");
  const [activeTab, setActiveTab] = useState<"sebelum" | "saat" | "sesudah">("sebelum");
  const [isSavedOffline, setIsSavedOffline] = useState(false);

  const currentGuide =
    mockMitigationGuides.find((g) => g.id === selectedDisasterId) ||
    mockMitigationGuides[0];

  const categories = [
    { id: "banjir", label: "Banjir & Luapan", icon: Droplets },
    { id: "longsor", label: "Tanah Longsor", icon: Mountain },
    { id: "gempa", label: "Gempa Bumi", icon: Activity },
    { id: "cuaca", label: "Cuaca Ekstrem", icon: Wind },
    { id: "kebakaran", label: "Kebakaran Lahan", icon: Flame },
  ];

  const handleSaveGuideOffline = () => {
    setIsSavedOffline(true);
    setTimeout(() => setIsSavedOffline(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Category selector row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedDisasterId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedDisasterId(cat.id)}
              className={`p-3.5 rounded-[14px] border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-[#E5F5EA] border-[#176B4D] shadow-sm"
                  : "bg-white border-[#E6EBE8] hover:bg-[#F8FAF9]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-[10px] flex items-center justify-center mb-2 ${
                  isSelected
                    ? "bg-[#176B4D] text-white"
                    : "bg-[#F5F7F6] text-[#68756E]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs font-bold ${
                  isSelected ? "text-[#176B4D]" : "text-[#17211D]"
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Guide Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 3-Phase Guide */}
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F2]">
              <div>
                <h3 className="text-base font-bold text-[#17211D]">
                  Panduan: {currentGuide.title}
                </h3>
                <p className="text-xs text-[#68756E] mt-0.5">{currentGuide.desc}</p>
              </div>

              <button
                onClick={handleSaveGuideOffline}
                className="py-1.5 px-3 rounded-[8px] bg-[#F8FAF9] hover:bg-[#F1F8F3] border border-[#E6EBE8] text-[11px] font-semibold text-[#176B4D] flex items-center gap-1.5 transition-colors"
              >
                {isSavedOffline ? (
                  <>
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Tersimpan Offline!</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Simpan Offline</span>
                  </>
                )}
              </button>
            </div>

            {/* Sebelum / Saat / Sesudah Tabs */}
            <div className="flex border-b border-[#E6EBE8] mt-4">
              <button
                onClick={() => setActiveTab("sebelum")}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "sebelum"
                    ? "border-[#176B4D] text-[#176B4D]"
                    : "border-transparent text-[#68756E] hover:text-[#17211D]"
                }`}
              >
                1. Sebelum Bencana
              </button>
              <button
                onClick={() => setActiveTab("saat")}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "saat"
                    ? "border-[#176B4D] text-[#176B4D]"
                    : "border-transparent text-[#68756E] hover:text-[#17211D]"
                }`}
              >
                2. Saat Terjadi
              </button>
              <button
                onClick={() => setActiveTab("sesudah")}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "sesudah"
                    ? "border-[#176B4D] text-[#176B4D]"
                    : "border-transparent text-[#68756E] hover:text-[#17211D]"
                }`}
              >
                3. Sesudah Bencana
              </button>
            </div>

            {/* Instruction List for Selected Phase */}
            <div className="py-4 space-y-3">
              {(activeTab === "sebelum"
                ? currentGuide.sebelum
                : activeTab === "saat"
                ? currentGuide.saat
                : currentGuide.setelah
              ).map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[12px] bg-[#F8FAF9] border border-[#E6EBE8] flex items-start gap-3 hover:bg-[#F1F8F3] transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#176B4D] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs font-medium text-[#17211D] leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F1F4F2] flex items-center justify-between text-[11px] text-[#929D96]">
            <span>Sumber Rujukan: BNPB & BPBD Indonesia</span>
            <span>Versi Standar Mitigasi 2026</span>
          </div>
        </div>

        {/* Right Column: Tas Siaga Checklist */}
        <div className="lg:col-span-1">
          <TasSiagaChecklist />
        </div>
      </div>
    </div>
  );
}
