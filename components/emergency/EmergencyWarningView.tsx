import React, { useState } from "react";
import { 
  AlertTriangle, 
  ArrowLeft, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Compass, 
  HeartHandshake, 
  BookOpen,
  Share2
} from "lucide-react";
import { ActiveWarning } from "@/types";

interface EmergencyWarningViewProps {
  warning: ActiveWarning;
  onBack: () => void;
  onNavigateToEvacuationRoute: () => void;
  onTriggerSayaAman: () => void;
  onOpenMitigationGuide: () => void;
}

export function EmergencyWarningView({
  warning,
  onBack,
  onNavigateToEvacuationRoute,
  onTriggerSayaAman,
  onOpenMitigationGuide,
}: EmergencyWarningViewProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `[SIAGAKITA] ${warning.title} di ${warning.affectedArea}. Segera evakuasi ke tempat aman! Info: https://siagakita.id`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#D64545] text-white flex flex-col justify-between p-4 md:p-8 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between pb-4 border-b border-white/20">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2">
          {warning.isDemoSimulation ? (
            <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full">
              Simulasi Demo
            </span>
          ) : (
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white text-[#D64545] px-2.5 py-0.5 rounded-full">
              Peringatan Resmi {warning.source}
            </span>
          )}

          <button
            onClick={handleShare}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Bagikan Peringatan"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {copied && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white text-[#17211D] px-4 py-2 rounded-full text-xs font-bold shadow-lg z-50 animate-bounce">
          ✓ Pesan peringatan darurat disalin ke papan klip!
        </div>
      )}

      {/* Main Alert Card */}
      <div className="max-w-2xl mx-auto w-full my-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-[#D64545] shadow-lg animate-bounce">
            <AlertTriangle className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              PERINGATAN DARURAT
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
              {warning.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/90">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {warning.affectedArea}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {warning.validPeriod}
            </span>
          </div>
        </div>

        {/* Structured Information White Box */}
        <div className="bg-white text-[#17211D] rounded-[20px] p-6 shadow-2xl space-y-5">
          {/* APA YANG TERJADI */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#929D96] mb-1">
              Apa yang Terjadi?
            </h3>
            <p className="text-sm font-medium text-[#17211D] leading-relaxed">
              {warning.whatHappened}
            </p>
          </div>

          {/* DI MANA */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#929D96] mb-1">
              Di Mana Wilayah Terdampak?
            </h3>
            <p className="text-sm font-medium text-[#17211D] leading-relaxed">
              {warning.whereLocation}
            </p>
          </div>

          {/* SEBERAPA PARAH */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#929D96] mb-1">
              Seberapa Parah Tingkat Risiko?
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FDECEC] text-[#D64545] border border-[#F9C1C1]">
                Tingkat Risiko: {warning.level}
              </span>
              <span className="text-xs text-[#68756E]">
                {warning.howSevere}
              </span>
            </div>
          </div>

          {/* LAKUKAN INI */}
          <div className="pt-3 border-t border-[#F1F4F2]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#176B4D] mb-2.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#176B4D]" />
              Lakukan Ini Sekarang:
            </h3>
            <ul className="space-y-2">
              {warning.instructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[#17211D] font-medium leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[#176B4D] shrink-0 mt-0.5" />
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Primary Call to Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onNavigateToEvacuationRoute}
            className="w-full py-3.5 px-6 rounded-[14px] bg-white text-[#D64545] hover:bg-[#F8FAF9] text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
          >
            <Compass className="w-5 h-5 text-[#D64545]" />
            <span>Lihat Rute Evakuasi Terdekat</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onTriggerSayaAman}
              className="py-3 px-4 rounded-[12px] bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/40 transition-colors"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Saya Aman</span>
            </button>

            <button
              onClick={onOpenMitigationGuide}
              className="py-3 px-4 rounded-[12px] bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/20 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Baca Panduan Banjir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Footer */}
      <div className="max-w-2xl mx-auto w-full text-center text-[10px] text-white/70 pt-4 border-t border-white/20">
        Informasi darurat ini disebarluaskan oleh platform kesiapsiagaan SiagaKita. Selalu utamakan instruksi langsung dari petugas penyelamat lapangan BPBD / SAR.
      </div>
    </div>
  );
}
