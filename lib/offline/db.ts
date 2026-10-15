import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Alert } from '@/types/database';
import { EvacuationPoint, ChecklistItem } from '@/types';

interface SiagaKitaDB extends DBSchema {
  evacuation_points: {
    key: string;
    value: EvacuationPoint;
  };
  alerts: {
    key: string;
    value: Alert;
  };
  metadata: {
    key: string;
    value: {
      key: string;
      updated_at: string;
      data: unknown;
    };
  };
  checklist: {
    key: string;
    value: {
      id: string;
      checked: boolean;
      updated_at: string;
    };
  };
}

const DB_NAME = 'siagakita-offline-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SiagaKitaDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<SiagaKitaDB>> | null {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<SiagaKitaDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('evacuation_points')) {
          db.createObjectStore('evacuation_points', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('alerts')) {
          db.createObjectStore('alerts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('checklist')) {
          db.createObjectStore('checklist', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Simpan data titik evakuasi ke IndexedDB untuk akses offline
 */
export async function saveOfflineEvacuationPoints(points: EvacuationPoint[]): Promise<void> {
  const db = await getDB();
  if (!db) return;
  const tx = db.transaction('evacuation_points', 'readwrite');
  for (const p of points) {
    await tx.store.put(p);
  }
  await tx.done;

  // Catat waktu download
  await saveMetadata('offline_map_downloaded', {
    count: points.length,
    downloaded_at: new Date().toISOString(),
  });
}

/**
 * Ambil titik evakuasi dari cache lokal IndexedDB
 */
export async function getOfflineEvacuationPoints(): Promise<EvacuationPoint[]> {
  const db = await getDB();
  if (!db) return [];
  try {
    return await db.getAll('evacuation_points');
  } catch (err) {
    console.warn('Gagal membaca titik evakuasi dari IndexedDB:', err);
    return [];
  }
}

/**
 * Hapus titik evakuasi dari cache lokal IndexedDB
 */
export async function clearOfflineEvacuationPoints(): Promise<void> {
  const db = await getDB();
  if (!db) return;
  const tx = db.transaction('evacuation_points', 'readwrite');
  await tx.store.clear();
  await tx.done;
  await removeMetadata('offline_map_downloaded');
}

/**
 * Simpan metadata (misal: waktu unduh peta, status download)
 */
export async function saveMetadata(key: string, data: unknown): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('metadata', {
    key,
    updated_at: new Date().toISOString(),
    data,
  });
}

export async function getMetadata<T = unknown>(key: string): Promise<T | null> {
  const db = await getDB();
  if (!db) return null;
  try {
    const entry = await db.get('metadata', key);
    return entry ? (entry.data as T) : null;
  } catch {
    return null;
  }
}

export async function removeMetadata(key: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  try {
    await db.delete('metadata', key);
  } catch {}
}

/**
 * Simpan status checklist Tas Siaga ke IndexedDB
 */
export async function saveOfflineChecklist(items: ChecklistItem[]): Promise<void> {
  const db = await getDB();
  if (!db) return;
  try {
    const tx = db.transaction('checklist', 'readwrite');
    for (const item of items) {
      await tx.store.put({
        id: item.id,
        checked: Boolean(item.completed),
        updated_at: new Date().toISOString(),
      });
    }
    await tx.done;
  } catch (err) {
    console.warn('Gagal menyimpan checklist ke IndexedDB:', err);
  }
}

/**
 * Ambil status checklist Tas Siaga dari IndexedDB dengan fallback ke defaultItems
 */
export async function getOfflineChecklist(defaultItems: ChecklistItem[]): Promise<ChecklistItem[]> {
  const db = await getDB();
  if (!db) return defaultItems;
  try {
    const records = await db.getAll('checklist');
    if (!records || records.length === 0) {
      return defaultItems;
    }

    const mapChecked = new Map(records.map((r) => [r.id, r.checked]));
    return defaultItems.map((item) => ({
      ...item,
      completed: mapChecked.has(item.id) ? Boolean(mapChecked.get(item.id)) : item.completed,
    }));
  } catch (err) {
    console.warn('Gagal mengambil checklist dari IndexedDB:', err);
    return defaultItems;
  }
}

/**
 * Migrasi otomatis data lama dari localStorage ke IndexedDB jika ada
 */
export async function migrateChecklistFromLocalStorage(defaultItems: ChecklistItem[]): Promise<ChecklistItem[]> {
  if (typeof window === 'undefined') return defaultItems;
  try {
    const legacySaved = localStorage.getItem('siagakita_checklist');
    if (legacySaved) {
      const parsed = JSON.parse(legacySaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        await saveOfflineChecklist(parsed);
        localStorage.removeItem('siagakita_checklist');
        return parsed;
      }
    }
  } catch {}
  return getOfflineChecklist(defaultItems);
}
