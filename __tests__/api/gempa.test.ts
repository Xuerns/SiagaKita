import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getGempaHandler } from '@/app/api/gempa/route';
import { parseBMKGCoordinates, parseBMKGEarthquake } from '@/lib/gempa';

describe('Gempa API (/api/gempa) & BMKG TEWS Parser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // UNIT TEST: Parser & Distance Logic
  // ==========================================
  describe('BMKG Coordinates & Earthquake Parsing', () => {
    it('Good Route: Berhasil parse string koordinat BMKG ke lat/lng numerik', () => {
      const coords = parseBMKGCoordinates('-8.14,120.56');
      expect(coords.lat).toBe(-8.14);
      expect(coords.lng).toBe(120.56);
    });

    it('Bad Route: Menangani string koordinat BMKG yang kosong atau rusak', () => {
      const coords1 = parseBMKGCoordinates('');
      expect(coords1.lat).toBe(0);
      expect(coords1.lng).toBe(0);

      const coords2 = parseBMKGCoordinates('invalid_coord');
      expect(coords2.lat).toBe(0);
      expect(coords2.lng).toBe(0);
    });

    it('Good Route: Menghitung jarak episentrum dan 4 pilar mitigasi (Apa, Di mana, Seberapa parah, Lakukan ini)', () => {
      const mockRaw = {
        Tanggal: '14 Okt 2026',
        Jam: '17:30:57 WIB',
        DateTime: '2026-10-14T10:30:57+00:00',
        Coordinates: '-8.14,120.56',
        Lintang: '8.14 LS',
        Bujur: '120.56 BT',
        Magnitude: '5.8',
        Kedalaman: '10 km',
        Wilayah: '53 km utara Ruteng, Manggarai',
        Potensi: 'Tidak berpotensi tsunami',
        Dirasakan: 'III-IV Manggarai',
        Shakemap: '20261014173057.mmi.jpg',
      };

      // Koordinat pengguna dekat Manggarai (-8.5, 120.4)
      const parsed = parseBMKGEarthquake(mockRaw, -8.5, 120.4);

      expect(parsed.magnitude).toBe(5.8);
      expect(parsed.jarakKm).toBeDefined();
      expect(parsed.jarakKm).toBeLessThan(100);
      expect(parsed.level).toBe('Awas'); // Jarak dekat + M >= 5.5
      expect(parsed.shakemapUrl).toContain('20261014173057.mmi.jpg');
      expect(parsed.rekomendasi.apa).toContain('Gempa Bumi M 5.8');
      expect(parsed.rekomendasi.di_mana).toContain('Ruteng');
      expect(parsed.rekomendasi.lakukan_ini.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // GOOD ROUTES: GET /api/gempa
  // ==========================================
  describe('GET /api/gempa - Good Routes', () => {
    it('Good Route: Berhasil mengambil data gempa terkini BMKG', async () => {
      const req = new NextRequest('http://localhost:3000/api/gempa', {
        method: 'GET',
      });

      const res = await getGempaHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.source).toBeDefined();
      expect(json.latest).toBeDefined();
      expect(json.latest.magnitude).toBeGreaterThan(0);
      expect(json.latest.coordinates).toBeDefined();
      expect(json.latest.rekomendasi).toBeDefined();
      expect(json.latest.rekomendasi.lakukan_ini).toBeInstanceOf(Array);
    });

    it('Good Route: Berhasil menghitung jarak episentrum berdasarkan koordinat pengguna', async () => {
      const req = new NextRequest('http://localhost:3000/api/gempa?lat=-6.9175&lng=107.6191', {
        method: 'GET',
      });

      const res = await getGempaHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.latest.jarakKm).toBeDefined();
      expect(typeof json.latest.jarakKm).toBe('number');
      expect(json.user_location).toEqual({
        name: undefined,
        lat: -6.9175,
        lng: 107.6191,
      });
    });

    it('Good Route: Berhasil menyelesaikan nama wilayah pengguna ("Kota Bandung") menjadi koordinat', async () => {
      const req = new NextRequest('http://localhost:3000/api/gempa?location=Kota%20Bandung', {
        method: 'GET',
      });

      const res = await getGempaHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.user_location?.name).toBe('Kota Bandung');
      expect(json.latest.jarakKm).toBeDefined();
    });

    it('Good Route: Berhasil mengambil daftar gempa dirasakan (?type=felt)', async () => {
      const req = new NextRequest('http://localhost:3000/api/gempa?type=felt', {
        method: 'GET',
      });

      const res = await getGempaHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.earthquakes)).toBe(true);
      expect(json.earthquakes.length).toBeGreaterThan(0);
    });

    it('Good Route: Berhasil mengambil gabungan gempa terkini dan daftar dirasakan (?type=all)', async () => {
      const req = new NextRequest('http://localhost:3000/api/gempa?type=all', {
        method: 'GET',
      });

      const res = await getGempaHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.latest).toBeDefined();
      expect(Array.isArray(json.recent_felt)).toBe(true);
    });
  });

  // ==========================================
  // BAD ROUTES: GET /api/gempa
  // ==========================================
  describe('GET /api/gempa - Bad Routes', () => {
    it('Bad Route: Menangani input parameter lat/lng yang tidak valid secara aman', async () => {
      const req = new NextRequest('http://localhost:3000/api/gempa?lat=not_a_number&lng=abc', {
        method: 'GET',
      });

      const res = await getGempaHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      // Jarak harus bernilai null atau aman tanpa menyebabkan crash/NaN di json
      expect(json.latest.jarakKm).toBeNull();
    });

    it('Bad Route: Menggunakan data snapshot resmi terakhir jika jaringan upstream BMKG mengalami kegagalan', async () => {
      // Mock global fetch gagal
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValue(new Error('Koneksi timeout ke server BMKG'));

      try {
        const req = new NextRequest('http://localhost:3000/api/gempa', {
          method: 'GET',
        });

        const res = await getGempaHandler(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.source).toBe('Fallback');
        expect(json.latest).toBeDefined();
        expect(json.latest.magnitude).toBeGreaterThan(0);
      } finally {
        global.fetch = originalFetch;
      }
    });
  });
});
