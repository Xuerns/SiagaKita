import { NextRequest } from 'next/server';

// ==============================================================================
// 1. IN-MEMORY RATE LIMITER (Sliding Window Counter)
// ==============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Pembersihan berkala setiap 5 menit agar memori tidak bocor
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Mengecek batasan rate limit per identifier (IP atau User ID).
 * @param key Identifier unik (contoh: "login:192.168.1.1", "report:user_123")
 * @param limit Jumlah maksimal request yang diizinkan dalam rentang waktu
 * @param windowSeconds Rentang waktu dalam detik
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetSeconds: windowSeconds,
    };
  }

  if (entry.count >= limit) {
    const remainingSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: remainingSeconds,
    };
  }

  entry.count += 1;
  const remainingSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetSeconds: remainingSeconds,
  };
}

/**
 * Mengambil alamat IP klien dari header request dengan aman.
 */
export function getClientIp(request: Request | NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

// ==============================================================================
// 2. INPUT SANITIZATION (Anti-XSS & SQLi / HTML Tag Stripping)
// ==============================================================================

/**
 * Membersihkan string teks dari tag HTML, karakter berbahaya, dan null bytes.
 */
export function sanitizeText(text: string | null | undefined, maxLength: number = 2000): string {
  if (!text) return '';

  return text
    // Hapus null byte
    .replace(/\0/g, '')
    // Hapus script/style tags beserta isinya
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Hapus semua tag HTML lainnya
    .replace(/<[^>]*>?/gm, '')
    // Hapus javascript: atau data:text/html pseudoscheme
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .trim()
    .slice(0, maxLength);
}

// ==============================================================================
// 3. FILE VALIDATION (MIME-type & Max Size 5 MB)
// ==============================================================================

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  mimeType?: string;
  sizeBytes?: number;
}

/**
 * Memvalidasi file foto baik berformat Base64 Data URI maupun URL biasa.
 */
export function validateImageString(input: string): FileValidationResult {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'File atau URL foto tidak valid.' };
  }

  // Jika input berupa Base64 Data URI (misal: "data:image/jpeg;base64,...")
  if (input.startsWith('data:')) {
    const matches = input.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches) {
      return { valid: false, error: 'Format data gambar Base64 tidak valid.' };
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
      return {
        valid: false,
        error: `Format file ${mimeType} tidak didukung. Hanya diizinkan JPEG, PNG, dan WebP.`,
      };
    }

    // Hitung ukuran byte dari panjang base64
    const padding = (base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0);
    const approximateBytes = Math.ceil((base64Data.length * 3) / 4) - padding;

    if (approximateBytes > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Ukuran file foto melebihi batas maksimal 5 MB (terdeteksi ~${(approximateBytes / (1024 * 1024)).toFixed(1)} MB).`,
      };
    }

    return { valid: true, mimeType, sizeBytes: approximateBytes };
  }

  // Jika input berupa URL eksternal biasa
  try {
    const parsed = new URL(input);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Protokol URL foto harus menggunakan HTTPS atau HTTP.' };
    }

    // Cegah URL javascript: atau protokol berbahaya
    if (input.toLowerCase().includes('javascript:') || input.toLowerCase().includes('data:text/html')) {
      return { valid: false, error: 'URL foto mengandung skema tidak aman.' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'URL foto tidak valid.' };
  }
}

// ==============================================================================
// 4. SENSITIVE DATA MASKING & FILTERING
// ==============================================================================

/**
 * Mengaburkan koordinat presisi tinggi menjadi radius ~100m untuk privasi publik
 * sesuai amanat UU PDP (PRD 14.2).
 */
export function maskCoordinate(val: number): number {
  // 3 digit desimal setara dengan akurasi ~110 meter
  return Math.round(val * 1000) / 1000;
}

/**
 * Menyaring objek profil pengguna agar tidak membocorkan data sensitif
 * (seperti kerentanan keluarga tanpa izin eksplisit atau data internal).
 */
export function filterSensitiveProfile<T extends Record<string, any>>(
  profile: T | null | undefined,
  isOwnerOrStaff: boolean = false
): Partial<T> | null {
  if (!profile) return null;

  const sanitized = { ...profile };

  // Data kerentanan (lansia, sakit, disabilitas) hanya boleh tampil jika
  // pemilik memberi izin eksplisit atau diakses oleh kontak darurat terotorisasi
  if (!isOwnerOrStaff && (!sanitized.vulnerability_consent)) {
    delete sanitized.vulnerability;
    delete sanitized.emergency_contacts;
  }

  return sanitized;
}

/**
 * Menyamarkan alamat email untuk tampilan publik (contoh: a***s@gmail.com).
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes('@')) return '';
  const [name, domain] = email.split('@');
  if (name.length <= 2) {
    return `${name[0]}*@${domain}`;
  }
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
}
