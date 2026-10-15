"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker registered with scope:", registration.scope);

            // Periksa pembaruan berkala setiap 1 jam
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);
          })
          .catch((error) => {
            console.warn("[PWA] Service Worker registration failed:", error);
          });
      });

      // Tangkap event sebelum prompt install muncul
      window.addEventListener("beforeinstallprompt", (e) => {
        // Simpan event ke window agar dapat dipicu manual jika diinginkan
        (window as unknown as { deferredPrompt?: Event }).deferredPrompt = e;
        console.log("[PWA] beforeinstallprompt captured! SiagaKita siap diinstall.");
      });
    }
  }, []);

  return null;
}
