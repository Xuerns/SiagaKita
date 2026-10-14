"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  UserX,
  Check
} from "lucide-react";
import { INDONESIA_REGIONS } from "@/lib/bmkg";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"warga" | "relawan">("warga");
  const [location, setLocation] = useState("Kota Bandung");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const locations = useMemo(() => {
    return INDONESIA_REGIONS.map((r) => r.name);
  }, []);

  // Calculate password strength
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(password);
  const strengthLabels = ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"];
  const strengthColors = ["#DC2626", "#EF4444", "#D9A514", "#25845F", "#176B4D"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Mohon lengkapi seluruh kolom pendaftaran.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Kata sandi minimal harus 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi.");
      return;
    }

    setIsLoading(true);

    // Simulate registration flow
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Pendaftaran berhasil! Akun Anda telah siap.");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }, 1500);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/?mode=guest");
    }, 600);
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Menghubungkan akun Google...");
      setTimeout(() => {
        router.push("/");
      }, 900);
    }, 800);
  };

  return (
    <div className="w-full">
      {/* Alert Messages */}
      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-[12px] bg-[#FDECEC] border border-[#F9C1C1] text-[#D64545] text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 rounded-[12px] bg-[#E5F5EA] border border-[#CDD7D1] text-[#176B4D] text-xs flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Role Selector (PRD FR-AUTH-07) */}
        <div>
          <label className="block text-xs font-semibold text-[#17211D] mb-1.5">
            Daftar Sebagai Peran
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("warga")}
              className={`p-2.5 rounded-[12px] border text-left flex items-start gap-2 transition-all cursor-pointer ${
                role === "warga"
                  ? "border-[#176B4D] bg-[#E5F5EA]/50 ring-1 ring-[#176B4D]"
                  : "border-[#E6EBE8] bg-[#F8FAF9] hover:bg-white"
              }`}
            >
              <div className={`p-1.5 rounded-[8px] mt-0.5 ${role === "warga" ? "bg-[#176B4D] text-white" : "bg-white text-[#68756E]"}`}>
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#17211D] flex items-center gap-1">
                  <span>Warga</span>
                  {role === "warga" && <Check className="w-3 h-3 text-[#176B4D]" />}
                </div>
                <div className="text-[10px] text-[#68756E] leading-tight mt-0.5">
                  Pantau peringatan & lapor bencana
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("relawan")}
              className={`p-2.5 rounded-[12px] border text-left flex items-start gap-2 transition-all cursor-pointer ${
                role === "relawan"
                  ? "border-[#176B4D] bg-[#E5F5EA]/50 ring-1 ring-[#176B4D]"
                  : "border-[#E6EBE8] bg-[#F8FAF9] hover:bg-white"
              }`}
            >
              <div className={`p-1.5 rounded-[8px] mt-0.5 ${role === "relawan" ? "bg-[#176B4D] text-white" : "bg-white text-[#68756E]"}`}>
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#17211D] flex items-center gap-1">
                  <span>Relawan Siaga</span>
                  {role === "relawan" && <Check className="w-3 h-3 text-[#176B4D]" />}
                </div>
                <div className="text-[10px] text-[#68756E] leading-tight mt-0.5">
                  Verifikasi data & posko tanggap
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#17211D] mb-1">
            Nama Lengkap
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#929D96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Totok Michael"
              required
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAF9] rounded-[10px] text-xs md:text-sm text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white focus:ring-2 focus:ring-[#E5F5EA] transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#17211D] mb-1">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#929D96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAF9] rounded-[10px] text-xs md:text-sm text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white focus:ring-2 focus:ring-[#E5F5EA] transition-all"
            />
          </div>
        </div>

        {/* Wilayah / Lokasi Domisili (PRD FR-AUTH-05) */}
        <div>
          <label className="block text-xs font-semibold text-[#17211D] mb-1">
            Wilayah Domisili (Untuk Notifikasi Lokal)
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#176B4D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-[#F8FAF9] rounded-[10px] text-xs md:text-sm text-[#17211D] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white focus:ring-2 focus:ring-[#E5F5EA] appearance-none cursor-pointer transition-all"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#929D96] text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-[#17211D] mb-1">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#929D96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              className="w-full pl-10 pr-10 py-2 bg-[#F8FAF9] rounded-[10px] text-xs md:text-sm text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white focus:ring-2 focus:ring-[#E5F5EA] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#929D96] hover:text-[#17211D] p-0.5"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#68756E]">Kekuatan kata sandi:</span>
                <span className="font-semibold" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#E6EBE8] rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className="h-full flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        step <= strength ? strengthColors[strength] : "#E6EBE8",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-[#17211D] mb-1">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#929D96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi"
              required
              className="w-full pl-10 pr-10 py-2 bg-[#F8FAF9] rounded-[10px] text-xs md:text-sm text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white focus:ring-2 focus:ring-[#E5F5EA] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#929D96] hover:text-[#17211D] p-0.5"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Agree Terms Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#176B4D] focus:ring-[#176B4D] border-[#CDD7D1] accent-[#176B4D]"
            />
            <span className="text-[11px] text-[#68756E] leading-snug">
              Saya menyetujui{" "}
              <span className="text-[#176B4D] font-semibold hover:underline cursor-pointer">
                Ketentuan Layanan
              </span>{" "}
              dan{" "}
              <span className="text-[#176B4D] font-semibold hover:underline cursor-pointer">
                Kebijakan Privasi
              </span>{" "}
              SiagaKita.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 rounded-[10px] bg-[#176B4D] hover:bg-[#104A35] active:scale-[0.99] text-white text-xs md:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Mendaftarkan...</span>
            </>
          ) : (
            <>
              <span>Daftar Akun Baru</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E6EBE8]" />
        </div>
        <span className="relative px-3 bg-white text-[10px] font-medium text-[#929D96] uppercase tracking-wider">
          atau daftar dengan
        </span>
      </div>

      {/* Social / OAuth & Guest Actions */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full py-2 px-4 rounded-[10px] border border-[#E6EBE8] bg-[#F8FAF9] hover:bg-white hover:border-[#CDD7D1] text-[#17211D] text-xs font-semibold transition-all flex items-center justify-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Daftar dengan Google</span>
        </button>

        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="w-full py-2 px-4 rounded-[10px] bg-[#F1F8F3] hover:bg-[#E5F5EA] border border-[#E5F5EA] text-[#176B4D] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserX className="w-3.5 h-3.5 text-[#176B4D]" />
          <span>Masuk sebagai Tamu Tanpa Mendaftar</span>
        </button>
      </div>

      {/* Footer Switcher */}
      <div className="mt-5 text-center text-xs text-[#68756E]">
        Sudah memiliki akun SiagaKita?{" "}
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-[#176B4D] hover:underline cursor-pointer"
          >
            Masuk di sini
          </button>
        ) : (
          <Link href="/login" className="font-bold text-[#176B4D] hover:underline">
            Masuk di sini
          </Link>
        )}
      </div>
    </div>
  );
}
