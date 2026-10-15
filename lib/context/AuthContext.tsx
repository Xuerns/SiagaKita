"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface AuthUser {
  id: string;
  email?: string | null;
  nama: string;
  role: "warga" | "relawan" | "admin";
  is_anonymous?: boolean;
}

export interface UserProfile {
  id: string;
  nama: string;
  role: "warga" | "relawan" | "admin";
  no_telepon?: string | null;
  alamat?: string | null;
  region_id?: string | null;
  preferensi_notifikasi?: {
    push_darurat?: boolean;
    sms_darurat?: boolean;
    radius_km?: number;
  } | null;
  lokasi_terakhir?: {
    lat: number;
    lng: number;
  } | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
  refreshAuth: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        setIsGuest(false);
        return;
      }

      const data = await res.json();
      if (data.isAuthenticated && data.user) {
        setUser(data.user);
        setProfile(data.profile || null);
        setIsAuthenticated(true);
        setIsGuest(Boolean(data.isGuest || data.user.is_anonymous));
      } else {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        setIsGuest(false);
      }
    } catch (err) {
      console.warn("Gagal mengambil sesi akun pengguna:", err);
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      setIsGuest(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Gagal melakukan panggilan logout:", err);
    } finally {
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      setIsGuest(false);
      setIsLoading(false);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated,
        isGuest,
        isLoading,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
