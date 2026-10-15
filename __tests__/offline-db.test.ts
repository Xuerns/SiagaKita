import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as idb from 'idb';
import { 
  getDB, 
  getOfflineChecklist, 
  saveOfflineChecklist, 
  getOfflineEvacuationPoints,
  saveOfflineEvacuationPoints,
  clearOfflineEvacuationPoints,
  getMetadata,
  saveMetadata,
  removeMetadata
} from '@/lib/offline/db';
import { ChecklistItem, EvacuationPoint } from '@/types';

vi.mock('idb', () => ({
  openDB: vi.fn(),
}));

describe('Offline Database (IndexedDB Layer)', () => {
  const sampleChecklist: ChecklistItem[] = [
    { id: 'item-1', label: 'Air Minum', completed: false, category: 'essential' },
    { id: 'item-2', label: 'Kotak P3K', completed: true, category: 'health' },
  ];

  const samplePoints: EvacuationPoint[] = [
    {
      id: 'ep-test-1',
      name: 'Posko Uji Coba',
      type: 'Posko',
      lat: -6.9,
      lng: 107.6,
      distanceKm: 1.0,
      travelMinutes: 5,
    },
  ];

  describe('SSR / Node.js Environment (Graceful Fallback)', () => {
    it('Good Route: getDB mengembalikan null dengan aman saat window/indexedDB undefined', () => {
      expect(getDB()).toBeNull();
    });

    it('Good Route: getOfflineChecklist mengembalikan defaultItems tanpa melempar error di server', async () => {
      const result = await getOfflineChecklist(sampleChecklist);
      expect(result).toEqual(sampleChecklist);
    });

    it('Good Route: getOfflineEvacuationPoints mengembalikan array kosong di server', async () => {
      const result = await getOfflineEvacuationPoints();
      expect(result).toEqual([]);
    });

    it('Good Route: Operasi simpan (saveOfflineChecklist, saveOfflineEvacuationPoints) tidak crash di server', async () => {
      await expect(saveOfflineChecklist(sampleChecklist)).resolves.toBeUndefined();
      await expect(saveOfflineEvacuationPoints(samplePoints)).resolves.toBeUndefined();
      await expect(clearOfflineEvacuationPoints()).resolves.toBeUndefined();
    });

    it('Good Route: getMetadata mengembalikan null secara aman di server', async () => {
      const result = await getMetadata('offline_map_downloaded');
      expect(result).toBeNull();
    });
  });

  describe('Browser IndexedDB Mocked Environment', () => {
    let mockStore: Record<string, any>;
    let mockMetadataStore: Record<string, any>;

    beforeEach(() => {
      mockStore = {};
      mockMetadataStore = {};

      const fakeDb = {
        transaction: vi.fn(() => ({
          store: {
            put: vi.fn(async (item: any) => {
              mockStore[item.id] = item;
            }),
            clear: vi.fn(async () => {
              mockStore = {};
            }),
          },
          done: Promise.resolve(),
        })),
        getAll: vi.fn(async (storeName: string) => {
          if (storeName === 'checklist') return Object.values(mockStore);
          return [];
        }),
        get: vi.fn(async (storeName: string, key: string) => {
          if (storeName === 'metadata') {
            return mockMetadataStore[key] ? { data: mockMetadataStore[key] } : undefined;
          }
          return undefined;
        }),
        put: vi.fn(async (storeName: string, entry: any) => {
          if (storeName === 'metadata') {
            mockMetadataStore[entry.key] = entry.data;
          }
        }),
        delete: vi.fn(async (storeName: string, key: string) => {
          if (storeName === 'metadata') {
            delete mockMetadataStore[key];
          }
        }),
      };

      vi.stubGlobal('window', {});
      vi.stubGlobal('indexedDB', {});
      vi.mocked(idb.openDB).mockResolvedValue(fakeDb as any);
    });

    it('Good Route: Berhasil menyimpan checklist ke IndexedDB', async () => {
      await saveOfflineChecklist([
        { ...sampleChecklist[0], completed: true },
      ]);
      expect(mockStore['item-1']).toBeDefined();
      expect(mockStore['item-1'].checked).toBe(true);
    });

    it('Good Route: Berhasil membaca kembali checklist dari IndexedDB', async () => {
      mockStore['item-1'] = { id: 'item-1', checked: true, updated_at: new Date().toISOString() };
      const items = await getOfflineChecklist(sampleChecklist);
      expect(items[0].completed).toBe(true);
      expect(items[1].completed).toBe(true); // default tetap terjaga
    });

    it('Bad Route: Menangani pembacaan metadata yang tidak ada di storage', async () => {
      const meta = await getMetadata('kunci_tidak_ada');
      expect(meta).toBeNull();
    });

    it('Good Route: Berhasil menyimpan dan mengambil metadata unduhan peta', async () => {
      await saveMetadata('offline_map_downloaded', { count: 4, downloaded_at: '2026-10-15' });
      const meta = await getMetadata<{ count: number }>('offline_map_downloaded');
      expect(meta).toEqual({ count: 4, downloaded_at: '2026-10-15' });

      await removeMetadata('offline_map_downloaded');
      const removed = await getMetadata('offline_map_downloaded');
      expect(removed).toBeNull();
    });
  });
});
