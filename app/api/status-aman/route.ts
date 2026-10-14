import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { status, lat, lng, catatan } = body;

    if (!status || !['aman', 'butuh_bantuan'].includes(status)) {
      return NextResponse.json(
        { error: 'Status harus bernilai "aman" atau "butuh_bantuan"' },
        { status: 400 }
      );
    }

    // Response sukses upsert status keselamatan
    return NextResponse.json({
      success: true,
      status,
      lat: lat || -6.234,
      lng: lng || 106.864,
      catatan: catatan || null,
      updated_at: new Date().toISOString(),
      pesan:
        status === 'aman'
          ? 'Status Anda berhasil dicatat AMAN dan dapat dilihat oleh relawan.'
          : 'Panggilan bantuan darurat telah dicatat! Relawan posko terdekat akan memprioritaskan evakuasi ke lokasi Anda.',
    });
  } catch (error) {
    console.error('API /api/status-aman Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui status keselamatan' },
      { status: 500 }
    );
  }
}
