"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getAdm4ByLocation, findClosestBMKGRegion } from "@/lib/bmkg";
import { hitungSkorBanjir } from "@/lib/risiko";
import { getEvacuationPointsForLocation, getDefaultCoordinatesForLocation } from "@/lib/evakuasi";
import {
  DesktopSidebar,
  NavTab
} from "@/components/layout/DesktopSidebar";
import { DesktopTopbar } from "@/components/layout/DesktopTopbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesktopHomeView } from "@/components/dashboard/DesktopHomeView";
import { DesktopMapView } from "@/components/map/DesktopMapView";
import { DesktopProfileView } from "@/components/profile/DesktopProfileView";
import { DeleteAccountModal } from "@/components/profile/DeleteAccountModal";
import { OfflineMapModal } from "@/components/map/OfflineMapModal";
import { getMetadata } from "@/lib/offline/db";
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
import { type ViewportMode } from "@/components/preview/DeviceViewportSwitcher";
import { DesignSystemViewer } from "@/components/preview/DesignSystemViewer";
import { SayaAmanModal } from "@/components/ui/SayaAmanModal";
import { NotificationBanner } from "@/components/ui/NotificationBanner";
import { RiskAlertModal } from "@/components/ui/RiskAlertModal";
import { LocationSelectorModal } from "@/components/location/LocationSelectorModal";
import { useAuth } from "@/lib/context/AuthContext";
import { LoginReminderOverlay } from "@/components/auth/LoginReminderOverlay";
import {
  mockCurrentWeather,
  mockForecast5Days,
  mockActiveWarning,
  mockEmergencyFullWarning,
  mockCommunityReports
} from "@/data/mockDisasterData";
import { EvacuationPoint, CommunityReport, WeatherCurrent, ForecastDay, ActiveWarning, EarthquakeData } from "@/types";


