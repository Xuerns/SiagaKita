import React, { useState } from "react";
import { CheckCircle2, TreePine, House, CheckSquare } from "lucide-react";
import { TasSiagaChecklist } from "../mitigation/TasSiagaChecklist";

export function MobileMitigationView() {
  const [activeTab, setActiveTab] = useState<"sebelum" | "saat" | "setelah">("sebelum");
  const [showChecklistFull, setShowChecklistFull] = useState(false);

  const steps = {
    sebelum: [
      "Kenali risiko bencana di lingkunganmu",
      "Siapkan tas siaga dan dokumen penting",
      "Pastikan jalur evakuasi terdekat",
      "Ikuti informasi resmi BMKG dan BPBD",
    ],
    saat: [
      "Padamkan aliran listrik dan gas rumah tangga",
      "Hindari berjalan di air arus deras",
      "Segera bergerak ke titik kumpul aman",
      "Bantu evakuasi lansia dan anak-anak",
    ],
    setelah: [
      "Waspadai kabel listrik terbuka dan hewan liar",
      "Bersihkan rumah dengan disinfektan",
      "Konsumsi air minum higienis matang",
      "Periksa kondisi keselamatan sanak keluarga",
    ],
  };

  return (
    <div className="p-4 space-y-4 pb-20 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-[#17211D]">Mitigasi</h2>
        <button
          onClick={() => setShowChecklistFull(!showChecklistFull)}
          className="text-xs font-bold text-[#176B4D] bg-[#E5F5EA] px-2.5 py-1 rounded-full flex items-center gap-1"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Tas Siaga</span>
        </button>
      </div>

      {showChecklistFull ? (
        <TasSiagaChecklist />
      ) : (
        <>
          {/* Phase Tabs */}
          <div className="flex bg-[#E6EBE8] p-1 rounded-[12px]">
            {(["sebelum", "saat", "setelah"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-bold capitalize rounded-[10px] transition-all ${
                  activeTab === tab
                    ? "bg-white text-[#176B4D] shadow-sm"
                    : "text-[#68756E]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Steps Card */}
          <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#17211D] capitalize">
              {activeTab} Bencana
            </h3>
            <div className="space-y-3">
              {steps[activeTab].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#17211D]">
                  <CheckCircle2 className="w-4 h-4 text-[#176B4D] shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stylized Illustrated Footer Banner */}
          <div className="bg-[#E5F5EA] rounded-[18px] p-6 text-center border border-[#CDD7D1] space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#25845F]">
              <TreePine className="w-6 h-6" />
              <House className="w-7 h-7 text-[#176B4D]" />
              <TreePine className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-extrabold text-[#104A35]">
              Siap lebih awal, lebih aman nanti.
            </h4>
            <p className="text-[11px] text-[#176B4D]">
              Disaster preparedness is our collective strength.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
