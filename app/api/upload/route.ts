import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  checkRateLimit,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  validateImageString,
} from '@/lib/security';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Verifikasi Autentikasi Pengguna
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    if ((authError || !user) && !isDemoMode) {
      return NextResponse.json(
        { error: 'Harap masuk terlebih dahulu untuk mengunggah foto.' },
        { status: 401 }
      );
    }

    const userId = user?.id || 'demo-user';

    // 2. Rate Limiting: Maksimal 20 upload foto per jam per pengguna
    const rateCheck = checkRateLimit(`upload:${userId}`, 20, 3600);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Batas pengunggahan foto tercapai. Silakan coba lagi dalam ${Math.ceil(
            rateCheck.resetSeconds / 60
          )} menit.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetSeconds),
          },
        }
      );
    }

    // 3. Ekstraksi Data (Mendukung multipart/form-data dan JSON Base64)
    const contentType = request.headers.get('content-type') || '';
    let fileBuffer: Buffer | null = null;
    let mimeType: string = '';
    let originalName: string = 'photo';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: 'File foto tidak ditemukan dalam formulir unggahan.' },
          { status: 400 }
        );
      }

      mimeType = file.type.toLowerCase();
      originalName = file.name || 'photo.webp';

      if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
        return NextResponse.json(
          {
            error: `Format file ${mimeType} tidak didukung. Hanya diizinkan JPEG, PNG, dan WebP.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `Ukuran file melebihi batas maksimal 5 MB (terdeteksi ${(
              file.size /
              (1024 * 1024)
            ).toFixed(1)} MB).`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => null);
      if (!body || !body.file || typeof body.file !== 'string') {
        return NextResponse.json(
          { error: 'Payload tidak valid. Kirimkan field "file" berformat Data URI atau Base64.' },
          { status: 400 }
        );
      }

      const validation = validateImageString(body.file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error || 'File foto tidak valid.' },
          { status: 400 }
        );
      }

      mimeType = validation.mimeType || 'image/webp';
      originalName = body.fileName || 'photo.webp';

      const base64Data = body.file.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else {
      return NextResponse.json(
        { error: 'Header Content-Type harus berupa multipart/form-data atau application/json.' },
        { status: 400 }
      );
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return NextResponse.json(
        { error: 'Konten file foto kosong atau rusak.' },
        { status: 400 }
      );
    }

    // 4. Unggah ke Supabase Storage (S3-compatible Object Storage)
    const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'report-photos';
    const ext = mimeType === 'image/webp' ? 'webp' : mimeType === 'image/png' ? 'png' : 'jpg';
    const filePath = `reports/${userId}/${Date.now()}-${randomUUID()}.${ext}`;

    const admin = createAdminClient();
    const { error: uploadError } = await admin.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      
      // Jika terjadi error pada storage (misal bucket belum dibuat di remote DB),
      // di mode demo atau dev kita sediakan fallback data URI agar fitur laporan tidak macet
      if (isDemoMode) {
        const fallbackDataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        return NextResponse.json({
          success: true,
          url: fallbackDataUri,
          storage: 'fallback_data_uri',
          message: 'Foto disimpan via data URI (demo fallback).',
        });
      }

      return NextResponse.json(
        { error: `Gagal mengunggah foto ke storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Dapatkan URL publik dari object storage S3 Supabase
    const { data: publicUrlData } = admin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        url: publicUrlData.publicUrl,
        filePath,
        sizeBytes: fileBuffer.length,
        mimeType,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API POST /api/upload Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memproses unggahan foto.' },
      { status: 500 }
    );
  }
}
