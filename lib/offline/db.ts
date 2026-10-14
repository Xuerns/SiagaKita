import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { EvacuationPoint, Alert } from '@/types/database';

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

export function getDB() {
  if (typeof window === 'undefined') return null;
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
export async function saveOfflineEvacuationPoints(points: EvacuationPoint[]) {
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
 * Ambil titik evakuasi dari cache lokal
 */
export async function getOfflineEvacuationPoints(): Promise<EvacuationPoint[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('evacuation_points');
}

/**
 * Simpan metadata (misal: waktu unduh peta, status download)
 */
export async function saveMetadata(key: string, data: unknown) {
  const db = await getDB();
  if (!db) return;
  await db.put('metadata', {
    key,
    updated_at: new Date().toISOString(),
    data,
  });
}

export async function getMetadata(key: string) {
  const db = await getDB();
  if (!db) return null;
  const entry = await db.get('metadata', key);
  return entry ? entry.data : null;
}
