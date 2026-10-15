-- ==============================================================================
-- SIAGAKITA DATABASE SCHEMA (Supabase PostgreSQL + PostGIS)
-- Jalankan skrip ini di SQL Editor pada dashboard Supabase Anda.
-- ==============================================================================

-- 1. AKTIFKAN EKSTENSI POSTGIS
create extension if not exists postgis;

-- 2. TIPE ENUM
create type hazard_type as enum (
  'banjir',
  'longsor',
  'gempa',
  'tsunami',
  'gunung_api',
  'karhutla',
  'cuaca_ekstrem'
);

create type risk_level as enum (
  'aman',
  'waspada',
  'siaga',
  'awas'
);

create type user_role as enum (
  'warga',
  'relawan',
  'admin'
);

-- 3. TABEL WILAYAH (REGIONS)
create table if not exists regions (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tingkat text default 'kelurahan',              -- kelurahan / desa / kecamatan
  geom geography(MultiPolygon, 4326) not null,
  centroid geography(Point, 4326),
  kerentanan_banjir smallint check (kerentanan_banjir between 0 and 100) default 50,
  kerentanan_longsor smallint check (kerentanan_longsor between 0 and 100) default 20,
  created_at timestamptz default now()
);
create index if not exists idx_regions_geom on regions using gist (geom);

-- 4. TABEL PROFIL PENGGUNA (PROFILES)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  nama text,
  role user_role not null default 'warga',
  home_location geography(Point, 4326),
  region_id uuid references regions(id),
  radius_km smallint not null default 3 check (radius_km between 1 and 5),
  emergency_contacts jsonb default '[]'::jsonb,
  vulnerability jsonb,                           -- hanya terisi jika ada izin eksplisit
  vulnerability_consent boolean not null default false,
  created_at timestamptz default now()
);
create index if not exists idx_profiles_home on profiles using gist (home_location);

-- Otomatis buat profil saat ada user baru terdaftar (termasuk anonymous)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nama, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Warga ' || substring(new.id::text, 1, 6)),
    'warga'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. TABEL RIWAYAT PENILAIAN RISIKO (RISK_ASSESSMENTS)
create table if not exists risk_assessments (
  id bigint generated always as identity primary key,
  region_id uuid not null references regions(id) on delete cascade,
  hazard hazard_type not null default 'banjir',
  skor smallint not null check (skor between 0 and 100),
  level risk_level not null,
  faktor jsonb not null default '{}'::jsonb,
  data_lengkap boolean not null default true,
  computed_at timestamptz not null default now()
);
create index if not exists idx_risk_assessments_region_hazard on risk_assessments (region_id, hazard, computed_at desc);

-- 6. TABEL PERINGATAN (ALERTS)
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  sumber text not null default 'prediksi',        -- 'bmkg' | 'prediksi' | 'manual'
  hazard hazard_type not null,
  level risk_level not null,
  region_id uuid references regions(id) on delete set null,
  apa text not null,
  di_mana text not null,
  seberapa_parah text not null,
  lakukan_ini text not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  raw jsonb
);
create index if not exists idx_alerts_region on alerts (region_id, issued_at desc);

-- 7. TABEL TITIK EVAKUASI (EVACUATION_POINTS)
create table if not exists evacuation_points (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tipe text not null check (tipe in ('titik_kumpul', 'shelter', 'rumah_sakit', 'posko')),
  geom geography(Point, 4326) not null,
  alamat text,
  kapasitas int default 100,
  fasilitas text[] default array[]::text[],
  region_id uuid references regions(id) on delete cascade,
  aktif boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_evac_points_geom on evacuation_points using gist (geom);

-- 8. TABEL RUTE EVAKUASI PRE-COMPUTED (EVACUATION_ROUTES)
create table if not exists evacuation_routes (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references regions(id) on delete cascade,
  point_id uuid references evacuation_points(id) on delete cascade,
  geom geography(LineString, 4326) not null,
  jarak_m int,
  durasi_menit int,
  created_at timestamptz default now()
);

-- 9. TABEL LAPORAN WARGA (COMMUNITY_REPORTS)
create table if not exists community_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  tipe text not null,                            -- 'banjir', 'jalan_terputus', 'sungai_naik', dll.
  deskripsi text,
  foto_urls text[] default array[]::text[],
  geom geography(Point, 4326) not null,
  status text not null default 'belum_terverifikasi'
    check (status in ('belum_terverifikasi', 'terverifikasi', 'ditolak', 'disembunyikan')),
  konfirmasi_count int not null default 0,
  created_at timestamptz default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);
create index if not exists idx_community_reports_geom on community_reports using gist (geom);

-- 10. TABEL KONFIRMASI LAPORAN (REPORT_CONFIRMATIONS)
create table if not exists report_confirmations (
  report_id uuid references community_reports(id) on delete cascade,
  user_id uuid references auth.users on delete cascade,
  vote smallint not null check (vote in (1, -1)),
  created_at timestamptz default now(),
  primary key (report_id, user_id)
);

-- Trigger penghitungan konfirmasi otomatis
create or replace function update_report_confirmation_count()
returns trigger as $$
begin
  update community_reports
  set konfirmasi_count = (
    select coalesce(sum(vote), 0)
    from report_confirmations
    where report_id = coalesce(new.report_id, old.report_id)
  )
  where id = coalesce(new.report_id, old.report_id);

  -- Jika konfirmasi >= 3, otomatis terverifikasi
  update community_reports
  set status = 'terverifikasi'
  where id = coalesce(new.report_id, old.report_id)
    and konfirmasi_count >= 3
    and status = 'belum_terverifikasi';

  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_report_vote_change on report_confirmations;
