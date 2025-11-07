# Cara Optimize Favicon

Favicon saat ini menggunakan file PNG asli yang mungkin terlalu besar atau terlalu detail untuk ukuran favicon kecil (16x16 atau 32x32 pixel).

## Solusi Cepat (Online Tools):

1. **Favicon Generator** (Recommended):
   - Kunjungi: https://realfavicongenerator.net/
   - Upload file: `public/Gemini_Generated_Image_wky7vswky7vswky7-removebg-preview.png`
   - Pilih "Crop" dan pilih bagian tengah/utama dari gambar
   - Download hasilnya
   - Ganti file `public/icon.png` dengan hasil yang sudah di-optimize

2. **Image Editor Online**:
   - Kunjungi: https://www.iloveimg.com/resize-image atau https://www.photopea.com/
   - Upload gambar
   - Crop ke bagian penting (center crop)
   - Resize ke 32x32 atau 64x64 pixel
   - Save sebagai PNG
   - Ganti `public/icon.png`

## Tips untuk Favicon yang Jelas:

1. **Crop ke bagian tengah** - Pilih bagian paling penting/iconic dari gambar
2. **Ukuran optimal**: 32x32 atau 64x64 pixel
3. **Simplify detail** - Kurangi detail yang tidak perlu karena akan terlihat kecil
4. **High contrast** - Pastikan kontras cukup agar terlihat jelas di background putih

## Setelah Optimize:

1. Ganti file `public/icon.png` dengan versi yang sudah di-optimize
2. Restart dev server
3. Hard refresh browser (Ctrl+Shift+R) untuk clear cache favicon

