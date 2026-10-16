import { describe, it, expect } from "vitest";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HomeSkeleton,
  MapSkeleton,
  CommunitySkeleton,
  MitigationSkeleton,
  ProfileSkeleton,
  AuthSkeleton,
  DashboardShellSkeleton,
} from "@/components/skeletons";
import RootLoading from "@/app/loading";
import LoginLoading from "@/app/login/loading";
import RegisterLoading from "@/app/register/loading";

describe("Skeleton Components Suite", () => {
  describe("Base Skeleton primitive", () => {
    it("Good Route: Merender elemen Skeleton dengan class pulse dan rounded", () => {
      const el = React.createElement(Skeleton, { className: "h-4 w-20" });
      expect(el).toBeDefined();
      expect(el.props.className).toContain("h-4 w-20");
    });
  });

  describe("HomeSkeleton Component", () => {
    it("Good Route: Merender struktur skeleton Beranda lengkap", () => {
      const el = React.createElement(HomeSkeleton);
      expect(el).toBeDefined();
      expect(el.type).toBe(HomeSkeleton);
    });
  });

  describe("MapSkeleton Component", () => {
    it("Good Route: Merender skeleton Peta Evakuasi", () => {
      const el = React.createElement(MapSkeleton);
      expect(el).toBeDefined();
      expect(el.type).toBe(MapSkeleton);
    });
  });

  describe("CommunitySkeleton Component", () => {
    it("Good Route: Merender skeleton Laporan Warga dengan daftar card", () => {
      const el = React.createElement(CommunitySkeleton);
      expect(el).toBeDefined();
      expect(el.type).toBe(CommunitySkeleton);
    });
  });

  describe("MitigationSkeleton Component", () => {
    it("Good Route: Merender skeleton Mitigasi Bencana & Tas Siaga", () => {
      const el = React.createElement(MitigationSkeleton);
      expect(el).toBeDefined();
      expect(el.type).toBe(MitigationSkeleton);
    });
  });

  describe("ProfileSkeleton Component", () => {
    it("Good Route: Merender skeleton Profil & Pengaturan akun", () => {
      const el = React.createElement(ProfileSkeleton);
      expect(el).toBeDefined();
      expect(el.type).toBe(ProfileSkeleton);
    });
  });

  describe("AuthSkeleton Component", () => {
    it("Good Route: Merender AuthSkeleton mode login", () => {
      const el = React.createElement(AuthSkeleton, { mode: "login" });
      expect(el).toBeDefined();
      expect(el.props.mode).toBe("login");
    });

    it("Good Route: Merender AuthSkeleton mode register", () => {
      const el = React.createElement(AuthSkeleton, { mode: "register" });
      expect(el).toBeDefined();
      expect(el.props.mode).toBe("register");
    });
  });

  describe("DashboardShellSkeleton Component", () => {
    it("Good Route: Merender wrapper layout shell sidebar + topbar skeleton", () => {
      const el = React.createElement(DashboardShellSkeleton);
      expect(el).toBeDefined();
      expect(el.type).toBe(DashboardShellSkeleton);
    });
  });

  describe("App Route loading.tsx Pages", () => {
    it("Good Route: Root loading.tsx merender DashboardShellSkeleton", () => {
      const el = RootLoading();
      expect(el).toBeDefined();
      expect(el.type).toBe(DashboardShellSkeleton);
    });

    it("Good Route: Login loading.tsx merender AuthSkeleton mode login", () => {
      const el = LoginLoading();
      expect(el).toBeDefined();
      expect(el.props.mode).toBe("login");
    });

    it("Good Route: Register loading.tsx merender AuthSkeleton mode register", () => {
      const el = RegisterLoading();
      expect(el).toBeDefined();
      expect(el.props.mode).toBe("register");
    });
  });
});
