"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  UserX,
  Check,
  Search,
  ChevronDown,
  Crosshair,
  Loader2,
  X
} from "lucide-react";
import { INDONESIA_REGIONS, findClosestBMKGRegion } from "@/lib/bmkg";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("Kota Bandung");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [regionSearchQuery, setRegionSearchQuery] = useState("");
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsFeedback, setGpsFeedback] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedRegion = useMemo(() => {
    return INDONESIA_REGIONS.find((r) => r.name === location) || null;
  }, [location]);

  const filteredRegions = useMemo(() => {
    const q = regionSearchQuery.toLowerCase().trim();
    if (!q) return INDONESIA_REGIONS;
    return INDONESIA_REGIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.province.toLowerCase().includes(q) ||
        (r.group && r.group.toLowerCase().includes(q))
    );
  }, [regionSearchQuery]);

  const handleDetectGPS = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!navigator.geolocation) {
      setGpsFeedback("Browser Anda tidak mendukung deteksi lokasi (Geolocation).");
      return;
    }

    setIsLocatingGPS(true);
    setGpsFeedback(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const result = findClosestBMKGRegion(latitude, longitude);
        setLocation(result.region.name);
        setIsLocatingGPS(false);
        setGpsFeedback(`Terdeteksi: ${result.region.name} (~${result.distanceKm} km)`);
        setTimeout(() => {
          setIsLocationDropdownOpen(false);
          setGpsFeedback(null);
        }, 900);
      },
      (error) => {
        setIsLocatingGPS(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsFeedback("Izin lokasi ditolak. Silakan cari wilayah secara manual.");
        } else {
          setGpsFeedback("Gagal mendeteksi lokasi GPS. Silakan ketik nama kota Anda.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nama: name,
          role: "warga",
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Pendaftaran gagal. Silakan periksa kembali data Anda.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Pendaftaran berhasil! Mengarahkan ke dashboard...");
      setTimeout(() => {
        window.location.href = redirectParam;
      }, 400);
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan saat proses pendaftaran.");
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/guest", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal masuk sebagai tamu.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Masuk sebagai Tamu berhasil! Mengarahkan...");
      setTimeout(() => {
        window.location.href = redirectParam;
      }, 400);
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan saat masuk sebagai tamu.");
      setIsLoading(false);
    }
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

        {/* Wilayah / Lokasi Domisili (Searchable Combobox) */}
        <div ref={locationDropdownRef} className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#17211D]">
              Wilayah Domisili (Untuk Notifikasi Lokal)
            </label>
            <span className="text-[10px] text-[#68756E]">
              {selectedRegion?.province || "Indonesia"}
            </span>
          </div>

          {/* Trigger button */}
          <button
            type="button"
            onClick={() => {
              setIsLocationDropdownOpen(!isLocationDropdownOpen);
              setRegionSearchQuery("");
            }}
            className={`w-full relative pl-10 pr-3.5 py-2 min-h-[40px] rounded-[10px] text-xs md:text-sm text-left border flex items-center justify-between transition-all cursor-pointer ${
              isLocationDropdownOpen
                ? "bg-white border-[#176B4D] ring-2 ring-[#E5F5EA]"
                : "bg-[#F8FAF9] border-[#E6EBE8] hover:bg-[#F1F4F2]"
            }`}
          >
            <MapPin className="w-4 h-4 text-[#176B4D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="font-semibold text-[#17211D] truncate">
                {location}
              </span>
              {selectedRegion?.province && (
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#E5F5EA] text-[#176B4D] shrink-0">
                  {selectedRegion.province}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[#929D96] shrink-0">
              <span className="text-[10px] text-[#176B4D] font-medium hidden sm:inline">Cari / Ubah</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLocationDropdownOpen ? "rotate-180 text-[#176B4D]" : ""}`} />
            </div>
          </button>

          {/* Search Dropdown Popover */}
          {isLocationDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-[14px] border border-[#E6EBE8] shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-fadeIn">
              {/* Search Box Header */}
              <div className="p-2.5 border-b border-[#F1F4F2] bg-[#F8FAF9] space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#929D96] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regionSearchQuery}
                    onChange={(e) => setRegionSearchQuery(e.target.value)}
                    placeholder="Ketik kota/kabupaten (mis. Bogor, Padang, Bandung)..."
                    autoFocus
                    className="w-full pl-9 pr-8 py-1.5 bg-white rounded-[8px] text-xs text-[#17211D] placeholder:text-[#929D96] border border-[#E6EBE8] focus:outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D]"
                  />
                  {regionSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setRegionSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#929D96] hover:text-[#17211D]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick GPS Action */}
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocatingGPS}
                  className="w-full py-1.5 px-2.5 rounded-[8px] bg-white hover:bg-[#E5F5EA] text-[#176B4D] border border-[#CDD7D1] hover:border-[#176B4D] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLocatingGPS ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mendeteksi GPS terdekat...</span>
                    </>
                  ) : (
                    <>
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Deteksi Lokasi GPS Otomatis</span>
                    </>
                  )}
                </button>

                {/* GPS Feedback message */}
                {gpsFeedback && (
                  <div className="px-2 py-1 rounded-[6px] bg-[#E5F5EA] text-[#176B4D] text-[10px] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{gpsFeedback}</span>
                  </div>
                )}
              </div>

              {/* Regions List */}
              <div className="max-h-52 overflow-y-auto divide-y divide-[#F8FAF9]">
                {filteredRegions.length > 0 ? (
                  filteredRegions.map((r) => {
                    const isSelected = r.name === location;
                    return (
                      <button
                        key={r.adm4 || r.name}
                        type="button"
                        onClick={() => {
                          setLocation(r.name);
                          setIsLocationDropdownOpen(false);
                          setRegionSearchQuery("");
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#E5F5EA] text-[#176B4D] font-bold"
                            : "hover:bg-[#F8FAF9] text-[#17211D]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={isSelected ? "font-bold text-[#176B4D]" : "font-medium"}>
                              {r.name}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] bg-[#176B4D] text-white px-1.5 py-0.2 rounded font-semibold">
                                Terpilih
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#68756E] block mt-0.5">
                            {r.province} {r.group ? `• ${r.group}` : ""}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#176B4D] shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 px-4 text-center">
                    <p className="text-xs font-semibold text-[#17211D]">Wilayah tidak ditemukan</p>
                    <p className="text-[10px] text-[#68756E] mt-0.5">
                      Coba cari dengan kata kunci nama kabupaten atau provinsi lainnya.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer info */}
              <div className="px-3 py-1.5 bg-[#F8FAF9] border-t border-[#F1F4F2] text-[10px] text-[#929D96] flex items-center justify-between">
                <span>Total {filteredRegions.length} wilayah BMKG</span>
                <span>Klik untuk memilih</span>
              </div>
            </div>
          )}
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
          atau opsi lainnya
        </span>
      </div>

      {/* Guest Actions */}
      <div className="space-y-2">

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
