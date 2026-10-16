import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  downloadRegionalMap,
  removeRegionalMap,
  getOfflineMapStatus,
  OFFLINE_MAP_METADATA_KEY,
} from "@/lib/offline/peta";
import * as dbModule from "@/lib/offline/db";

describe("Offline Map Package Manager (peta.ts)", () => {
  let mockMetadata: Record<string, any> = {};

  beforeEach(() => {
    mockMetadata = {};

    vi.spyOn(dbModule, "saveOfflineEvacuationPoints").mockImplementation(async () => {});
    vi.spyOn(dbModule, "clearOfflineEvacuationPoints").mockImplementation(async () => {});
    vi.spyOn(dbModule, "saveMetadata").mockImplementation(async (key, data) => {
      mockMetadata[key] = data;
    });
    vi.spyOn(dbModule, "getMetadata").mockImplementation(async (key) => {
      return mockMetadata[key] || null;
    });
    vi.spyOn(dbModule, "removeMetadata").mockImplementation(async (key) => {
      delete mockMetadata[key];
    });
  });

  it("Good Route: downloadRegionalMap mengunduh dan menyimpan metadata paket peta wilayah", async () => {
    const progressUpdates: number[] = [];
    const onProgress = (percent: number) => {
      progressUpdates.push(percent);
    };

    const pkg = await downloadRegionalMap("Kota Bogor", onProgress);

    expect(pkg.isDownloaded).toBe(true);
    expect(pkg.regionName).toBe("Kota Bogor");
    expect(pkg.approxSizeMb).toBeGreaterThan(0);
    expect(pkg.evacuationPointCount).toBeGreaterThan(0);

    // Cek bahwa progress callback dipanggil hingga 100%
    expect(progressUpdates).toContain(10);
    expect(progressUpdates).toContain(100);

    // Cek database IndexedDB menyimpan metadata
    const status = await getOfflineMapStatus();
    expect(status).not.toBeNull();
    expect(status?.regionName).toBe("Kota Bogor");
    expect(status?.isDownloaded).toBe(true);
  });

  it("Good Route: removeRegionalMap membersihkan seluruh metadata dan titik evakuasi lokal", async () => {
    // Simpan dulu
    await downloadRegionalMap("Kota Bogor");
    let status = await getOfflineMapStatus();
    expect(status).not.toBeNull();

    // Hapus
    await removeRegionalMap();
    status = await getOfflineMapStatus();
    expect(status).toBeNull();
    expect(dbModule.clearOfflineEvacuationPoints).toHaveBeenCalled();
  });
});
