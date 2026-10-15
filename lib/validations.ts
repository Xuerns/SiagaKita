import { z } from 'zod';
import { validateImageString } from './security';

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

export const registerSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  nama: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  role: z.enum(['warga', 'relawan']).default('warga'),
  region_id: z.string().uuid().optional().nullable(),
  phone: z.string().optional().nullable(),
});

export const createReportSchema = z.object({
  tipe: z.string().min(1, 'Kategori laporan wajib dipilih').max(100, 'Kategori maksimal 100 karakter'),
  deskripsi: z.string().max(1000, 'Deskripsi maksimal 1000 karakter').optional().nullable(),
  foto_urls: z
    .array(z.string())
    .max(5, 'Maksimal 5 foto per laporan')
    .optional()
    .default([])
    .refine(
      (urls) => urls.every((url) => validateImageString(url).valid),
      { message: 'Foto harus berformat JPEG, PNG, atau WebP dan tidak melebihi 5 MB.' }
    ),
  lat: z.number().min(-90).max(90, 'Koordinat latitude tidak valid'),
  lng: z.number().min(-180).max(180, 'Koordinat longitude tidak valid'),
});

export const confirmReportSchema = z.object({
  vote: z.union([z.literal(1), z.literal(-1)]).default(1),
});

export const safetyStatusSchema = z.object({
  status: z.enum(['aman', 'butuh_bantuan']),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  catatan: z.string().max(500, 'Catatan maksimal 500 karakter').optional().nullable(),
});
