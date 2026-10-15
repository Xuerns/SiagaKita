"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { getAdm4ByLocation } from "@/lib/bmkg";
import { hitungSkorBanjir } from "@/lib/risiko";
import { getEvacuationPointsForLocation, getDefaultCoordinatesForLocation } from "@/lib/evakuasi";
import {
  DesktopSidebar,
  NavTab
} from "@/components/layout/DesktopSidebar";
import { DesktopTopbar } from "@/components/layout/DesktopTopbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { RiskStatusCard } from "@/components/dashboard/RiskStatusCard";
import { WarningCard } from "@/components/dashboard/WarningCard";
import { ShortcutCards } from "@/components/dashboard/ShortcutCards";
import { ForecastSection } from "@/components/dashboard/ForecastSection";
import { QuickActionPanel } from "@/components/dashboard/QuickActionPanel";
import { EducationBanner } from "@/components/dashboard/EducationBanner";
import { InteractiveRiskMap } from "@/components/map/InteractiveRiskMap";
import { MapDetailsPanel } from "@/components/map/MapDetailsPanel";
import { OfflineMapModal } from "@/components/map/OfflineMapModal";
import { EmergencyWarningView } from "@/components/emergency/EmergencyWarningView";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { CreateReportModal } from "@/components/community/CreateReportModal";
import { MitigationGuide } from "@/components/mitigation/MitigationGuide";
import { MobileBottomNav, MobileHeader, MobileTab } from "@/components/layout/MobileBottomNav";
import { MobileHomeView } from "@/components/mobile/MobileHomeView";
import { MobilePeringatanView } from "@/components/mobile/MobilePeringatanView";
import { MobileRuteView } from "@/components/mobile/MobileRuteView";
import { MobileCommunityView } from "@/components/mobile/MobileCommunityView";
import { MobileMitigationView } from "@/components/mobile/MobileMitigationView";
import { MobileProfileView } from "@/components/mobile/MobileProfileView";
import { DeviceViewportSwitcher, ViewportMode } from "@/components/preview/DeviceViewportSwitcher";
import { DesignSystemViewer } from "@/components/preview/DesignSystemViewer";
import { SayaAmanModal } from "@/components/ui/SayaAmanModal";
import { NotificationBanner } from "@/components/ui/NotificationBanner";
import { LocationSelectorModal } from "@/components/location/LocationSelectorModal";
import { useAuth } from "@/lib/context/AuthContext";
import { LoginReminderOverlay } from "@/components/auth/LoginReminderOverlay";
import {
  mockCurrentWeather,
  mockForecast5Days,
  mockActiveWarning,
  mockEmergencyFullWarning,
  mockEvacuationPoints,
  mockCommunityReports
} from "@/data/mockDisasterData";
import { EvacuationPoint, CommunityReport, WeatherCurrent, ForecastDay, ActiveWarning } from "@/types";
import {
  DownloadCloud,
  Layers,
  ShieldCheck,
  User,
  Trash2,
  AlertTriangle,
  LogIn,
  LogOut,
  Loader2
} from "lucide-react";