export default function SiagaKitaApp() {
  // Auth State
  const { user, isAuthenticated, isGuest, isLoading: isAuthLoading, logout, deleteAccount } = useAuth();
  const isGuestMode = !isAuthLoading && (!isAuthenticated || isGuest);

  // Navigation & Viewport State
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [currentTab, setCurrentTab] = useState<NavTab>("beranda");
  const [mobileTab, setMobileTab] = useState<MobileTab>("beranda");
  const [mobileSubScreen, setMobileSubScreen] = useState<"default" | "peringatan" | "rute">("default");

  // App & Data States - Menggunakan wilayah asli (default Kota Bandung) dengan data BMKG riil
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

  // Periksa apakah peta offline pernah diunduh dan tersimpan di IndexedDB
  useEffect(() => {
    let mounted = true;
    getMetadata("offline_map_downloaded").then((meta) => {
      if (mounted && meta) {
        setIsMapOfflineDownloaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // BMKG Weather States
  const [currentWeather, setCurrentWeather] = useState<WeatherCurrent>(mockCurrentWeather);
  const [forecastDays, setForecastDays] = useState<ForecastDay[]>(mockForecast5Days);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // BMKG Real-time Earthquake States
  const [latestEarthquake, setLatestEarthquake] = useState<EarthquakeData | null>(null);
  const [isLoadingEarthquake, setIsLoadingEarthquake] = useState<boolean>(false);

  // Fetch BMKG Weather dynamically dari API BMKG riil
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

  // Fetch BMKG Real-time Earthquake dynamically
  const fetchEarthquake = useCallback(async (location?: string, coords?: { lat: number; lng: number } | null) => {
    try {
      setIsLoadingEarthquake(true);
      let url = "/api/gempa?type=latest";
      if (coords && typeof coords.lat === "number" && typeof coords.lng === "number") {
        url += `&lat=${coords.lat}&lng=${coords.lng}`;
      } else if (location) {
        url += `&location=${encodeURIComponent(location)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil data gempa BMKG");
      const json = await res.json();
      if (json.latest) {
        setLatestEarthquake(json.latest);
      }
    } catch (err) {
      console.warn("Gagal memuat gempa dari BMKG API:", err);
    } finally {
      setIsLoadingEarthquake(false);
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
        const mappedReports: CommunityReport[] = json.reports.map((r: any) => ({
          id: r.id,
          userName: r.userName || r.user_name || "Warga Siaga",
          category: (r.category || r.tipe || "Banjir") as any,
          tipe: r.tipe || r.category || "Banjir",
          title: r.title || r.tipe || "Laporan Lapangan",
          description: r.description || r.deskripsi || "",
          deskripsi: r.deskripsi || r.description || "",
          locationName:
            r.locationName ||
            r.location_name ||
            (typeof r.lat === "number" && typeof r.lng === "number"
              ? findClosestBMKGRegion(r.lat, r.lng).region.name
              : "Kota Bandung"),
          timeAgo: r.timeAgo || (r.created_at ? new Date(r.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "Baru saja"),
          status: (r.status === "terverifikasi" ? "Terverifikasi" : "Dalam Verifikasi") as any,
          confirmationsCount: r.confirmationsCount ?? r.konfirmasi_count ?? 0,
          konfirmasi_count: r.confirmationsCount ?? r.konfirmasi_count ?? 0,
          foto_urls: r.foto_urls || [],
          lat: r.lat,
          lng: r.lng,
          userConfirmed: Boolean(r.userConfirmed),
        }));
        setCommunityReports(mappedReports);
      }
    } catch (err) {
      console.warn("Gagal mengambil data laporan dari /api/laporan:", err);
    } finally {
      setIsRefreshingReports(false);
    }
  }, []);

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
    fetchEarthquake(locationName, preciseCoords || null);
  };

  // Muat data cuaca BMKG untuk lokasi saat ini
  useEffect(() => {
    fetchWeather(currentLocation);
    fetchReports(userCoords?.lat, userCoords?.lng);
    fetchEarthquake(currentLocation, userCoords);
  }, [currentLocation, userCoords, fetchWeather, fetchReports, fetchEarthquake]);

  // Deteksi lokasi asli pengguna secara otomatis via GPS browser jika diizinkan
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const nearest = findClosestBMKGRegion(latitude, longitude);
          if (nearest?.region) {
            setCurrentLocation(nearest.region.name);
            setUserCoords({ lat: latitude, lng: longitude, accuracy });
            fetchWeather(nearest.region.name, nearest.region.adm4);
          }
        },
        (err) => {
          // Jika GPS ditolak atau timeout, tetap gunakan lokasi default (Kota Bandung)
          console.info("Info: GPS browser tidak aktif, menggunakan lokasi awal:", err.message);
        },
        { timeout: 6000, maximumAge: 60000 }
      );
    }
  }, [fetchWeather]);

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
  // Account Deletion Modal
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);

  // warningDismissed: true = user sudah konfirmasi "Saya Aman" → badge sidebar hilang & modal/notif tidak muncul lagi
  const [warningDismissed, setWarningDismissed] = useState<boolean>(false);
  // showRiskAlertModal: popup modal untuk risiko tinggi (siaga/awas)
  const [showRiskAlertModal, setShowRiskAlertModal] = useState<boolean>(false);
  // modalAlertWarning: jika null gunakan dynamicWarning (data asli BMKG), jika diisi gunakan data simulasi
  const [modalAlertWarning, setModalAlertWarning] = useState<ActiveWarning | null>(null);
  // hasAutoShownAlert: agar alert otomatis hanya muncul sekali per sesi
  const [hasAutoShownAlert, setHasAutoShownAlert] = useState<boolean>(false);

  // Auto-show notifikasi berdasarkan level risiko asli BMKG setelah data cuaca selesai dimuat
  useEffect(() => {
    if (isLoadingWeather || warningDismissed) return;

    const level = currentRisk.level;

    if ((level === "siaga" || level === "awas") && !hasAutoShownAlert) {
      const t = setTimeout(() => {
        setModalAlertWarning(null);
        setShowRiskAlertModal(true);
        setHasAutoShownAlert(true);
      }, 400);
      return () => clearTimeout(t);
    }

    if (level === "waspada" && !hasAutoShownAlert) {
      const t = setTimeout(() => {
        setShowPushNotification(true);
        setHasAutoShownAlert(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [currentRisk.level, isLoadingWeather, hasAutoShownAlert, warningDismissed]);

  // Reset saat lokasi berubah agar notifikasi riil muncul kembali
  useEffect(() => {
    setHasAutoShownAlert(false);
    setWarningDismissed(false);
    setShowRiskAlertModal(false);
    setModalAlertWarning(null);
    setShowPushNotification(false);
  }, [currentLocation]);

  // Handler uji coba pop-up peringatan risiko tinggi (manual dari sidebar)
  const handleTriggerTestRiskAlert = () => {
    const testWarning: ActiveWarning = {
      id: `test-warn-siaga-${Date.now()}`,
      title: `Peringatan Dini Banjir Bandang & Cuaca Ekstrem`,
      hazardType: "Banjir Bandang & Luapan Sungai",
      level: "Siaga",
      affectedArea: currentLocation,
      validPeriod: "Berlaku hingga 3 jam ke depan",
      issuedTime: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      source: "Simulasi",
      description: `Curah hujan ekstrem dan kenaikan debit air sungai berpotensi menimbulkan banjir di wilayah ${currentLocation}.`,
      whatHappened: `Hujan lebat disertai angin kencang berdurasi panjang menyebabkan kenaikan tinggi muka air sungai secara drastis di wilayah ${currentLocation}. Ketinggian genangan air berpotensi mencapai 60-120 cm.`,
      whereLocation: `Kawasan bantaran sungai dan permukiman dataran rendah di ${currentLocation}.`,
      howSevere: "Tingkat Risiko Tinggi (Level Siaga). Seluruh warga di sekitar aliran air diimbau segera bersiap evakuasi mandiri.",
      instructions: [
        "Pindahkan dokumen penting dan barang elektronik ke area yang lebih tinggi.",
        "Matikan sekring listrik utama dan cabut regulator tabung gas.",
        "Prioritaskan keselamatan lansia, anak-anak, dan anggota keluarga rentan.",
        "Segera menuju ke Titik Kumpul / Tempat Evakuasi Sementara (TES) terdekat.",
      ],
      isDemoSimulation: true,
    };
    setModalAlertWarning(testWarning);
    setShowRiskAlertModal(true);
  };

  // Handler konfirmasi Saya Aman → tutup semua peringatan & hilangkan badge
  const handleSayaAmanConfirmed = () => {
    setWarningDismissed(true);
    setShowRiskAlertModal(false);
    setModalAlertWarning(null);
    setShowPushNotification(false);
    setShowSayaAmanModal(true);
  };

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

    const previousCount = target.confirmationsCount ?? 0;
    const previousStatus = target.status;

    // 2. Tandai secara optimis: userConfirmed = true, konfirmasi bertambah 1
    setCommunityReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId
          ? {
            ...rep,
            confirmationsCount: previousCount + 1,
            userConfirmed: true,
          }
          : rep
      )
    );

    // 3. Panggil database API
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
      } else {
        // Rollback jika server menolak
        setCommunityReports((prev) =>
          prev.map((rep) =>
            rep.id === reportId
              ? {
                ...rep,
                confirmationsCount: previousCount,
                status: previousStatus,
                userConfirmed: false,
              }
              : rep
          )
        );
      }
    } catch (err) {
      console.warn("Gagal mengirim konfirmasi laporan ke API database:", err);
      // Rollback jika terjadi network error
      setCommunityReports((prev) =>
        prev.map((rep) =>
          rep.id === reportId
            ? {
              ...rep,
              confirmationsCount: previousCount,
              status: previousStatus,
              userConfirmed: false,
            }
            : rep
        )
      );
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
      locationName:
        newRep.locationName ||
        (typeof reportLat === "number" && typeof reportLng === "number"
          ? findClosestBMKGRegion(reportLat, reportLng).region.name
          : currentLocation),
      timeAgo: "Baru saja",
      status: "Dalam Verifikasi", // Crucial rule
      confirmationsCount: 1,
      lat: reportLat,
      lng: reportLng,
      foto_urls: newRep.foto_urls || [],
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
          foto_urls: newRep.foto_urls || [],
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
                  warning={dynamicWarning}
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
                  earthquake={latestEarthquake}
                  onNavigateTab={(tab) => setMobileTab(tab)}
                  onOpenWarningDetail={() => setMobileSubScreen("peringatan")}
                  onOpenSayaAman={() => setShowSayaAmanModal(true)}
                  onOpenOfflineMap={() => setShowOfflineModal(true)}
                  onViewOnMap={(lat, lng) => {
                    if (typeof lat === "number" && typeof lng === "number") {
                      setUserCoords({ lat, lng });
                    }
                    setMobileTab("peta");
                  }}
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
                warningCount={warningDismissed ? 0 : (currentRisk.level === "aman" ? 0 : 1)}
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
                if (tab === "tokens") {
                  setViewportMode("tokens");
                } else {
                  setCurrentTab(tab);
                }
              }}
              warningCount={warningDismissed ? 0 : (currentRisk.level === "aman" ? 0 : 1)}
              onTestRiskAlert={handleTriggerTestRiskAlert}
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
                  <DesktopHomeView
                    userName={user?.nama}
                    isOnline={isOnline}
                    currentWeather={currentWeather}
                    isLoadingWeather={isLoadingWeather}
                    onRefreshWeather={() => fetchWeather(currentLocation)}
                    onOpenLocationModal={() => setShowLocationModal(true)}
                    currentLocation={currentLocation}
                    currentRiskLevel={currentRisk.level}
                    dynamicWarning={dynamicWarning}
                    onOpenWarning={() => setShowEmergencyFullscreen(true)}
                    latestEarthquake={latestEarthquake}
                    isLoadingEarthquake={isLoadingEarthquake}
                    forecastDays={forecastDays}
                    onNavigateTab={(tab) => setCurrentTab(tab)}
                    onOpenSayaAman={() => setShowSayaAmanModal(true)}
                  />
                )}

                {/* SCREEN B: DESKTOP PETA RISIKO & EVAKUASI */}
                {currentTab === "peta" && (
                  <DesktopMapView
                    currentLocation={currentLocation}
                    currentRisk={currentRisk}
                    currentWeather={currentWeather}
                    currentEvacuationPoints={currentEvacuationPoints}
                    communityReports={communityReports}
                    selectedPoint={selectedPoint}
                    focusTimestamp={focusTimestamp}
                    showRoute={showRoute}
                    mapLayerTab={mapLayerTab}
                    onSelectMapLayerTab={(tab) => {
                      setMapLayerTab(tab);
                      setShowRoute(tab === "rute");
                    }}
                    onSelectPoint={handleSelectEvacuationPoint}
                    onStartRouteNavigation={handleStartRouteNavigation}
                    onOpenOfflineModal={() => setShowOfflineModal(true)}
                    isMapOfflineDownloaded={isMapOfflineDownloaded}
                    userCoords={userCoords}
                    latestEarthquake={latestEarthquake}
                    onUpdateCoords={setUserCoords}
                    onSelectCity={handleSelectLocation}
                    onRefreshReports={() => fetchReports(userCoords?.lat, userCoords?.lng)}
                    isRefreshingReports={isRefreshingReports}
                  />
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
                            if (rep.lat && rep.lng) {
                              setUserCoords({ lat: rep.lat, lng: rep.lng });
                            }
                            setCurrentTab("peta");
                            setMapLayerTab("laporan");
                            setFocusTimestamp(Date.now());
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
                  <DesktopProfileView
                    user={user}
                    isGuest={isGuest}
                    currentLocation={currentLocation}
                    onLogout={() => logout()}
                    onOpenOfflineModal={() => setShowOfflineModal(true)}
                    onOpenNotifications={() => setShowPushNotification(true)}
                    onOpenDeleteModal={() => setShowDeleteAccountModal(true)}
                  />
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
        points={currentEvacuationPoints}
      />

      {/* Web Push Notification — untuk risiko sedang (waspada) */}
      {showPushNotification && (
        <NotificationBanner
          warning={dynamicWarning}
          onOpenWarning={() => {
            setShowPushNotification(false);
            // Klik dari notifikasi → tampilkan detail lengkap
            const level = currentRisk.level;
            if (level === "siaga" || level === "awas") {
              setShowRiskAlertModal(true);
            } else {
              setShowEmergencyFullscreen(true);
            }
          }}
          onDismiss={() => setShowPushNotification(false)}
        />
      )}

      {/* Modal Konfirmasi Hapus Akun Permanen (UU PDP) */}
      <DeleteAccountModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        isDeleting={isDeletingAccount}
        onConfirmDelete={async () => {
          setIsDeletingAccount(true);
          const ok = await deleteAccount();
          if (!ok) {
            setIsDeletingAccount(false);
            alert("Gagal menghapus akun. Silakan coba lagi.");
          }
        }}
      />

      {/* Risk Alert Modal — card kecil/sedang untuk risiko tinggi (siaga/awas), singkat padat jelas */}
      {showRiskAlertModal && !warningDismissed && (
        <RiskAlertModal
          warning={modalAlertWarning || dynamicWarning}
          onClose={() => {
            setShowRiskAlertModal(false);
            setModalAlertWarning(null);
          }}
          onConfirmSayaAman={handleSayaAmanConfirmed}
          onNavigateToEvacuationRoute={() => {
            setShowRiskAlertModal(false);
            setModalAlertWarning(null);
            setCurrentTab("peta");
            setMobileTab("peta");
            handleStartRouteNavigation();
          }}
          onOpenMitigationGuide={() => {
            setShowRiskAlertModal(false);
            setModalAlertWarning(null);
            setCurrentTab("mitigasi");
            setMobileTab("mitigasi");
          }}
        />
      )}
    </div>
  );
}
