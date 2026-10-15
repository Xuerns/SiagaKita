/**
 * Helper utilitas untuk kompresi dan konversi gambar ke WebP di sisi klien (browser).
 * Mengurangi ukuran foto kamera (5-10 MB) menjadi ~100-300 KB menggunakan HTML5 Canvas.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 s/d 1.0 (default: 0.8)
}

export interface CompressedImageResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  format: 'image/webp';
  savedPercent: number;
}

/**
 * Format bytes menjadi teks ramah baca (contoh: 1.4 MB atau 180 KB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Mengubah file gambar (JPEG, PNG, WebP) menjadi format WebP terkompresi.
 * Berjalan sepenuhnya di sisi klien menggunakan Canvas API native tanpa library eksternal.
 */
export async function compressAndConvertToWebP(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressedImageResult> {
  const { maxWidth = 1280, maxHeight = 1280, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan merupakan gambar.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memuat gambar ke memori.'));
      img.onload = () => {
        // Hitung proporsi dimensi baru agar aspek rasio tetap terjaga
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Gambar ke Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Gagal membuat context canvas browser.'));
        }

        // Gambar ulang dengan interpolasi halus
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke WebP Data URI
        const dataUrl = canvas.toDataURL('image/webp', quality);

        // Konversi Data URI ke Blob & File object
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Gagal mengonversi canvas ke blob WebP.'));
            }

            // Buat nama file baru dengan ekstensi .webp
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFileName = `${originalName}.webp`;
            const compressedFile = new File([blob], newFileName, { type: 'image/webp' });

            const originalSize = file.size;
            const compressedSize = blob.size;
            const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

            resolve({
              file: compressedFile,
              dataUrl,
              originalSize,
              compressedSize,
              format: 'image/webp',
              savedPercent,
            });
          },
          'image/webp',
          quality
        );
      };

      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      } else {
        reject(new Error('Hasil pembacaan file kosong.'));
      }
    };

    reader.readAsDataURL(file);
  });
}
