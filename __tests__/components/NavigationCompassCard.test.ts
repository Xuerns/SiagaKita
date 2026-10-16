import { describe, it, expect } from "vitest";
import {
  calculateBearing,
  getCompassDirection,
} from "@/components/map/NavigationCompassCard";

describe("NavigationCompassCard Calculations", () => {
  it("Good Route: calculateBearing menghitung arah utara (sekitar 0° / 360°)", () => {
    // Titik A ke Titik B persis di utaranya
    const bearing = calculateBearing(-6.9, 107.6, -6.8, 107.6);
    expect(Math.round(bearing)).toBe(0);
    expect(getCompassDirection(bearing)).toBe("Utara");
  });

  it("Good Route: calculateBearing menghitung arah timur (sekitar 90°)", () => {
    // Titik A ke Titik B di timurnya
    const bearing = calculateBearing(-6.9, 107.6, -6.9, 107.7);
    expect(Math.round(bearing)).toBe(90);
    expect(getCompassDirection(bearing)).toBe("Timur");
  });

  it("Good Route: calculateBearing menghitung arah selatan (sekitar 180°)", () => {
    const bearing = calculateBearing(-6.8, 107.6, -6.9, 107.6);
    expect(Math.round(bearing)).toBe(180);
    expect(getCompassDirection(bearing)).toBe("Selatan");
  });

  it("Good Route: calculateBearing menghitung arah barat (sekitar 270°)", () => {
    const bearing = calculateBearing(-6.9, 107.7, -6.9, 107.6);
    expect(Math.round(bearing)).toBe(270);
    expect(getCompassDirection(bearing)).toBe("Barat");
  });

  it("Good Route: getCompassDirection memetakan arah diagonal seperti Barat Laut", () => {
    expect(getCompassDirection(315)).toBe("Barat Laut");
    expect(getCompassDirection(45)).toBe("Timur Laut");
    expect(getCompassDirection(135)).toBe("Tenggara");
    expect(getCompassDirection(225)).toBe("Barat Daya");
  });
});
