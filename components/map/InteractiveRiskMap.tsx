"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { 
  Plus, 
  Minus, 
  Crosshair, 
  Layers, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { EvacuationPoint, CommunityReport } from "@/types";
import { getCityCoordinates } from "@/lib/evakuasi";
import { calculateHaversineDistance, findClosestBMKGRegion } from "@/lib/bmkg";

interface InteractiveRiskMapProps {
  evacuationPoints: EvacuationPoint[];
  communityReports: CommunityReport[];
  selectedPointId: string | null;
  focusTimestamp?: number;
  onSelectPoint: (point: EvacuationPoint) => void;
  showRoute: boolean;
  activeLayer: "evakuasi" | "rute" | "laporan" | "risiko";
  locationName?: string;
  riskLevel?: string;
  userCoords?: { lat: number; lng: number; accuracy?: number } | null;
  earthquakeCoords?: { lat: number; lng: number; magnitude: number; wilayah: string } | null;
  onUpdateCoords?: (coords: { lat: number; lng: number; accuracy?: number } | null) => void;
  onSelectCity?: (locationName: string, adm4Code?: string, coords?: { lat: number; lng: number; accuracy?: number }) => void;
}

export function InteractiveRiskMap({
  evacuationPoints,
  communityReports,
  selectedPointId,
  focusTimestamp,
  onSelectPoint,
  showRoute,
  activeLayer,
  locationName = "Kota Bandung",
  riskLevel = "aman",
  userCoords,
  earthquakeCoords,
  onUpdateCoords,
  onSelectCity,
}: InteractiveRiskMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string | null>(null);

  // Active city center coordinates
  const cityCoords = getCityCoordinates(locationName);

  // Check if user's GPS coords actually belong to the currently viewed city (within 35 km radius)
  const isUserInCurrentCity = Boolean(
    userCoords &&
    calculateHaversineDistance(userCoords.lat, userCoords.lng, cityCoords.lat, cityCoords.lng) < 35
  );

  // Active coordinates: only use userCoords if user is physically in the current city
  const activeLng = isUserInCurrentCity && userCoords ? userCoords.lng : cityCoords.lng;
  const activeLat = isUserInCurrentCity && userCoords ? userCoords.lat : cityCoords.lat;

  const selectedPoint = evacuationPoints.find((p) => p.id === selectedPointId) || evacuationPoints[0];

  // 1. Initialize MapLibre with genuine OpenStreetMap tiles
  useEffect(() => {
    let isCancelled = false;
    let mapInstance: any = null;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        const mapModule = (await import("maplibre-gl")) as any;
        const maplibregl = mapModule.default || mapModule;
        if (isCancelled || !mapContainerRef.current) return;

        // Pastikan worker URL diset ke berkas publik lokal agar Turbopack / Next.js tidak gagal memuat Web Worker
        if (typeof maplibregl.setWorkerUrl === "function") {
          maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");
        } else if (maplibregl.config) {
          maplibregl.config.WORKER_URL = "/maplibre-gl-worker.mjs";
        }

        // Tile styles menggunakan OpenStreetMap resmi multi-subdomain (100% Gratis, Tanpa API Key & Tanpa Watermark)
        const osmStyle = {
          version: 8,
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> kontributor',
            },
          },
          layers: [
            {
              id: "osm-tiles-layer",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        };

        mapInstance = new maplibregl.Map({
          container: mapContainerRef.current,
          style: osmStyle as any,
          center: [activeLng, activeLat],
          zoom: isUserInCurrentCity ? 15.5 : 13.5,
          pitch: 0,
          attributionControl: false,
        });

        mapInstance.on("load", () => {
          if (isCancelled) return;
          mapRef.current = mapInstance;
          setMapLoaded(true);

          // Route Source & Layer
          mapInstance.addSource("route-source", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [],
              },
              properties: {},
            },
          });

          // Route casing (white shadow)
          mapInstance.addLayer({
            id: "route-casing",
            type: "line",
            source: "route-source",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#FFFFFF",
              "line-width": 8.5,
              "line-opacity": 0.95,
            },
          });

          // Route line (primary navigation blue)
          mapInstance.addLayer({
            id: "route-line",
            type: "line",
            source: "route-source",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#2563EB",
              "line-width": 5.5,
            },
          });
        });
      } catch (err) {
        console.error("Gagal memuat MapLibre GL OpenStreetMap:", err);
      }
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Fly to position when locationName or userCoords changes
  const prevLocationRef = useRef(locationName);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    prevLocationRef.current = locationName;

    const coords = getCityCoordinates(locationName);

    // PRIORITAS 1: Jika GPS aktif dan koordinat presisi user tersedia di wilayah ini,
    // SELALU utamakan terbang langsung ke lokasi presisi GPS pengguna!
    if (userCoords && isUserInCurrentCity) {
      mapRef.current.flyTo({
        center: [userCoords.lng, userCoords.lat],
        zoom: 16.5,
        essential: true,
        speed: 1.4,
      });
    } else {
      // Jika GPS tidak aktif / user manual ganti kota dari dropdown:
      // Terbang ke pusat kota tersebut
      mapRef.current.flyTo({
        center: [coords.lng, coords.lat],
        zoom: 13.5,
        essential: true,
        speed: 1.3,
      });
    }
  }, [locationName, userCoords, isUserInCurrentCity, mapLoaded]);

  // 3. Update Navigation Route Line with Real Turn-by-Turn Road Network (OSRM)
  // HANYA gambar rute jika user secara fisik berada di kota tersebut (isUserInCurrentCity && userCoords)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const routeSource = mapRef.current.getSource("route-source");
    if (!routeSource) return;

    const isRouteActive = activeLayer === "rute";

    // Pastikan layer visibility selalu sinkron dengan tab aktif dan posisi user
    const shouldShowRouteLayer = isRouteActive && isUserInCurrentCity && Boolean(userCoords);
    if (mapRef.current.getLayer("route-line")) {
      mapRef.current.setLayoutProperty(
        "route-line",
        "visibility",
        shouldShowRouteLayer ? "visible" : "none"
      );
    }
    if (mapRef.current.getLayer("route-casing")) {
      mapRef.current.setLayoutProperty(
        "route-casing",
        "visibility",
        shouldShowRouteLayer ? "visibility" : "none"
      );
    }

    if (shouldShowRouteLayer && userCoords && selectedPoint && selectedPoint.lat && selectedPoint.lng) {
      const userCoord: [number, number] = [userCoords.lng, userCoords.lat];
      const targetCoord: [number, number] = [selectedPoint.lng, selectedPoint.lat];

      // Guard: do not draw routes spanning more than 35km across different cities
      const distKm = calculateHaversineDistance(userCoord[1], userCoord[0], targetCoord[1], targetCoord[0]);
      if (distKm > 35) {
        routeSource.setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates: [] },
          properties: {},
        });
        return;
      }

      let isCancelled = false;

      async function fetchRealRoadRoute() {
        try {
          // Ambil rute jalan raya resmi OpenStreetMap melalui OSRM Engine
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userCoord[0]},${userCoord[1]};${targetCoord[0]},${targetCoord[1]}?overview=full&geometries=geojson`;
          const res = await fetch(osrmUrl);
          if (!res.ok) throw new Error("OSRM status error");
          const data = await res.json();
          if (isCancelled || !mapRef.current) return;

          if (data.routes && data.routes[0]?.geometry?.coordinates?.length > 0) {
            const roadCoords = data.routes[0].geometry.coordinates;
            routeSource.setData({
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: roadCoords,
              },
              properties: {},
            });

            import("maplibre-gl").then((module: any) => {
              if (isCancelled || !mapRef.current) return;
              const maplibregl = module.default || module;
              const bounds = new maplibregl.LngLatBounds();
              roadCoords.forEach((c: [number, number]) => bounds.extend(c));
              mapRef.current.fitBounds(bounds, {
                padding: 70,
                maxZoom: 15.5,
                duration: 1000,
              });
            });
            return;
          }
        } catch (e) {
          console.warn("Gagal memuat rute jalan OSRM, fallback ke jalur langsung:", e);
        }

        // Fallback jika koneksi ke OSRM gagal
        if (!isCancelled && routeSource) {
          routeSource.setData({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [userCoord, targetCoord],
            },
            properties: {},
          });
        }
      }

      fetchRealRoadRoute();

      return () => {
        isCancelled = true;
      };
    } else {
      // User di luar kota atau GPS tidak aktif: Kosongkan rute sama sekali
      routeSource.setData({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [],
        },
        properties: {},
      });
    }
  }, [showRoute, activeLayer, selectedPoint, isUserInCurrentCity, userCoords, mapLoaded]);

  // 5. Render Evacuation Markers & User Pin (ONLY if user is physically in the viewed city)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    import("maplibre-gl").then((module: any) => {
      const maplibregl = module.default || module;

      // Clear existing evacuation markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }

      // Add Precise User Location Marker ONLY when GPS is active AND user is in the viewed city!
      if (isUserInCurrentCity && userCoords) {
        const userEl = document.createElement("div");
        userEl.className = "group relative flex items-center justify-center cursor-grab active:cursor-grabbing";
        userEl.innerHTML = `
          <div class="w-10 h-10 rounded-full bg-blue-500/25 animate-ping absolute"></div>
          <div class="w-6 h-6 rounded-full bg-[#2563EB] border-[3px] border-white shadow-xl flex items-center justify-center relative z-10">
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <div class="absolute -bottom-8 whitespace-nowrap bg-[#1E293B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none flex items-center gap-1">
            <span>📍 Lokasi Presisi Anda</span>
            <span class="text-[9px] text-[#93C5FD] font-normal">(Bisa digeser)</span>
          </div>
        `;

        const userMarker = new maplibregl.Marker({
          element: userEl,
          draggable: true,
        })
          .setLngLat([userCoords.lng, userCoords.lat])
          .addTo(mapRef.current);

        // Handle dragging the user marker for manual fine-tuning
        userMarker.on("dragend", () => {
          const lngLat = userMarker.getLngLat();
          if (onUpdateCoords) {
            onUpdateCoords({
              lat: lngLat.lat,
              lng: lngLat.lng,
              accuracy: 5, // manual fine-tuned
            });
          }
          setGpsStatusMsg("📍 Titik lokasi diperbarui secara manual!");
          setTimeout(() => setGpsStatusMsg(null), 3500);
        });

        userMarkerRef.current = userMarker;
      }

      // Add Evacuation Points Markers when viewing map (on "evakuasi" and "rute" tabs)
      if (activeLayer !== "laporan") {
        evacuationPoints.forEach((pt) => {
          if (!pt.lat || !pt.lng) return;

          const isSelected = pt.id === selectedPointId;
          const isHospital = pt.type === "Rumah Sakit";

          const markerEl = document.createElement("div");
          markerEl.className = `cursor-pointer flex flex-col items-center select-none ${
            isSelected ? "z-30" : "z-20"
          }`;

          // Pin Badge Pill + Circle
          markerEl.innerHTML = `
            <div class="bg-white/95 backdrop-blur-xs border ${
              isSelected ? "border-[#176B4D] ring-2 ring-[#176B4D]/30 shadow-md text-[#176B4D]" : "border-[#CDD7D1] shadow-xs text-[#17211D]"
            } rounded-[6px] px-2 py-0.5 mb-1 whitespace-nowrap max-w-[140px] truncate transition-colors">
              <span class="text-[10px] font-bold">${pt.name}</span>
            </div>
            <div class="w-7 h-7 rounded-full ${
              isHospital ? "bg-[#3983B9]" : "bg-[#176B4D]"
            } border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs transition-shadow hover:shadow-xl ${
              isSelected ? "ring-4 ring-[#176B4D]/40" : "hover:ring-2 hover:ring-[#176B4D]/30"
            }">
              ${isHospital ? "H" : "⌂"}
            </div>
          `;

          // Click handler
          markerEl.addEventListener("click", () => {
            onSelectPoint(pt);
            if (mapRef.current) {
              mapRef.current.easeTo({
                center: [pt.lng, pt.lat],
                zoom: Math.max(mapRef.current.getZoom(), 14.5),
                duration: 800,
              });
            }
          });

          const marker = new maplibregl.Marker({ 
            element: markerEl,
            anchor: "bottom",
          })
            .setLngLat([pt.lng, pt.lat])
            .addTo(mapRef.current);

          markersRef.current.push(marker);
        });
      }

      // Add Community Report Markers when activeLayer === "laporan"
      if (activeLayer === "laporan") {
        const categoryStyle: Record<string, { bg: string; emoji: string }> = {
          "Banjir":         { bg: "#2563EB", emoji: "🌊" },
          "Sungai Naik":    { bg: "#3983B9", emoji: "💧" },
          "Longsor":        { bg: "#92400E", emoji: "⛰️" },
          "Jalan Terputus": { bg: "#D97706", emoji: "🚧" },
          "Butuh Bantuan":  { bg: "#DC2626", emoji: "🆘" },
        };

        const validReports = communityReports.filter((r) => r.lat && r.lng);

        validReports.forEach((rep) => {
          const tipe = rep.category || rep.tipe || "Banjir";
          const style = categoryStyle[tipe] || { bg: "#64748B", emoji: "⚠️" };
          const isVerified = rep.status === "Terverifikasi" || rep.status === "terverifikasi";
          const label = rep.title || rep.tipe || "Laporan Warga";
          const timeStr = rep.timeAgo || "";
          const konfirmasi = rep.confirmationsCount ?? rep.konfirmasi_count ?? 0;

          const markerEl = document.createElement("div");
          markerEl.className = "cursor-pointer flex flex-col items-center select-none z-20 hover:z-30 group";
          markerEl.innerHTML = `
            <div class="bg-white/97 border border-[#E6EBE8] shadow-lg rounded-[10px] px-2.5 py-1.5 mb-1 max-w-[170px] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span class="text-[10px] font-bold text-[#17211D] block truncate">${label}</span>
              <div class="flex items-center justify-center gap-1 mt-0.5">
                <span class="text-[9px] ${isVerified ? "text-[#176B4D] font-bold" : "text-[#929D96]"}">
                  ${isVerified ? "✓ Terverifikasi" : "Dalam Verifikasi"}
                </span>
              </div>
              <span class="text-[9px] text-[#929D96]">👍 ${konfirmasi} konfirmasi${timeStr ? ` • ${timeStr}` : ""}</span>
            </div>
            <div class="w-9 h-9 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center text-base transition-transform group-hover:scale-110"
                 style="background-color: ${style.bg}">
              ${style.emoji}
            </div>
            <div class="w-1.5 h-2.5 rounded-b-sm" style="background-color: ${style.bg}"></div>
          `;

          const marker = new maplibregl.Marker({
            element: markerEl,
            anchor: "bottom",
          })
            .setLngLat([rep.lng!, rep.lat!])
            .addTo(mapRef.current);

          markersRef.current.push(marker);
        });

        // Fit map to show all report markers
        if (validReports.length > 0 && mapRef.current) {
          const bounds = new maplibregl.LngLatBounds();
          validReports.forEach((r) => bounds.extend([r.lng!, r.lat!]));
          mapRef.current.fitBounds(bounds, {
            padding: 80,
            maxZoom: 15,
            duration: 800,
          });
        }
      }

      // Render Earthquake Epicenter marker if earthquakeCoords are provided
      if (earthquakeCoords && typeof earthquakeCoords.lat === "number" && typeof earthquakeCoords.lng === "number" && mapRef.current) {
          const eqMarkerEl = document.createElement("div");
          eqMarkerEl.className = "cursor-pointer group flex flex-col items-center";
          eqMarkerEl.innerHTML = `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-8 h-8 rounded-full bg-rose-500/30 animate-ping"></span>
              <span class="absolute w-6 h-6 rounded-full bg-rose-500/50 animate-pulse"></span>
              <div class="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-lg border-2 border-white">
                M
              </div>
            </div>
            <div class="text-[9px] font-bold text-rose-700 bg-white/95 px-1.5 py-0.5 rounded shadow-sm border border-rose-200 mt-1 whitespace-nowrap">
              M ${earthquakeCoords.magnitude.toFixed(1)}
            </div>
          `;

          const eqPopup = new maplibregl.Popup({ offset: 15 }).setHTML(`
            <div class="p-2 text-xs">
              <div class="font-bold text-rose-600 flex items-center gap-1">
                <span>⚠️ Episentrum Gempa BMKG</span>
              </div>
              <div class="font-extrabold text-sm text-gray-900 mt-0.5">
                M ${earthquakeCoords.magnitude.toFixed(1)}
              </div>
              <div class="text-gray-600 text-[11px] mt-1">
                ${earthquakeCoords.wilayah}
              </div>
            </div>
          `);

          const eqMarker = new maplibregl.Marker({
            element: eqMarkerEl,
            anchor: "center",
          })
            .setLngLat([earthquakeCoords.lng, earthquakeCoords.lat])
            .setPopup(eqPopup)
            .addTo(mapRef.current);

          markersRef.current.push(eqMarker);
        }
      });
  }, [evacuationPoints, communityReports, selectedPointId, locationName, userCoords, earthquakeCoords, isUserInCurrentCity, mapLoaded, onSelectPoint, onUpdateCoords, activeLayer]);

  // 6. Smoothly pan/center map ONLY when an evacuation point is explicitly clicked/selected by user
  const prevFocusTimestampRef = useRef<number>(focusTimestamp || 0);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !selectedPointId) return;

    // Only pan if focusTimestamp actually increased (meaning the user explicitly clicked an evacuation point card/marker)
    if (!focusTimestamp || focusTimestamp <= prevFocusTimestampRef.current) {
      return;
    }
    prevFocusTimestampRef.current = focusTimestamp;

    const pt = evacuationPoints.find((p) => p.id === selectedPointId);
    if (pt && pt.lat && pt.lng) {
      const distToUser = calculateHaversineDistance(activeLat, activeLng, pt.lat, pt.lng);
      // If not in route mode, OR if distance is too far for a local route, center on the evacuation point
      if (!showRoute && activeLayer !== "rute") {
        mapRef.current.easeTo({
          center: [pt.lng, pt.lat],
          zoom: Math.max(mapRef.current.getZoom(), 14.8),
          duration: 800,
        });
      } else if (distToUser > 35) {
        mapRef.current.easeTo({
          center: [pt.lng, pt.lat],
          zoom: Math.max(mapRef.current.getZoom(), 14.8),
          duration: 800,
        });
      }
    }
  }, [selectedPointId, focusTimestamp, evacuationPoints, showRoute, activeLayer, activeLat, activeLng, mapLoaded]);

  // Request High Precision Hardware GPS Fix
  const handlePreciseGPS = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi lokasi Geolocation.");
      return;
    }

    setIsLocating(true);
    setGpsStatusMsg("Mendeteksi sinyal GPS presisi...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const precise = { lat: latitude, lng: longitude, accuracy: Math.round(accuracy) };
        
        // Find closest region to automatically align city & evacuation points with GPS!
        const result = findClosestBMKGRegion(latitude, longitude);

        if (onSelectCity) {
          onSelectCity(result.region.name, result.region.adm4, precise);
        } else if (onUpdateCoords) {
          onUpdateCoords(precise);
        }

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 16.5,
            speed: 1.5,
            essential: true,
          });
        }

        setGpsStatusMsg(`🎯 GPS Presisi: ${result.region.name} (±${Math.round(accuracy)}m)`);
        setTimeout(() => setGpsStatusMsg(null), 4000);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          alert("Izin GPS ditolak browser. Silakan aktifkan izin lokasi di address bar browser Anda.");
          setGpsStatusMsg("Izin GPS ditolak.");
        } else {
          alert("Gagal membaca GPS: " + err.message + ". Anda dapat menggeser pin lokasi secara manual.");
          setGpsStatusMsg("Gagal membaca GPS.");
        }
        setTimeout(() => setGpsStatusMsg(null), 3000);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0, // Force fresh hardware GPS measurement
      }
    );
  }, [onSelectCity, onUpdateCoords]);

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  return (
    <div className="relative w-full h-[580px] bg-[#E9EFEA] rounded-[16px] overflow-hidden border border-[#CDD7D1] shadow-inner select-none">
      {/* Real MapLibre GL OpenStreetMap Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Loading Overlay while OpenStreetMap Tiles Init */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-[#E9EFEA] flex flex-col items-center justify-center gap-3 z-40">
          <Loader2 className="w-8 h-8 text-[#176B4D] animate-spin" />
          <div className="text-xs font-semibold text-[#17211D]">
            Menyiapkan Peta OpenStreetMap ({locationName})...
          </div>
        </div>
      )}

      {/* Top Notification: Toast mengambang ketika GPS aktif atau diperbarui */}
      {gpsStatusMsg && (
        <div className="absolute top-4 left-4 z-20 bg-[#1E293B]/95 backdrop-blur-sm text-white text-xs font-medium px-3.5 py-2 rounded-[12px] shadow-xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 max-w-[90%]">
          <Crosshair className="w-4 h-4 text-[#34D399] shrink-0 animate-pulse" />
          <span>{gpsStatusMsg}</span>
        </div>
      )}

      {/* Banner ketika user melihat tab rute di luar kawasan fisiknya */}
      {activeLayer === "rute" && !isUserInCurrentCity && (
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-[14px] border border-[#E6EBE8] shadow-lg flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-[#17211D] block">Navigasi Rute Belum Aktif</span>
            <span className="text-[#68756E] text-[11px] leading-relaxed block mt-0.5">
              {userCoords
                ? `Lokasi fisik Anda berada di luar wilayah ${locationName}. Rute evakuasi darurat hanya aktif untuk kawasan tempat tinggal Anda.`
                : `Aktifkan tombol GPS (ikon bidik) untuk menghitung rute langsung dari posisi Anda saat ini.`}
            </span>
          </div>
        </div>
      )}

      {/* Map Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-[14px] p-3 border border-[#E6EBE8] shadow-md z-10 text-xs max-w-[220px]">
        <div className="font-bold text-[#17211D] mb-1.5 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#176B4D]" />
            <span>Peta {locationName}</span>
          </div>
          <span className="text-[9px] text-[#176B4D] bg-[#E5F5EA] px-1.5 py-0.2 rounded font-semibold">
            {activeLayer === "rute" ? (isUserInCurrentCity ? "Navigasi Rute" : "Info Wilayah") : activeLayer === "laporan" ? "Laporan Warga" : "Peta Evakuasi"}
          </span>
        </div>

        <div className="text-[10px] text-[#68756E] mb-1 font-semibold">Status Wilayah (Live BMKG):</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 text-[10px]">
          <div className={`flex items-center gap-1.5 ${riskLevel === "aman" ? "font-bold text-[#176B4D]" : "text-[#68756E]"}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#176B4D]" />
            <span>Aman</span>
          </div>
          <div className={`flex items-center gap-1.5 ${riskLevel === "waspada" ? "font-bold text-[#D9A514]" : "text-[#68756E]"}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A514]" />
            <span>Waspada</span>
          </div>
          <div className={`flex items-center gap-1.5 ${riskLevel === "siaga" ? "font-bold text-[#D64545]" : "text-[#68756E]"}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#D64545]" />
            <span>Siaga</span>
          </div>
          <div className={`flex items-center gap-1.5 ${riskLevel === "awas" ? "font-bold text-[#991B1B]" : "text-[#68756E]"}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#991B1B]" />
            <span>Awas</span>
          </div>
        </div>

        <div className="border-t border-[#F1F4F2] pt-1.5 space-y-1 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#176B4D] text-white flex items-center justify-center text-[8px] font-bold">⌂</span>
            <span>Titik Evakuasi ({evacuationPoints.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#3983B9] text-white flex items-center justify-center text-[8px] font-bold">H</span>
            <span>Rumah Sakit / Medis</span>
          </div>

          {isUserInCurrentCity && userCoords && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2563EB] ring-2 ring-white" />
              <span className="font-semibold text-[#17211D]">Posisi Presisi Anda</span>
            </div>
          )}

          {activeLayer === "rute" && isUserInCurrentCity && userCoords && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-3.5 h-1 rounded bg-[#2563EB]" />
              <span className="font-semibold text-[#2563EB]">Rute Jalan Raya (OSRM)</span>
            </div>
          )}

          {earthquakeCoords && (
            <div className="flex items-center gap-1.5 pt-0.5 border-t border-[#F1F4F2]">
              <span className="w-3 h-3 rounded-full bg-rose-600 ring-2 ring-rose-200 animate-pulse" />
              <span className="font-semibold text-rose-700 text-[10px]">
                Episentrum M {earthquakeCoords.magnitude.toFixed(1)}
              </span>
            </div>
          )}

          {activeLayer === "laporan" && (
            <div className="space-y-1 pt-0.5 border-t border-[#F1F4F2]">
              <div className="text-[9px] font-bold text-[#68756E] uppercase tracking-wide mb-0.5">Jenis Laporan:</div>
              {[
                { bg: "#2563EB", emoji: "🌊", label: "Banjir" },
                { bg: "#D97706", emoji: "🚧", label: "Jalan Terputus" },
                { bg: "#DC2626", emoji: "🆘", label: "Butuh Bantuan" },
                { bg: "#92400E", emoji: "⛰️", label: "Longsor" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full border-2 border-white shadow flex items-center justify-center text-[9px]"
                        style={{ backgroundColor: item.bg }}>
                    {item.emoji}
                  </span>
                  <span className="text-[10px]">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Map Controls (Top-Right) */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-[8px] bg-white border border-[#CDD7D1] shadow-sm flex items-center justify-center text-[#17211D] hover:bg-[#F8FAF9] active:scale-95 transition-all cursor-pointer"
          title="Perbesar Peta (Zoom In)"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-[8px] bg-white border border-[#CDD7D1] shadow-sm flex items-center justify-center text-[#17211D] hover:bg-[#F8FAF9] active:scale-95 transition-all cursor-pointer"
          title="Perkecil Peta (Zoom Out)"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handlePreciseGPS}
          disabled={isLocating}
          className="w-8 h-8 rounded-[8px] bg-white border border-[#CDD7D1] shadow-sm flex items-center justify-center text-[#2563EB] hover:bg-[#EFF6FF] active:scale-95 transition-all cursor-pointer disabled:opacity-60"
          title="Kunci GPS Presisi Tinggi"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
          ) : (
            <Crosshair className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Official OpenStreetMap Attribution (Bottom-Right) */}
      <div className="absolute bottom-2 right-3 text-[10px] text-[#68756E] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-[#E6EBE8] shadow-xs z-10 flex items-center gap-1">
        <span>MapLibre GL JS</span>
        <span>•</span>
        <span>© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#176B4D] font-medium">OpenStreetMap</a> contributors</span>
      </div>
    </div>
  );
}