export default function SiagaKitaApp() {
  // Auth State
  const { user, isAuthenticated, isGuest, isLoading: isAuthLoading, logout } = useAuth();
  const isGuestMode = !isAuthLoading && (!isAuthenticated || isGuest);

  // Navigation & Viewport State
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [currentTab, setCurrentTab] = useState<NavTab>("beranda");
  const [mobileTab, setMobileTab] = useState<MobileTab>("beranda");
  const [mobileSubScreen, setMobileSubScreen] = useState<"default" | "peringatan" | "rute">("default");

  // App & Data States
  const [currentLocation, setCurrentLocation] = useState<string>("Kota Bandung");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isMapOfflineDownloaded, setIsMapOfflineDownloaded] = useState<boolean>(false);
  const [showRoute, setShowRoute] = useState<boolean>(false);
  const [mapLayerTab, setMapLayerTab] = useState<"evakuasi" | "rute" | "laporan">("evakuasi");
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(mockCommunityReports);
  const [isRefreshingReports, setIsRefreshingReports] = useState<boolean>(false);

  // Dynamic evacuation points according to current location and user's GPS coords
  const currentEvacuationPoints = useMemo(() => {
    return getEvacuationPointsForLocation(currentLocation, userCoords);
  }, [currentLocation, userCoords]);

  const [selectedPoint, setSelectedPoint] = useState<EvacuationPoint>(currentEvacuationPoints[0]);

  useEffect(() => {
    if (currentEvacuationPoints && currentEvacuationPoints.length > 0) {
      setSelectedPoint(currentEvacuationPoints[0]);
    }
  }, [currentEvacuationPoints]);

  // BMKG Weather States
  const [currentWeather, setCurrentWeather] = useState<WeatherCurrent>(mockCurrentWeather);
  const [forecastDays, setForecastDays] = useState<ForecastDay[]>(mockForecast5Days);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // Fetch BMKG Weather dynamically
  const fetchWeather = useCallback(async (location: string, customAdm4?: string) => {
    try {
      setIsLoadingWeather(true);
      const adm4 = customAdm4 || getAdm4ByLocation(location);
      const res = await fetch(`/api/cuaca?adm4=${encodeURIComponent(adm4)}`);
      if (!res.ok) throw new Error("Gagal mengambil data cuaca BMKG");
      const json = await res.json();
      if (json.data?.weather) {
        setCurrentWeather(json.data.weather);
      }
      if (json.data?.forecast && json.data.forecast.length > 0) {
        setForecastDays(json.data.forecast);
      }
    } catch (err) {
      console.warn("Gagal memuat cuaca dari BMKG API, tetap menggunakan data cache:", err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Fetch Community Reports dynamically from /api/laporan
  const fetchReports = useCallback(async (lat?: number, lng?: number) => {
    setIsRefreshingReports(true);
    try {
      let url = "/api/laporan";
      if (lat !== undefined && lng !== undefined) {
        url += `?lat=${lat}&lng=${lng}&radius_km=30`;
      }
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (Array.isArray(json.reports)) {
        let storedLikes: string[] = [];
        try {
          storedLikes = JSON.parse(localStorage.getItem("siagakita_confirmed_reports") || "[]");
        } catch { }

        const mappedReports: CommunityReport[] = json.reports.map((r: any) => ({
          id: r.id,
          userName: r.userName || r.user_name || "Warga Siaga",
          category: (r.category || r.tipe || "Banjir") as any,
          tipe: r.tipe || r.category || "Banjir",
          title: r.title || r.tipe || "Laporan Lapangan",
          description: r.description || r.deskripsi || "",
          deskripsi: r.deskripsi || r.description || "",
          locationName: r.locationName || currentLocation,
          timeAgo: r.timeAgo || (r.created_at ? new Date(r.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "Baru saja"),
          status: (r.status === "terverifikasi" ? "Terverifikasi" : "Dalam Verifikasi") as any,
          confirmationsCount: r.confirmationsCount ?? r.konfirmasi_count ?? 0,
          konfirmasi_count: r.confirmationsCount ?? r.konfirmasi_count ?? 0,
          lat: r.lat,
          lng: r.lng,
          userConfirmed: Boolean(r.userConfirmed || (r.id && storedLikes.includes(r.id))),
        }));
        setCommunityReports(mappedReports);
      }
    } catch (err) {
      console.warn("Gagal mengambil data laporan dari /api/laporan:", err);
    } finally {
      setIsRefreshingReports(false);
    }
  }, [currentLocation]);

  const handleSelectLocation = (
    locationName: string,
    adm4Code?: string,
    preciseCoords?: { lat: number; lng: number; accuracy?: number }
  ) => {
    setCurrentLocation(locationName);
    // Reset userCoords jika user memilih kota secara manual dari dropdown/modal
    // Hanya aktifkan koordinat presisi jika tombol GPS ditekan
    setUserCoords(preciseCoords || null);
    fetchWeather(locationName, adm4Code);
    fetchReports(preciseCoords?.lat, preciseCoords?.lng);
  };

  useEffect(() => {
    fetchWeather(currentLocation);
    fetchReports(userCoords?.lat, userCoords?.lng);
  }, [currentLocation, userCoords, fetchWeather, fetchReports]);

  // Dynamic risk calculation based on BMKG weather condition & location
  const currentRisk = useMemo(() => {
    const cond = currentWeather.condition.toLowerCase();
    let h24 = 0;
    let h3 = 10;
    let mukaAir = 25;

    // Utamakan data presipitasi curah hujan dari API BMKG jika terisi
    if (typeof currentWeather.precipitationMm === "number" && currentWeather.precipitationMm > 0) {
      h24 = Math.round(currentWeather.precipitationMm);
      h3 = Math.round(currentWeather.precipitationMm * 2.4);
      mukaAir = h24 > 100 ? 85 : h24 > 50 ? 65 : h24 > 20 ? 45 : 25;
    } else if (cond.includes("lebat") || cond.includes("petir")) {
      h24 = 125;
      h3 = 240;
      mukaAir = 85;
    } else if (cond.includes("sedang")) {
      h24 = 65;
      h3 = 120;
      mukaAir = 60;
    } else if (cond.includes("ringan") || cond.includes("hujan")) {
      h24 = 35;
      h3 = 65;
      mukaAir = 45;
    } else if (cond.includes("berawan")) {
      h24 = 5;
      h3 = 15;
      mukaAir = 25;
    } else {
      // Cerah
      h24 = 0;
      h3 = 5;
      mukaAir = 20;
    }

    const res = hitungSkorBanjir({
      hujan24jMm: h24,
      hujan3hariMm: h3,
      muka_air: mukaAir,
      kerentanan: 60,
    });

    let mukaAirText = "Normal (Aman)";
    if (res.level === "awas") mukaAirText = "Kritis (Siaga 1)";
    else if (res.level === "siaga") mukaAirText = "Meningkat (Siaga 2)";
    else if (res.level === "waspada") mukaAirText = "Waspada (Siaga 3)";

    return {
      level: res.level,
      skor: res.skor,
      h24,
      h3,
      mukaAir,
      mukaAirText,
    };
  }, [currentWeather]);

  // Dynamic active warning matching currentRisk & currentLocation
  const dynamicWarning: ActiveWarning = useMemo(() => {
    if (currentRisk.level === "aman") {
      return {
        id: "warn-aman",
        title: "Kondisi Wilayah Kondusif",
        hazardType: "Cuaca Normal",
        level: "Aman",
        affectedArea: currentLocation,
        validPeriod: "Hari ini · Pantauan Rutin",
        issuedTime: currentWeather.lastUpdated,
        source: "BMKG",
        description: `Kondisi cuaca di ${currentLocation} terpantau ${currentWeather.condition}. Tidak ada peringatan cuaca ekstrem aktif.`,
        whatHappened: `Cuaca ${currentWeather.condition} dengan curah hujan rendah. Kondisi lingkungan terpantau aman dan terkendali.`,
        whereLocation: currentLocation,
        howSevere: "Level Aman. Seluruh aktivitas warga dapat berjalan normal.",
        instructions: [
          "Tetap pantau pembaruan cuaca berkala dari BMKG.",
          "Jaga kebersihan saluran air di sekitar rumah.",
          "Periksa tas siaga bencana untuk persiapan rutin.",
        ],
        isDemoSimulation: false,
      };
    }

    const levelCapitalized = (currentRisk.level === "awas" ? "Awas" : currentRisk.level === "siaga" ? "Siaga" : "Waspada") as "Awas" | "Siaga" | "Waspada";

    return {
      id: `warn-${currentRisk.level}`,
      title: `Peringatan Dini Cuaca (${currentWeather.condition})`,
      hazardType: "Potensi Genangan & Banjir",
      level: levelCapitalized,
      affectedArea: currentLocation,
      validPeriod: "24 Jam ke Depan",
      issuedTime: currentWeather.lastUpdated,
      source: "BMKG",
      description: `Potensi kenaikan debit air dan genangan akibat ${currentWeather.condition} di wilayah ${currentLocation}.`,
      whatHappened: `Curah hujan akumulatif (${currentRisk.h24} mm/24j) menyebabkan debit aliran air berpotensi meningkat.`,
      whereLocation: `Wilayah ${currentLocation} dan daerah resapan terdekat.`,
      howSevere: `Level ${levelCapitalized}. Warga diimbau waspada terhadap saluran air yang tersumbat.`,
      instructions: [
        "Hindari daerah bantaran sungai dan jalan berarus deras.",
        "Amankan peralatan listrik dan dokumen berharga ke tempat lebih tinggi.",
        "Pantau instruksi resmi dari BPBD setempat dan peringatan BMKG.",
        "Ketahui rute evakuasi terdekat bila terjadi genangan air.",
      ],
      isDemoSimulation: false,
    };
  }, [currentRisk, currentLocation, currentWeather]);

  // Modals & Overlays
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showEmergencyFullscreen, setShowEmergencyFullscreen] = useState<boolean>(false);
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);
  const [showCreateReportModal, setShowCreateReportModal] = useState<boolean>(false);
  const [showSayaAmanModal, setShowSayaAmanModal] = useState<boolean>(false);
  const [showPushNotification, setShowPushNotification] = useState<boolean>(false);
  const [focusTimestamp, setFocusTimestamp] = useState<number>(0);

  // Auth & Account Management
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);
  // Handlers
  const handleSelectEvacuationPoint = (pt: EvacuationPoint) => {
    setSelectedPoint(pt);
    setFocusTimestamp(Date.now());
  };

  const handleStartRouteNavigation = () => {
    setShowRoute(true);
    setMapLayerTab("rute");
  };

  const handleConfirmReport = async (reportId: string) => {
    // 1. Cek apakah laporan sudah pernah dikonfirmasi (like hanya 1 kali, tidak bisa dislike)
    const target = communityReports.find((r) => r.id === reportId);
    if (!target || target.userConfirmed) {
      return;
    }

    // 2. Tandai secara optimis: userConfirmed = true, konfirmasi bertambah 1
    setCommunityReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId
          ? {
            ...rep,
            confirmationsCount: (rep.confirmationsCount ?? 0) + 1,
            userConfirmed: true,
          }
          : rep
      )
    );

    // 3. Simpan ke localStorage agar tidak dapat di-like ulang di perangkat ini
    try {
      const stored = JSON.parse(localStorage.getItem("siagakita_confirmed_reports") || "[]");
      if (!stored.includes(reportId)) {
        localStorage.setItem("siagakita_confirmed_reports", JSON.stringify([...stored, reportId]));
      }
    } catch { }

    // 4. Panggil database API hanya 1 kali per like
    try {
      const res = await fetch(`/api/laporan/${encodeURIComponent(reportId)}/konfirmasi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: 1 }),
      });

      if (res.ok) {
        const json = await res.json();
        if (typeof json.konfirmasi_count === "number") {
          setCommunityReports((prev) =>
            prev.map((rep) =>
              rep.id === reportId
                ? {
                  ...rep,
                  confirmationsCount: json.konfirmasi_count,
                  status: json.status === "terverifikasi" ? "Terverifikasi" : rep.status,
                  userConfirmed: true,
                }
                : rep
            )
          );
        }
      }
    } catch (err) {
      console.warn("Gagal mengirim konfirmasi laporan ke API database:", err);
    }
  };

  const handleCreateReport = async (newRep: Partial<CommunityReport> & { lat?: number; lng?: number }) => {
    // Utamakan koordinat presisi dari GPS modal laporan, fallback ke userCoords atau default kota aktif
    const cityDefault = getDefaultCoordinatesForLocation(newRep.locationName || currentLocation);
    const reportLat = typeof newRep.lat === "number" ? newRep.lat : (userCoords?.lat ?? cityDefault.lat);
    const reportLng = typeof newRep.lng === "number" ? newRep.lng : (userCoords?.lng ?? cityDefault.lng);

    const created: CommunityReport = {
      id: `rep-${Date.now()}`,
      userName: newRep.userName || "Adam",
      category: newRep.category || "Banjir",
      tipe: newRep.category || "Banjir",
      title: newRep.title || "Laporan Lapangan",
      description: newRep.description || "",
      deskripsi: newRep.description || "",
      locationName: newRep.locationName || currentLocation,
      timeAgo: "Baru saja",
      status: "Dalam Verifikasi", // Crucial rule
      confirmationsCount: 1,
      lat: reportLat,
      lng: reportLng,
    };
    setCommunityReports((prev) => [created, ...prev]);

    try {
      const res = await fetch("/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipe: newRep.category || newRep.title || "Banjir",
          deskripsi: newRep.description || newRep.title || "Laporan kondisi lapangan oleh warga",
          lat: reportLat,
          lng: reportLng,
          foto_urls: [],
        }),
      });
      if (res.ok) {
        fetchReports(userCoords?.lat, userCoords?.lng);
      }
    } catch (err) {
      console.warn("Gagal mengirim laporan ke /api/laporan:", err);
    }
  };

  // If Fullscreen Emergency Warning is triggered
  if (showEmergencyFullscreen) {
    return (
      <EmergencyWarningView
        warning={mockEmergencyFullWarning}
        onBack={() => setShowEmergencyFullscreen(false)}
        onNavigateToEvacuationRoute={() => {
          setShowEmergencyFullscreen(false);
          setCurrentTab("peta");
          setMobileTab("peta");
          handleStartRouteNavigation();
        }}
        onTriggerSayaAman={() => {
          setShowEmergencyFullscreen(false);
          setShowSayaAmanModal(true);
        }}
        onOpenMitigationGuide={() => {
          setShowEmergencyFullscreen(false);
          setCurrentTab("mitigasi");
          setMobileTab("mitigasi");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#17211D]">
      {/* Floating Device Viewport & Simulation Bar */}
      <DeviceViewportSwitcher
        currentMode={viewportMode}
        onChangeMode={(mode) => {
          setViewportMode(mode);
          if (mode === "tokens") setCurrentTab("tokens");
        }}
        onTriggerEmergency={() => setShowEmergencyFullscreen(true)}
        onSimulatePushNotification={() => setShowPushNotification(true)}
      />

      {/* Web Push Notification Banner Simulation */}
      {showPushNotification && (
        <NotificationBanner
          warning={mockActiveWarning}
          onOpenWarning={() => {
            setShowPushNotification(false);
            setShowEmergencyFullscreen(true);
          }}
          onDismiss={() => setShowPushNotification(false)}
        />
      )}

      {/* Modals */}
      <OfflineMapModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        isDownloaded={isMapOfflineDownloaded}
        onDownloadComplete={() => setIsMapOfflineDownloaded(true)}
        onRemoveDownload={() => setIsMapOfflineDownloaded(false)}
      />

      <CreateReportModal
        isOpen={showCreateReportModal}
        onClose={() => setShowCreateReportModal(false)}
        onSubmit={handleCreateReport}
        defaultLocationName={currentLocation}
      />

      <SayaAmanModal
        isOpen={showSayaAmanModal}
        onClose={() => setShowSayaAmanModal(false)}
        userCoords={userCoords}
      />

      {/* VIEWPORT MODE: DESIGN SYSTEM / TOKENS */}
      {viewportMode === "tokens" && (
        <div className="max-w-6xl mx-auto p-6 md:p-10 pt-16">
          <div className="mb-4">
            <button
              onClick={() => setViewportMode("desktop")}
              className="text-xs font-bold text-[#176B4D] hover:underline"
            >
              ← Kembali ke Dashboard Desktop
            </button>
          </div>
          <DesignSystemViewer />
        </div>
      )}

      {/* VIEWPORT MODE: MOBILE PWA MOCKUP (390 × 844 px) */}
      {viewportMode === "mobile" && (
        <div className="min-h-screen py-10 flex items-center justify-center bg-[#17211D]/80 backdrop-blur-sm p-4">
          <div className="w-[390px] h-[844px] bg-[#F5F7F6] rounded-[44px] shadow-2xl border-[10px] border-[#1E293B] overflow-hidden flex flex-col relative ring-1 ring-white/20">
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1E293B] rounded-b-[16px] z-50 flex items-center justify-center">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Mobile Header (unless in sub-screen) */}
            {mobileSubScreen === "default" && (
              <div className="pt-5">
                <MobileHeader
                  locationName={currentLocation}
                  onOpenNotifications={() => setShowPushNotification(true)}
                  onOpenLocationSelector={() => setShowLocationModal(true)}
                />
              </div>
            )}

            {/* Mobile Scrollable View Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {mobileSubScreen === "peringatan" ? (
                <MobilePeringatanView
                  warning={mockActiveWarning}
                  onBack={() => setMobileSubScreen("default")}
                  onOpenRoute={() => setMobileSubScreen("rute")}
                />
              ) : mobileSubScreen === "rute" ? (
                <MobileRuteView
                  point={selectedPoint}
                  onBack={() => setMobileSubScreen("default")}
                />
              ) : mobileTab === "beranda" ? (
                <MobileHomeView
                  weather={currentWeather}
                  warning={dynamicWarning}
                  forecast={forecastDays}
                  onNavigateTab={(tab) => setMobileTab(tab)}
                  onOpenWarningDetail={() => setMobileSubScreen("peringatan")}
                  onOpenSayaAman={() => setShowSayaAmanModal(true)}
                  onOpenOfflineMap={() => setShowOfflineModal(true)}
                />
              ) : mobileTab === "peta" ? (
                <MobileRuteView
                  point={selectedPoint}
                  onBack={() => setMobileTab("beranda")}
                />
              ) : mobileTab === "laporan" ? (
                <div className="relative min-h-[520px]">
                  <div
                    className={
                      isGuestMode
                        ? "filter blur-md select-none pointer-events-none opacity-40 transition-all duration-300"
                        : ""
                    }
                  >
                    <MobileCommunityView
                      reports={communityReports}
                      onOpenCreateModal={() => {
                        if (isGuestMode) return;
                        setShowCreateReportModal(true);
                      }}
                      onConfirmReport={handleConfirmReport}
                      onRefresh={() => fetchReports(userCoords?.lat, userCoords?.lng)}
                      isRefreshing={isRefreshingReports}
                    />
                  </div>

                  {isGuestMode && (
                    <LoginReminderOverlay
                      onBackToHome={() => setMobileTab("beranda")}
                    />
                  )}
                </div>
              ) : mobileTab === "mitigasi" ? (
                <MobileMitigationView />
              ) : (
                <MobileProfileView
                  currentLocation={currentLocation}
                  onOpenOfflineManager={() => setShowOfflineModal(true)}
                />
              )}
            </div>

            {/* Mobile Bottom Navigation */}
            {mobileSubScreen === "default" && (
              <MobileBottomNav
                currentTab={mobileTab}
                onSelectTab={(tab) => {
                  setMobileTab(tab);
                  setMobileSubScreen("default");
                }}
                warningCount={1}
              />
            )}
          </div>
        </div>
      )}

      {/* VIEWPORT MODE: DESKTOP APPLICATION SHELL (1440 × 1024 px standard) */}
      {viewportMode === "desktop" && (
        <SidebarProvider
          defaultOpen={true}
          style={{ "--sidebar-width": "15rem", "--sidebar-width-icon": "4rem" } as React.CSSProperties}
        >
          <div className="flex min-h-screen w-full">
            {/* Desktop Left Sidebar */}
            <DesktopSidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                if (tab === "peringatan") {
                  setShowEmergencyFullscreen(true);
                } else if (tab === "tokens") {
                  setViewportMode("tokens");
                } else {
                  setCurrentTab(tab);
                }
              }}
              warningCount={1}
            />

            {/* Desktop Main Content Container */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Topbar */}
              <DesktopTopbar
                currentLocation={currentLocation}
                onLocationChange={(loc) => {
                  handleSelectLocation(loc);
                }}
                onOpenLocationModal={() => setShowLocationModal(true)}
                isOnline={isOnline}
                onToggleOnline={() => setIsOnline(!isOnline)}
                onOpenNotifications={() => setShowPushNotification(true)}
              />

              {/* Main Page Body */}
              <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
                {/* SCREEN A: DESKTOP BERANDA (DASHBOARD) */}
                {currentTab === "beranda" && (
                  <div className="space-y-6">
                    {/* Greeting & Subtitle matching visual reference */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#17211D]">
                          Halo, Adam 👋
                        </h1>
                        <p className="text-xs md:text-sm text-[#68756E] mt-1">
                          Pantau kondisi cuaca dan risiko bencana di wilayahmu agar selalu siap.
                        </p>
                      </div>

                      {!isOnline && (
                        <div className="bg-[#FEF1E6] text-[#C96B10] px-3 py-1 rounded-[10px] border border-[#FBD6B5] text-xs font-semibold flex items-center gap-1.5">
                          <span>Mode Offline Aktif (Menampilkan Cache Terakhir)</span>
                        </div>
                      )}
                    </div>

                    {/* Top Summary Row (3 Cards: Cuaca, Status Risiko, Peringatan Aktif) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <WeatherCard
                        weather={currentWeather}
                        isLoading={isLoadingWeather}
                        onRefresh={() => fetchWeather(currentLocation)}
                        onOpenLocationModal={() => setShowLocationModal(true)}
                      />
                      <RiskStatusCard
                        level={currentRisk.level}
                        location={currentLocation}
                        onViewRiskDetails={() => setCurrentTab("peta")}
                      />
                      <WarningCard
                        warning={dynamicWarning}
                        onOpenWarning={() => setShowEmergencyFullscreen(true)}
                      />
                    </div>

                    {/* 3 Shortcut Cards */}
                    <ShortcutCards onNavigate={(tab) => setCurrentTab(tab)} />

                  {/* Lower Row: 5-Day Forecast, Tindakan Cepat, Education Hero Banner */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    <div className="lg:col-span-5">
                      <ForecastSection forecast={forecastDays} />
                    </div>
                    <div className="lg:col-span-4">
                      <QuickActionPanel
                        onNavigate={(tab) => setCurrentTab(tab)}
                        onOpenSayaAman={() => setShowSayaAmanModal(true)}
                      />
                    </div>
                    <div className="lg:col-span-3">
                      <EducationBanner onNavigate={(tab) => setCurrentTab(tab)} />
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN B: DESKTOP PETA RISIKO & EVAKUASI */}
              {currentTab === "peta" && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#17211D]">
                        Peta Risiko & Evakuasi
                      </h1>
                      <p className="text-xs text-[#68756E] mt-0.5">
                        Pantau area berisiko dan temukan titik evakuasi di wilayahmu.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowOfflineModal(true)}
                      className="px-3.5 py-2 rounded-[10px] bg-white border border-[#CDD7D1] hover:bg-[#F8FAF9] text-xs font-semibold text-[#176B4D] flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <DownloadCloud className="w-4 h-4" />
                        <span>
                          {isMapOfflineDownloaded
                            ? "Peta Tersimpan Offline"
                            : "Unduh Peta Offline"}
                        </span>
                      </button>
                    </div>

                    {/* Interactive Map Filter Tabs */}
                    <div className="flex items-center justify-between border-b border-[#E6EBE8] pb-2">
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {[
                          { id: "evakuasi", label: "Peta & Titik Evakuasi" },
                          { id: "rute", label: "Rute Evakuasi" },
                          { id: "laporan", label: "Laporan Warga" },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setMapLayerTab(tab.id as any);
                              setShowRoute(tab.id === "rute");
                            }}
                            className={`px-4 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${mapLayerTab === tab.id
                                ? "bg-[#176B4D] text-white shadow-sm"
                                : "bg-white text-[#68756E] border border-[#E6EBE8] hover:bg-[#F8FAF9]"
                              }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {mapLayerTab === "laporan" && (
                        <button
                          onClick={() => fetchReports(userCoords?.lat, userCoords?.lng)}
                          disabled={isRefreshingReports}
                          className="px-3 py-1.5 rounded-[10px] text-xs font-bold bg-white hover:bg-[#F8FAF9] active:bg-[#EFF3F0] text-[#176B4D] border border-[#CDD7D1] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-60 shrink-0"
                          title="Segarkan pin laporan warga di peta"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingReports ? "animate-spin" : ""}`} />
                          <span className="hidden sm:inline">{isRefreshingReports ? "Memuat..." : "Segarkan Laporan"}</span>
                        </button>
                      )}
                    </div>

                    {/* Map Grid Layout (75% Map + 25% Detail Panel) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      <div className="lg:col-span-8">
                        <InteractiveRiskMap
                          evacuationPoints={currentEvacuationPoints}
                          communityReports={communityReports}
                          selectedPointId={selectedPoint?.id || currentEvacuationPoints[0]?.id}
                          focusTimestamp={focusTimestamp}
                          onSelectPoint={handleSelectEvacuationPoint}
                          showRoute={showRoute}
                          activeLayer={mapLayerTab}
                          locationName={currentLocation}
                          riskLevel={currentRisk.level}
                          userCoords={userCoords}
                          onUpdateCoords={setUserCoords}
                          onSelectCity={handleSelectLocation}
                          onLocateGPS={() => setShowLocationModal(true)}
                        />
                      </div>
                      <div className="lg:col-span-4 h-full">
                        <MapDetailsPanel
                          selectedArea={currentLocation}
                          riskLevel={currentRisk.level}
                          hujan24jMm={currentRisk.h24}
                          mukaAirStatus={currentRisk.mukaAirText}
                          weatherCondition={currentWeather.condition}
                          temp={currentWeather.temp}
                          humidity={currentWeather.humidity}
                          windSpeed={currentWeather.windSpeed}
                          evacuationPoints={currentEvacuationPoints}
                          selectedPointId={selectedPoint?.id || currentEvacuationPoints[0]?.id}
                          onSelectPoint={handleSelectEvacuationPoint}
                          onStartRouteNavigation={handleStartRouteNavigation}
                          onOpenOfflineDownload={() => setShowOfflineModal(true)}
                          isMapOfflineDownloaded={isMapOfflineDownloaded}
                          isGpsActive={Boolean(userCoords)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SCREEN D: LAPORAN WARGA */}
                {currentTab === "laporan" && (
                  <div className="relative min-h-[520px]">
                    <div
                      className={
                        isGuestMode
                          ? "filter blur-md select-none pointer-events-none opacity-40 transition-all duration-300"
                          : ""
                      }
                    >
                      <div className="space-y-4">
                        <div>
                          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#17211D]">
                            Forum Kondisi Lokal
                          </h1>
                          <p className="text-xs text-[#68756E] mt-0.5">
                            Bagikan dan periksa kondisi lapangan di sekitar wilayahmu secara terverifikasi.
                          </p>
                        </div>

                        <CommunityFeed
                          reports={communityReports}
                          onOpenCreateModal={() => {
                            if (isGuestMode) return;
                            setShowCreateReportModal(true);
                          }}
                          onNavigateToMap={(rep) => {
                            setCurrentTab("peta");
                            setMapLayerTab("laporan");
                          }}
                          onConfirmReport={handleConfirmReport}
                          onRefresh={() => fetchReports(userCoords?.lat, userCoords?.lng)}
                          isRefreshing={isRefreshingReports}
                        />
                      </div>
                    </div>

                    {isGuestMode && (
                      <LoginReminderOverlay
                        onBackToHome={() => setCurrentTab("beranda")}
                      />
                    )}
                  </div>
                )}

                {/* SCREEN E: MITIGASI & TAS SIAGA */}
                {currentTab === "mitigasi" && (
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#17211D]">
                        Panduan Mitigasi Bencana
                      </h1>
                      <p className="text-xs text-[#68756E] mt-0.5">
                        Kenali langkah yang tepat sebelum, saat, dan setelah bencana terjadi.
                      </p>
                    </div>

                    <MitigationGuide />
                  </div>
                )}

                {/* SCREEN PENGATURAN & PROFIL AKUN */}
                {currentTab === "pengaturan" && (
                  <div className="space-y-6 max-w-4xl pb-12">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#17211D]">
                        Pengaturan & Profil Akun
                      </h1>
                      <p className="text-xs text-[#68756E] mt-0.5">
                        Kelola profil identitas, hak privasi (UU PDP), penyimpanan peta offline, dan notifikasi darurat.
                      </p>
                    </div>

                    {/* KARTU PROFIL PENGGUNA */}
                    <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F4F2]">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-full bg-[#176B4D] text-white flex items-center justify-center font-bold text-base ring-4 ring-[#E5F5EA] shrink-0">
                            {user?.nama ? user.nama.trim().slice(0, 2).toUpperCase() : "WG"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-sm md:text-base font-bold text-[#17211D]">
                                {user?.nama || "Pengguna Siaga"}
                              </h2>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isGuest || user?.is_anonymous
                                    ? "bg-[#FEF1E6] text-[#C96B10]"
                                    : "bg-[#E5F5EA] text-[#176B4D]"
                                  }`}
                              >
                                {isGuest || user?.is_anonymous
                                  ? "Mode Tamu"
                                  : user?.role === "relawan"
                                    ? "Relawan Siaga"
                                    : user?.role === "admin"
                                      ? "Admin Wilayah"
                                      : "Pengguna Warga Terdaftar"}
                              </span>
                            </div>
                            <p className="text-xs text-[#68756E] mt-0.5">
                              {user?.email || (isGuest ? "Sesi penjelajahan tamu terbatas" : "Tidak ada email")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isGuest || user?.is_anonymous ? (
                            <a
                              href="/login"
                              className="py-2 px-3.5 rounded-[10px] bg-[#176B4D] hover:bg-[#12533B] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              <span>Daftar / Masuk Akun</span>
                            </a>
                          ) : (
                            <button
                              onClick={() => logout()}
                              className="py-2 px-3.5 rounded-[10px] bg-[#F8FAF9] hover:bg-[#F1F4F2] border border-[#CDD7D1] text-[#68756E] hover:text-[#17211D] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Keluar Sesi</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Detail Akun Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-[10px] bg-[#F8FAF9] border border-[#E6EBE8]">
                          <span className="text-[10px] uppercase font-bold text-[#68756E] block mb-1">
                            Status Identitas
                          </span>
                          <span className="font-semibold text-[#17211D] flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#176B4D]" />
                            {isGuest || user?.is_anonymous ? "Tamu Sementara" : "Terverifikasi Aktif"}
                          </span>
                        </div>
                        <div className="p-3 rounded-[10px] bg-[#F8FAF9] border border-[#E6EBE8]">
                          <span className="text-[10px] uppercase font-bold text-[#68756E] block mb-1">
                            Wilayah Pantauan
                          </span>
                          <span className="font-semibold text-[#17211D]">
                            {currentLocation}
                          </span>
                        </div>
                        <div className="p-3 rounded-[10px] bg-[#F8FAF9] border border-[#E6EBE8]">
                          <span className="text-[10px] uppercase font-bold text-[#68756E] block mb-1">
                            Perlindungan Data
                          </span>
                          <span className="font-semibold text-[#176B4D]">
                            UU PDP No. 27/2022
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LAYANAN OFFLINE & NOTIFIKASI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-sm space-y-3">
                        <h3 className="text-xs font-bold text-[#17211D]">Penyimpanan PWA Offline</h3>
                        <p className="text-xs text-[#68756E]">
                          Data peta vektor (PMTiles) dan checklist Tas Siaga disimpan secara lokal di peramban Anda untuk akses darurat tanpa internet.
                        </p>
                        <button
                          onClick={() => setShowOfflineModal(true)}
                          className="py-2 px-4 rounded-[10px] bg-[#176B4D] hover:bg-[#12533B] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <DownloadCloud className="w-4 h-4" />
                          <span>Kelola Peta Offline</span>
                        </button>
                      </div>

                      <div className="bg-white rounded-[16px] border border-[#E6EBE8] p-5 shadow-sm space-y-3">
                        <h3 className="text-xs font-bold text-[#17211D]">Notifikasi Peringatan Darurat</h3>
                        <p className="text-xs text-[#68756E]">
                          Menerima siaran push darurat saat terjadi potensi banjir bandang, gempa, atau cuaca ekstrem di sekitar wilayah Anda.
                        </p>
                        <button
                          onClick={() => setShowPushNotification(true)}
                          className="py-2 px-4 rounded-[10px] bg-[#F8FAF9] hover:bg-[#F1F8F3] border border-[#CDD7D1] text-[#176B4D] text-xs font-bold cursor-pointer transition-colors"
                        >
                          Tes Kirim Notifikasi Push
                        </button>
                      </div>
                    </div>

                    {/* ZONA BAHAYA: HAK PEMUSNAHAN DATA PRIBADI (UU PDP NO. 27 TAHUN 2022) */}
                    {!isGuest && !user?.is_anonymous ? (
                      <div className="bg-[#FFF8F8] rounded-[16px] border border-[#F9C1C1] p-5 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-[#D64545]">
                          <AlertTriangle className="w-4 h-4" />
                          <h3 className="text-xs font-bold uppercase tracking-wider">
                            Zona Bahaya: Hak Pemusnahan Data Pribadi (UU PDP)
                          </h3>
                        </div>
                        <p className="text-xs text-[#68756E] leading-relaxed">
                          Berdasarkan <strong>Pasal 8 & Pasal 43 UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong>, sebagai subjek data Anda berhak mengakhiri pemrosesan dan memusnahkan data pribadi Anda secara permanen. Menghapus akun akan memusnahkan akun, riwayat laporan warga, data foto/koordinat lapangan, dan preferensi Anda dari sistem kami tanpa dapat dipulihkan kembali.
                        </p>
                        <div className="pt-1">
                          <button
                            onClick={() => setShowDeleteAccountModal(true)}
                            className="py-2 px-4 rounded-[10px] bg-[#D64545] hover:bg-[#B83838] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Akun & Data Pribadi Permanen</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#F8FAF9] rounded-[16px] border border-[#E6EBE8] p-4 text-xs text-[#68756E] flex items-center justify-between">
                        <span>Anda saat ini menggunakan akun tamu sementara. Tidak ada data profil pribadi permanen yang tersimpan di server.</span>
                        <a href="/login" className="font-bold text-[#176B4D] hover:underline shrink-0 ml-3">
                          Daftar Akun Warga &rarr;
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </SidebarProvider>
      )}

      {/* Modals & Overlays */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
      />

      <SayaAmanModal
        isOpen={showSayaAmanModal}
        onClose={() => setShowSayaAmanModal(false)}
      />

      <CreateReportModal
        isOpen={showCreateReportModal}
        onClose={() => setShowCreateReportModal(false)}
        onSubmit={handleCreateReport}
        defaultLocationName={currentLocation}
        initialCoords={userCoords}
        onDetectGPS={(coords) => {
          if (!userCoords) {
            setUserCoords(coords);
          }
        }}
      />

      <OfflineMapModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        isDownloaded={isMapOfflineDownloaded}
        onDownloadComplete={() => setIsMapOfflineDownloaded(true)}
        onRemoveDownload={() => setIsMapOfflineDownloaded(false)}
      />

      {showPushNotification && (
        <NotificationBanner
          warning={dynamicWarning}
          onOpenWarning={() => {
            setShowPushNotification(false);
            setShowEmergencyFullscreen(true);
          }}
          onDismiss={() => setShowPushNotification(false)}
        />
      )}

      {/* Modal Konfirmasi Hapus Akun Permanen (UU PDP) */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl border border-[#CDD7D1]">
            <div className="flex items-center gap-3 text-[#D64545] mb-3">
              <div className="w-10 h-10 rounded-full bg-[#FDECEC] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#D64545]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17211D]">
                  Hapus Akun Permanen?
                </h3>
                <span className="text-[11px] text-[#68756E]">
                  Hak Pemusnahan Data Pribadi (UU No. 27 Tahun 2022 / UU PDP)
                </span>
              </div>
            </div>

            <p className="text-xs text-[#68756E] leading-relaxed mb-4">
              Tindakan ini akan <strong>menghapus permanen</strong> akun Anda beserta seluruh riwayat laporan lapangan, data profil, preferensi evakuasi, dan kontak darurat dari database SiagaKita. Data yang dihapus tidak dapat dipulihkan kembali.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F4F2]">
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setShowDeleteAccountModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#68756E] hover:bg-[#F8FAF9] rounded-[10px] transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={async () => {
                  setIsDeletingAccount(true);
                  try {
                    await logout();
                  } catch {
                    setIsDeletingAccount(false);
                    alert("Gagal menghapus akun. Silakan coba lagi.");
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#D64545] hover:bg-[#B83838] rounded-[10px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Permanen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
