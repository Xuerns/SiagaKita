import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hitungSkorBanjir } from '@/lib/risiko';
import { getRainfallData } from '@/lib/weather-ingest';
import { DEMO_REGION } from '@/lib/data/demo';

export async function GET(request: NextRequest) {
  return handleCronRisiko(request);
}

export async function POST(request: NextRequest) {
  return handleCronRisiko(request);
}

async function handleCronRisiko(request: NextRequest) {
  try {
    // 1. Verifikasi Kunci Rahasia Cron (CRON_SECRET)
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');

    const isAuthorized =
      Boolean(cronSecret) &&
      (authHeader === `Bearer ${cronSecret}` || querySecret === cronSecret);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Akses ditolak. Kunci CRON_SECRET tidak valid atau belum dikonfigurasi.' },
        { status: 401 }
      );
    }

    const adminClient = createAdminClient();

    // 2. Ambil daftar wilayah target dari tabel 'regions'
    let regions: Array<{ id: string; nama: string; kerentanan_banjir: number; lat: number; lng: number }> = [];

    const { data: dbRegions, error: regionError } = await adminClient
      .from('regions')
      .select('id, nama, kerentanan_banjir');

    if (!regionError && dbRegions && dbRegions.length > 0) {
      regions = dbRegions.map((r) => ({
        id: r.id,
        nama: r.nama,
        kerentanan_banjir: r.kerentanan_banjir ?? 80,
        lat: -6.234, // Default centroid koordinat demo Kampung Melayu
        lng: 106.864,
      }));
    } else {
      // Fallback ke DEMO_REGION jika tabel regions kosong atau belum terisi
      regions = [
        {
          id: DEMO_REGION.id,
          nama: DEMO_REGION.nama,
          kerentanan_banjir: DEMO_REGION.kerentanan_banjir,
          lat: DEMO_REGION.centroid?.lat || -6.234,
          lng: DEMO_REGION.centroid?.lng || 106.864,
        },
      ];
    }

    const executionResults = [];
    const alertsCreated = [];

    // 3. Proses Ingest Data Cuaca & Hitung Skor per Wilayah
    for (const region of regions) {
      const rain = await getRainfallData(region.lat, region.lng);

      const calculated = hitungSkorBanjir({
        hujan24jMm: rain.h24,
        hujan3hariMm: rain.h3,
        muka_air: 75,
        kerentanan: region.kerentanan_banjir,
      });

      // Simpan riwayat penilaian risiko ke tabel 'risk_assessments'
      const assessmentData = {
        region_id: region.id,
        hazard: 'banjir',
        skor: calculated.skor,
        level: calculated.level,
        faktor: calculated.faktor,
        data_lengkap: true,
        computed_at: new Date().toISOString(),
      };

      const { error: insertAssessmentErr } = await adminClient
        .from('risk_assessments')
        .insert(assessmentData);

      if (insertAssessmentErr) {
        console.warn(`Gagal insert ke risk_assessments untuk wilayah ${region.nama}:`, insertAssessmentErr.message);
      }

      // Opsional: Coba simpan ke risk_logs jika ada tabel alternatif
      try {
        await adminClient.from('risk_logs').insert(assessmentData);
      } catch {
        // Abaikan jika tabel risk_logs tidak ada
      }

      // 4. Jika level mencapai 'siaga' atau 'awas', buat entri otomatis di tabel 'alerts'
      if (calculated.level === 'siaga' || calculated.level === 'awas') {
        const alertPayload = {
          sumber: 'prediksi',
          hazard: 'banjir',
          level: calculated.level,
          region_id: region.id,
          apa: `Peringatan Risiko Banjir (${calculated.levelText})`,
          di_mana: region.nama,
          seberapa_parah: `Skor risiko ${calculated.skor}/100 akibat akumulasi curah hujan ${rain.h24} mm/24jam (sumber: ${rain.source}).`,
          lakukan_ini: calculated.tindakanCepat.join(' '),
          issued_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
          raw: {
            skor: calculated.skor,
            faktor: calculated.faktor,
            rain_source: rain.source,
          },
        };

        const { data: newAlert, error: alertErr } = await adminClient
          .from('alerts')
          .insert(alertPayload)
          .select()
          .maybeSingle();

        if (!alertErr && newAlert) {
          alertsCreated.push(newAlert);
        }
      }

      executionResults.push({
        region_id: region.id,
        region_nama: region.nama,
        curah_hujan_24j: rain.h24,
        curah_hujan_3hari: rain.h3,
        rain_source: rain.source,
        skor: calculated.skor,
        level: calculated.level,
        rekomendasi: calculated.rekomendasi,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cron ingest cuaca & kalkulasi risiko berhasil dieksekusi',
      timestamp: new Date().toISOString(),
      wilayah_diproses: executionResults.length,
      hasil: executionResults,
      alerts_dibuat: alertsCreated.length,
    });
  } catch (error) {
    console.error('API /api/cron/risiko Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat menjalankan cron kalkulasi risiko' },
      { status: 500 }
    );
  }
}
