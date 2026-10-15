import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock Supabase Server & Admin
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignInAnonymously = vi.fn();
const mockSignOut = vi.fn();
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signInAnonymously: mockSignInAnonymously,
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
}));

// Import route handlers
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as registerHandler } from '@/app/api/auth/register/route';
import { POST as guestHandler } from '@/app/api/auth/guest/route';
import { POST as logoutHandler } from '@/app/api/auth/logout/route';
import { GET as meHandler } from '@/app/api/auth/me/route';

describe('Auth API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // POST /api/auth/login
  // ==========================================
  describe('POST /api/auth/login', () => {
    it('Good Route: Berhasil login dengan kredensial valid', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: {
          user: { id: 'user-123', email: 'warga@siagakita.id', user_metadata: { full_name: 'Budi' } },
        },
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValueOnce({
          data: { id: 'user-123', nama: 'Budi', role: 'warga' },
          error: null,
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'warga@siagakita.id',
          password: 'password123',
        }),
      });

      const res = await loginHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.user.email).toBe('warga@siagakita.id');
      expect(json.user.nama).toBe('Budi');
    });

    it('Bad Route: Gagal jika format email salah (Zod validation)', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'bukan-email',
          password: 'password123',
        }),
      });

      const res = await loginHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('Format email tidak valid');
    });

    it('Bad Route: Gagal jika kata sandi salah dari Supabase Auth', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'warga@siagakita.id',
          password: 'wrongpassword',
        }),
      });

      const res = await loginHandler(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toBe('Invalid login credentials');
    });
  });

  // ==========================================
  // POST /api/auth/register
  // ==========================================
  describe('POST /api/auth/register', () => {
    it('Good Route: Berhasil mendaftar akun baru dan auto-insert profil', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: {
          user: { id: 'new-user-1', email: 'baru@siagakita.id' },
          session: null,
        },
        error: null,
      });

      const req = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'baru@siagakita.id',
          password: 'strongPassword123!',
          nama: 'Dewi Lestari',
          role: 'warga',
        }),
      });

      const res = await registerHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.user.nama).toBe('Dewi Lestari');
    });

    it('Bad Route: Gagal jika kata sandi kurang dari 8 karakter', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'baru@siagakita.id',
          password: '123',
          nama: 'Dewi Lestari',
        }),
      });

      const res = await registerHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('minimal 8 karakter');
    });
  });

  // ==========================================
  // POST /api/auth/guest
  // ==========================================
  describe('POST /api/auth/guest', () => {
    it('Good Route: Berhasil masuk mode tamu anonim', async () => {
      mockSignInAnonymously.mockResolvedValueOnce({
        data: {
          user: { id: 'guest-987654', is_anonymous: true },
          session: { access_token: 'fake-token' },
        },
        error: null,
      });

      const res = await guestHandler();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.isGuest).toBe(true);
      expect(json.user.nama).toContain('Tamu');
    });

    it('Bad Route: Menangani error saat anonymous auth dimatikan di Supabase', async () => {
      mockSignInAnonymously.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Anonymous sign-ins are disabled' },
      });

      const res = await guestHandler();
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain('Anonymous sign-in belum diaktifkan');
    });
  });

  // ==========================================
  // POST /api/auth/logout
  // ==========================================
  describe('POST /api/auth/logout', () => {
    it('Good Route: Berhasil logout', async () => {
      mockSignOut.mockResolvedValueOnce({ error: null });

      const res = await logoutHandler();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });

  // ==========================================
  // GET /api/auth/me
  // ==========================================
  describe('GET /api/auth/me', () => {
    it('Good Route: Mengembalikan data pengguna jika sesi aktif', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'u-1', email: 'test@siagakita.id', is_anonymous: false } },
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValueOnce({
          data: { id: 'u-1', nama: 'Warga Aman', role: 'warga' },
          error: null,
        }),
      });

      const res = await meHandler();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.isAuthenticated).toBe(true);
      expect(json.user.email).toBe('test@siagakita.id');
    });

    it('Bad Route: Mengembalikan isAuthenticated false jika tidak ada sesi', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'No session' },
      });

      const res = await meHandler();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.isAuthenticated).toBe(false);
      expect(json.user).toBeNull();
    });
  });
});
