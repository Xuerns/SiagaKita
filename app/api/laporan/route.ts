import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createReportSchema } from '@/lib/validations';
import { calculateHaversineDistance, findClosestBMKGRegion } from '@/lib/bmkg';
import { DEMO_COMMUNITY_REPORTS } from '@/lib/data/demo';
import { checkRateLimit, sanitizeText, maskCoordinate } from '@/lib/security';

// Helper untuk mem-parsing koordinat dari PostGIS geom (WKB Hex / GeoJSON / WKT)
function parseGeom(geom: any): { lat: number; lng: number } | null {
  if (!geom) return null;
  if (typeof geom === 'object' && Array.isArray(geom.coordinates)) {
    const lng = Number(geom.coordinates[0]);
    const lat = Number(geom.coordinates[1]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  if (typeof geom === 'string') {
    if (geom.startsWith('{')) {
      try {
        const parsed = JSON.parse(geom);
        if (Array.isArray(parsed.coordinates)) {
          const lng = Number(parsed.coordinates[0]);
          const lat = Number(parsed.coordinates[1]);
          if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
        }
      } catch {}
    }
    const match = geom.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (match) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    if (/^[0-9a-fA-F]+$/.test(geom) && geom.length >= 42) {
      try {
        const buf = Buffer.from(geom, 'hex');
        const isLittleEndian = buf.readUInt8(0) === 1;
        const type = isLittleEndian ? buf.readUInt32LE(1) : buf.readUInt32BE(1);
        const hasSrid = (type & 0x20000000) !== 0;
        const offset = hasSrid ? 9 : 5;
        const lng = isLittleEndian ? buf.readDoubleLE(offset) : buf.readDoubleBE(offset);
        const lat = isLittleEndian ? buf.readDoubleLE(offset + 8) : buf.readDoubleBE(offset + 8);
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      } catch {}
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userLat = searchParams.get('lat') ? Number(searchParams.get('lat')) : null;
    const userLng = searchParams.get('lng') ? Number(searchParams.get('lng')) : null;
    const radiusKm = searchParams.get('radius_km') ? Number(searchParams.get('radius_km')) : 10;
    const kategori = searchParams.get('kategori') || searchParams.get('tipe');

    const supabase = await createClient();

    // Query laporan aktif yang belum kedaluwarsa dan tidak disembunyikan
    let query = supabase
      .from('community_reports')
      .select(`
        id,
        user_id,
        tipe,
        deskripsi,
        foto_urls,
        geom,
        status,
        konfirmasi_count,
        created_at,
        expires_at
      `)
      .neq('status', 'disembunyikan')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (kategori && kategori !== 'Semua') {
      query = query.ilike('tipe', `%${kategori}%`);
    }

    const { data: dbReports, error } = await query;

    let reports: any[] = [];

    if (!error && dbReports) {
      if (dbReports.length > 0) {
        // Ambil profil nama pembuat untuk melengkapi data feed
        const userIds = Array.from(new Set(dbReports.map((r) => r.user_id)));
        let profileMap: Record<string, string> = {};

        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, nama')
            .in('id', userIds);

          if (profiles) {
            profileMap = Object.fromEntries(profiles.map((p) => [p.id, p.nama || 'Warga']));
          }
        }

        // Ambil data konfirmasi pengguna saat ini jika terautentikasi
        let userConfirmedSet = new Set<string>();
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: userVotes } = await supabase
              .from('report_confirmations')
              .select('report_id')
              .eq('user_id', user.id);
            if (userVotes) {
              userConfirmedSet = new Set(userVotes.map((v) => v.report_id));
            }
          }
        } catch {
          // Abaikan jika auth error
        }

        reports = dbReports.map((r) => {
          // Ambil koordinat nyata dari geom PostGIS, lalu diburamkan ~100m sesuai mandat privasi UU PDP (PRD 14.2)
          const coords = parseGeom(r.geom);
          const rawLat = coords?.lat ?? (r as any).lat ?? -6.2345;
          const rawLng = coords?.lng ?? (r as any).lng ?? 106.8631;
          const repLat = maskCoordinate(rawLat);
          const repLng = maskCoordinate(rawLng);

          let distanceKm = 0;
          if (userLat !== null && userLng !== null) {
            distanceKm = Math.round(calculateHaversineDistance(userLat, userLng, repLat, repLng) * 10) / 10;
          }

          const repLocation = findClosestBMKGRegion(repLat, repLng).region.name;

          return {
            id: r.id,
            // Tidak membocorkan user_id privat pengguna di feed publik
            user_name: profileMap[r.user_id] || 'Warga',
            userName: profileMap[r.user_id] || 'Warga',
            category: r.tipe,
            tipe: r.tipe,
            title: r.tipe,
            description: r.deskripsi,
            deskripsi: r.deskripsi,
            locationName: repLocation,
            location_name: repLocation,
            foto_urls: r.foto_urls || [],
            status: r.status,
            konfirmasi_count: r.konfirmasi_count,
            confirmationsCount: r.konfirmasi_count,
            created_at: r.created_at,
            expires_at: r.expires_at,
            lat: repLat,
            lng: repLng,
            jarak_km: distanceKm,
            userConfirmed: userConfirmedSet.has(r.id),
          };
        });

        // Filter berdasarkan radius jarak jika koordinat pengguna diberikan
        if (userLat !== null && userLng !== null) {
          reports = reports.filter((r) => r.jarak_km <= radiusKm);
        }
      } else {
        // Query database berhasil tetapi tabel kosong (misal baru saja dihapus oleh pengguna)
        reports = [];
      }
    } else {
      // Fallback ke data demo hanya saat query database mengalami error (misal tabel belum dibuat atau env belum terhubung)
      reports = DEMO_COMMUNITY_REPORTS.map((rep) => ({
        ...rep,
        lat: maskCoordinate(rep.lat),
        lng: maskCoordinate(rep.lng),
        category: rep.tipe,
        title: rep.tipe,
        description: rep.deskripsi,
        locationName: findClosestBMKGRegion(rep.lat, rep.lng).region.name,
        location_name: findClosestBMKGRegion(rep.lat, rep.lng).region.name,
        confirmationsCount: rep.konfirmasi_count,
      }));
    }

    return NextResponse.json({
      success: true,
      total: reports.length,
      reports,
    });
  } catch (error) {
    console.error('API GET /api/laporan Error:', error);
    return NextResponse.json(
      { error: 'Gagal memuat feed laporan warga' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Cek sesi autentikasi pengguna
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Harap masuk terlebih dahulu sebelum membuat laporan kondisi lapangan.' },
        { status: 401 }
      );
    }

    // 2. Rate Limiting: Maksimal 5 laporan per jam per pengguna (PRD 14.1)
    const rateCheck = checkRateLimit(`report:${user.id}`, 5, 3600);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Batas pengiriman laporan tercapai (maks. 5 laporan/jam). Silakan coba lagi dalam ${Math.ceil(rateCheck.resetSeconds / 60)} menit.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetSeconds),
          },
        }
      );
    }

    // 3. Validasi payload dengan Zod (termasuk validasi MIME & ukuran maksimal 5 MB untuk foto)
    const body = await request.json();
    const parseResult = createReportSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Data laporan tidak valid.' },
        { status: 400 }
      );
    }

    const { tipe, deskripsi, foto_urls, lat, lng } = parseResult.data;

    // 4. Sanitasi teks input dari tag HTML untuk mencegah Stored XSS
    const cleanTipe = sanitizeText(tipe, 100);
    const cleanDeskripsi = deskripsi ? sanitizeText(deskripsi, 1000) : null;

    // 5. Simpan ke tabel community_reports di Supabase
    const adminClient = createAdminClient();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 3600 * 1000); // Kedaluwarsa 24 jam

    const insertPayload = {
      user_id: user.id,
      tipe: cleanTipe,
      deskripsi: cleanDeskripsi,
      foto_urls: foto_urls || [],
      geom: `SRID=4326;POINT(${lng} ${lat})`,
      status: 'belum_terverifikasi',
      konfirmasi_count: 0,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    };

    const { data: newReport, error: insertError } = await adminClient
      .from('community_reports')
      .insert(insertPayload)
      .select()
      .single();

    if (insertError) {
      console.error('Database insert community_reports failed:', insertError);
      return NextResponse.json(
        { error: `Gagal menyimpan laporan ke database: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Laporan berhasil dibuat dan sedang menunggu verifikasi komunitas.',
        report: {
          id: newReport.id,
          tipe: newReport.tipe,
          deskripsi: newReport.deskripsi,
          foto_urls: newReport.foto_urls,
          lat: maskCoordinate(lat),
          lng: maskCoordinate(lng),
          status: newReport.status,
          konfirmasi_count: newReport.konfirmasi_count,
          created_at: newReport.created_at,
          expires_at: newReport.expires_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API POST /api/laporan Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat membuat laporan.' },
      { status: 500 }
    );
  }
}
