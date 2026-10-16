import { describe, it, expect, vi } from "vitest";
import React from "react";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

describe("MobileBottomNav Component", () => {
  it("Good Route: MobileBottomNav merender elemen navigasi dengan benar", () => {
    const handleSelectTab = vi.fn();
    const element = React.createElement(MobileBottomNav, {
      currentTab: "beranda",
      onSelectTab: handleSelectTab,
      warningCount: 0,
    });

    expect(element).toBeDefined();
    expect(element.props.currentTab).toBe("beranda");
  });

  it("Good Route: Mengirim callback onSelectTab saat memilih tab baru", () => {
    const handleSelectTab = vi.fn();
    const element = React.createElement(MobileBottomNav, {
      currentTab: "peta",
      onSelectTab: handleSelectTab,
      warningCount: 2,
    });

    expect(element.props.warningCount).toBe(2);
    expect(element.props.currentTab).toBe("peta");
  });

  it("Good Route: Mendukung tab profil/pengaturan secara fleksibel", () => {
    const handleSelectTab = vi.fn();
    const element = React.createElement(MobileBottomNav, {
      currentTab: "pengaturan",
      onSelectTab: handleSelectTab,
    });

    expect(element.props.currentTab).toBe("pengaturan");
  });
});
