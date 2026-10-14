import React from "react";
import { RiskLevel, SourceType, VerificationStatus } from "@/types";
import { ShieldCheck, AlertTriangle, AlertCircle, Flame, CheckCircle2, Clock, XCircle, Info } from "lucide-react";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function RiskBadge({ level, size = "md", showIcon = true }: RiskBadgeProps) {
  const configs = {
    Aman: {
      bg: "bg-[#E5F5EA] text-[#176B4D] border-[#CDD7D1]",
      icon: ShieldCheck,
      label: "Aman",
    },
    Waspada: {
      bg: "bg-[#FEF8E7] text-[#B58206] border-[#FCE39E]",
      icon: AlertCircle,
      label: "Waspada",
    },
    Siaga: {
      bg: "bg-[#FEF1E6] text-[#C96B10] border-[#FBD6B5]",
      icon: AlertTriangle,
      label: "Siaga",
    },
    Awas: {
      bg: "bg-[#FDECEC] text-[#D64545] border-[#F9C1C1]",
      icon: Flame,
      label: "Awas",
    },
    aman: {
      bg: "bg-[#E5F5EA] text-[#176B4D] border-[#CDD7D1]",
      icon: ShieldCheck,
      label: "Aman",
    },
    waspada: {
      bg: "bg-[#FEF8E7] text-[#B58206] border-[#FCE39E]",
      icon: AlertCircle,
      label: "Waspada",
    },
    siaga: {
      bg: "bg-[#FEF1E6] text-[#C96B10] border-[#FBD6B5]",
      icon: AlertTriangle,
      label: "Siaga",
    },
    awas: {
      bg: "bg-[#FDECEC] text-[#D64545] border-[#F9C1C1]",
      icon: Flame,
      label: "Awas",
    },
  };

  const normalized = (level || 'Aman') as keyof typeof configs;
  const config = configs[normalized] || configs.Aman;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"} />}
      <span>{config.label}</span>
    </span>
  );
}

export function SourceBadge({ source }: { source: SourceType }) {
  const isOfficial = source === "BMKG" || source === "InaRISK" || source === "PVMBG";
  const isSimulation = source === "Simulasi";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide ${
        isOfficial
          ? "bg-[#E5F5EA] text-[#176B4D] border border-[#CDD7D1]"
          : isSimulation
          ? "bg-[#FEF1E6] text-[#C96B10] border border-[#FBD6B5]"
          : "bg-[#EAF4FB] text-[#3983B9] border border-[#BCE0F7]"
      }`}
    >
      <Info className="w-3 h-3" />
      {source}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === "Terverifikasi") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#176B4D] bg-[#E5F5EA] px-2 py-0.5 rounded-full border border-[#CDD7D1]">
        <CheckCircle2 className="w-3 h-3" />
        Terverifikasi
      </span>
    );
  }
  if (status === "Dalam Verifikasi") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B58206] bg-[#FEF8E7] px-2 py-0.5 rounded-full border border-[#FCE39E]">
        <Clock className="w-3 h-3" />
        Dalam Verifikasi
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#68756E] bg-[#F5F7F6] px-2 py-0.5 rounded-full border border-[#E6EBE8]">
      <XCircle className="w-3 h-3" />
      {status}
    </span>
  );
}
