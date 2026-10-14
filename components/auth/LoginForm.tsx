"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  UserX,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Mohon isi alamat email dan kata sandi Anda.");
      return;
    }

    setIsLoading(true);

    // Simulate authentication flow for front-end demonstration
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Berhasil masuk! Mengarahkan ke dashboard...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 1200);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/?mode=guest");
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Menghubungkan akun Google...");
      setTimeout(() => {
        router.push("/");
      }, 900);
    }, 800);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotSent(false);
      setForgotEmail("");
      setSuccessMsg("Tautan pemulihan kata sandi telah dikirim ke email Anda.");
    }, 2000);
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-[#17211D] mb-1.5">
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
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF9] rounded-[10px] text-sm text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white focus:ring-2 focus:ring-[#E5F5EA] transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#17211D]">
              Kata Sandi
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-xs font-medium text-[#176B4D] hover:underline"
            >
              Lupa kata sandi?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#929D96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi Anda"
              required
              className="w-full pl-10 pr-10 py-2.5 bg-[#F8FAF9] rounded-[10px] text-sm text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:bg-white focus:ring-2 focus:ring-[#E5F5EA] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#929D96] hover:text-[#17211D] p-0.5"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#176B4D] focus:ring-[#176B4D] border-[#CDD7D1] accent-[#176B4D]"
            />
            <span className="text-xs text-[#68756E]">Ingat saya di perangkat ini</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 rounded-[10px] bg-[#176B4D] hover:bg-[#104A35] active:scale-[0.99] text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E6EBE8]" />
        </div>
        <span className="relative px-3 bg-white text-[11px] font-medium text-[#929D96] uppercase tracking-wider">
          atau masuk dengan
        </span>
      </div>

      {/* Social / OAuth & Guest Actions */}
      <div className="space-y-2.5">
        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-[10px] border border-[#E6EBE8] bg-[#F8FAF9] hover:bg-white hover:border-[#CDD7D1] text-[#17211D] text-xs font-semibold transition-all flex items-center justify-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer"
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
          <span>Lanjutkan dengan Google</span>
        </button>

        {/* Guest Mode Sign-In (FR-AUTH-03) */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-[10px] bg-[#F1F8F3] hover:bg-[#E5F5EA] border border-[#E5F5EA] text-[#176B4D] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserX className="w-3.5 h-3.5 text-[#176B4D]" />
          <span>Masuk sebagai Tamu (Tanpa Akun)</span>
        </button>
      </div>

      {/* Footer Switcher */}
      <div className="mt-6 text-center text-xs text-[#68756E]">
        Belum memiliki akun SiagaKita?{" "}
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-[#176B4D] hover:underline cursor-pointer"
          >
            Daftar sekarang
          </button>
        ) : (
          <Link href="/register" className="font-bold text-[#176B4D] hover:underline">
            Daftar sekarang
          </Link>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[20px] max-w-sm w-full p-6 border border-[#E6EBE8] shadow-xl relative">
            <h3 className="text-base font-bold text-[#17211D] mb-1">
              Atur Ulang Kata Sandi
            </h3>
            <p className="text-xs text-[#68756E] mb-4">
              Masukkan alamat email Anda untuk menerima tautan pemulihan kata sandi.
            </p>

            {forgotSent ? (
              <div className="p-3 bg-[#E5F5EA] text-[#176B4D] text-xs rounded-[10px] flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Tautan terkirim! Silakan periksa kotak masuk email Anda.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF9] rounded-[10px] text-xs text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D]"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="flex-1 py-2 rounded-[10px] border border-[#E6EBE8] text-xs font-medium text-[#68756E] hover:bg-[#F8FAF9]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-[10px] bg-[#176B4D] text-white text-xs font-semibold hover:bg-[#104A35]"
                  >
                    Kirim Tautan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