create trigger on_report_vote_change
  after insert or update or delete on report_confirmations
  for each row execute function update_report_confirmation_count();

-- 11. TABEL STATUS KESELAMATAN (SAFETY_STATUS)
create table if not exists safety_status (
  user_id uuid primary key references auth.users on delete cascade,
  status text not null check (status in ('aman', 'butuh_bantuan')),
  geom geography(Point, 4326),
  catatan text,
  updated_at timestamptz default now()
);

-- 12. TABEL PUSH SUBSCRIPTIONS
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  region_id uuid references regions(id) on delete set null,
  created_at timestamptz default now()
);

-- ==============================================================================
-- KEBIJAKAN ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table profiles enable row level security;
alter table regions enable row level security;
alter table risk_assessments enable row level security;
alter table alerts enable row level security;
alter table evacuation_points enable row level security;
alter table evacuation_routes enable row level security;
alter table community_reports enable row level security;
alter table report_confirmations enable row level security;
alter table safety_status enable row level security;
alter table push_subscriptions enable row level security;

-- Publik read-only untuk data umum bencana
create policy "Regions are viewable by everyone" on regions for select using (true);
create policy "Risk assessments are viewable by everyone" on risk_assessments for select using (true);
create policy "Alerts are viewable by everyone" on alerts for select using (true);
create policy "Evacuation points are viewable by everyone" on evacuation_points for select using (aktif = true);
create policy "Evacuation routes are viewable by everyone" on evacuation_routes for select using (true);

-- Profil: Pemilik bisa lihat & edit miliknya
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Laporan Warga: Terbuka untuk umum kecuali disembunyikan; Pengguna terdaftar bisa buat
create policy "Community reports viewable by everyone" on community_reports
  for select using (status <> 'disembunyikan' and expires_at > now());

create policy "Authenticated users can create reports" on community_reports
  for insert with check (auth.uid() = user_id);

-- Konfirmasi: Pengguna hanya boleh konfirmasi laporan orang lain (1 suara)
create policy "Confirmations viewable by everyone" on report_confirmations for select using (true);
create policy "Authenticated users can vote once" on report_confirmations
  for insert with check (auth.uid() = user_id);

-- Status Aman: Publik bisa lihat status (untuk kontak/relawan), pemilik bisa update
create policy "Safety status viewable by authenticated users" on safety_status for select using (true);
create policy "Users can upsert own safety status" on safety_status
  for all using (auth.uid() = user_id);

-- Push subscriptions: Service role / user terkait
create policy "Users can manage own push subscription" on push_subscriptions
  for all using (auth.uid() = user_id);

-- ==============================================================================
-- DATA CONTOH / SEED WILAYAH DEMO (Kampung Melayu, Jatinegara)
-- ==============================================================================
insert into regions (id, nama, tingkat, kerentanan_banjir, geom, centroid)
values (
  '11111111-1111-1111-1111-111111111111',
  'Kelurahan Kampung Melayu',
  'kelurahan',
  85,
  ST_GeographyFromText('SRID=4326;MULTIPOLYGON(((106.858 -6.228, 106.870 -6.228, 106.870 -6.240, 106.858 -6.240, 106.858 -6.228)))'),
  ST_GeographyFromText('SRID=4326;POINT(106.864 -6.234)')
) on conflict (id) do nothing;

-- Seed Titik Evakuasi Demo
insert into evacuation_points (nama, tipe, geom, alamat, kapasitas, fasilitas, region_id)
values
(
  'GOR Otista Jatinegara',
  'shelter',
  ST_GeographyFromText('SRID=4326;POINT(106.867 -6.231)'),
  'Jl. Otto Iskandardinata No.121',
  500,
  array['Dapur Umum', 'Toilet', 'Listrik Cadangan', 'Pos Medis'],
  '11111111-1111-1111-1111-111111111111'
),
(
  'Puskesmas Kelurahan Kampung Melayu',
  'rumah_sakit',
  ST_GeographyFromText('SRID=4326;POINT(106.862 -6.235)'),
  'Jl. Kebon Pala I',
  150,
  array['UGD 24 Jam', 'Ambulans', 'Obat Darurat'],
  '11111111-1111-1111-1111-111111111111'
),
(
  'Titik Kumpul Lapangan RW 03',
  'titik_kumpul',
  ST_GeographyFromText('SRID=4326;POINT(106.865 -6.237)'),
  'Kompleks RW 03 Kampung Melayu',
  200,
  array['Tenda Darurat', 'Pengeras Suara'],
  '11111111-1111-1111-1111-111111111111'
) on conflict do nothing;

-- 14. KONFIGURASI SUPABASE STORAGE (S3 OBJECT STORAGE) UNTUK FOTO LAPORAN
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'report-photos',
  'report-photos',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Kebijakan akses publik untuk melihat foto laporan
drop policy if exists "Akses Publik Lihat Foto Laporan" on storage.objects;
create policy "Akses Publik Lihat Foto Laporan"
on storage.objects for select
using (bucket_id = 'report-photos');

-- Kebijakan pengguna terautentikasi dapat mengunggah foto
drop policy if exists "Pengguna Terautentikasi Upload Foto Laporan" on storage.objects;
create policy "Pengguna Terautentikasi Upload Foto Laporan"
on storage.objects for insert
to authenticated
with check (bucket_id = 'report-photos');
