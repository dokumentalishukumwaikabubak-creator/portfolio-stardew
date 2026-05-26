# Panduan Google Apps Script (Database & Image Storage)

Berkas ini berisi petunjuk langkah demi langkah dan kode sumber yang perlu dipasang pada Google Apps Script Anda untuk menggantikan fungsi database Supabase dan Supabase Storage dengan Google Sheets dan Google Drive.

---

## Langkah Setup

### 1. Buka Apps Script
1. Buka spreadsheet Anda: [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1_jjP6fQg_ZYoYFEvXtpN9dRsPZ3PSSKVQMTlX2by8Qo/edit)
2. Klik menu **Extensions** > **Apps Script** di bagian atas halaman.

### 2. Tempel Kode Apps Script
1. Hapus semua kode default yang ada di tab editor (`Code.gs`).
2. Salin seluruh kode yang ada di bawah (lihat bagian [Kode Apps Script](#kode-apps-script)) dan tempelkan ke editor.
3. Klik tombol **Save** (ikon disket) atau tekan `Ctrl + S`.

### 3. Deploy sebagai Web App
1. Klik tombol **Deploy** di kanan atas, lalu pilih **New deployment**.
2. Klik ikon gir (Select type) di samping "Configuration", lalu pilih **Web app**.
3. Isi konfigurasi sebagai berikut:
   - **Description**: `Portfolio API`
   - **Execute as**: **Me (email Anda)** *(Sangat Penting! Ini agar script berjalan dengan izin akun Google Anda untuk mengakses Drive & Sheets)*
   - **Who has access**: **Anyone** *(Sangat Penting! Ini agar server Next.js dapat memanggil API tanpa hambatan otentikasi Google OAuth)*
4. Klik **Deploy**.
5. Jika diminta untuk memberikan izin (**Authorize Access**), klik dan pilih akun Google Anda, klik **Advanced**, lalu klik **Go to Portfolio API (unsafe)**, kemudian klik **Allow**.
6. Setelah deployment selesai, Anda akan mendapatkan **Web app URL** (berformat `https://script.google.com/macros/s/.../exec`).
7. Salin URL tersebut!

### 4. Konfigurasi di Next.js
1. Buka berkas `.env.local` di proyek Next.js Anda.
2. Ganti nilai `GOOGLE_SCRIPT_URL` dengan URL Web App yang baru saja Anda salin:
   ```env
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
   ```
3. Sesuaikan `GOOGLE_SCRIPT_API_KEY` jika Anda ingin mengubah kunci pengamannya (pastikan nilai di `.env.local` sama dengan nilai variabel `API_KEY` di atas script).

---

## Kode Apps Script

Salin kode di bawah ini secara utuh ke editor Google Apps Script:

```javascript
// ==========================================
// KONFIGURASI UTAMA
// ==========================================
const SPREADSHEET_ID = "1_jjP6fQg_ZYoYFEvXtpN9dRsPZ3PSSKVQMTlX2by8Qo";
const DRIVE_FOLDER_ID = "13Jz-q-5gai_9LCtRYH9QrxvfghCCnlxi";
const API_KEY = "my-super-secret-key-change-this"; // Harus sama dengan GOOGLE_SCRIPT_API_KEY di .env.local

// ==========================================
// API ENDPOINTS
// ==========================================

// Menangani permintaan GET (Read Operations)
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    // Pastikan sheet telah terinisialisasi
    checkAndInitSheets();
    
    if (action === 'readAll') {
      const data = {
        categories: getSheetData('categories'),
        portfolio_items: getSheetData('portfolio_items'),
        personal_info: getSheetData('personal_info'),
        skills: getSheetData('skills')
      };
      return responseJson({ data, error: null });
    }
    
    if (action === 'readSheet') {
      const sheetName = e.parameter.sheetName;
      if (!sheetName) return responseJson({ data: null, error: 'Missing sheetName parameter' }, 400);
      const data = getSheetData(sheetName);
      return responseJson({ data, error: null });
    }
    
    return responseJson({ data: null, error: 'Invalid or missing action' }, 400);
  } catch (error) {
    return responseJson({ data: null, error: error.message }, 500);
  }
}

// Menangani permintaan POST (Write & Upload Operations)
function doPost(e) {
  try {
    checkAndInitSheets();
    
    const postData = JSON.parse(e.postData.contents);
    
    // Verifikasi API Key
    if (postData.apiKey !== API_KEY) {
      return responseJson({ data: null, error: 'Unauthorized' }, 401);
    }
    
    const action = postData.action;
    
    if (action === 'insert') {
      const result = insertRow(postData.table, postData.data);
      return responseJson({ data: result, error: null });
    }
    
    if (action === 'update') {
      const result = updateRow(postData.table, postData.id, postData.data);
      return responseJson({ data: result, error: null });
    }
    
    if (action === 'delete') {
      const result = deleteRow(postData.table, postData.id);
      return responseJson({ data: result, error: null });
    }
    
    if (action === 'uploadImage') {
      const result = uploadImageToDrive(postData.fileData, postData.fileName);
      return responseJson({ data: result, error: null });
    }
    
    return responseJson({ data: null, error: 'Invalid action' }, 400);
  } catch (error) {
    return responseJson({ data: null, error: error.message }, 500);
  }
}

// ==========================================
// CORE FUNCTIONS
// ==========================================

function responseJson(obj, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Mengambil seluruh data dari sheet sebagai Array JSON
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return []; // Hanya header atau kosong
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const rows = [];
  
  for (let i = 1; i < values.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      let val = values[i][j];
      
      // Konversi tipe data khusus agar seragam
      if (headers[j] === 'is_featured') {
        row[headers[j]] = (val === true || val === 'true');
      } else if (headers[j] === 'id' || headers[j] === 'category_id' || headers[j] === 'level') {
        row[headers[j]] = (val !== '' && val !== null) ? Number(val) : null;
      } else {
        row[headers[j]] = val;
      }
    }
    rows.push(row);
  }
  return rows;
}

// Memasukkan baris data baru dengan ID unik (Auto Increment)
function insertRow(sheetName, rowData) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found: " + sheetName);
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Auto increment ID
  let nextId = 1;
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    const maxId = Math.max(...ids.map(r => Number(r[0]) || 0));
    nextId = maxId + 1;
  }
  
  rowData.id = nextId;
  rowData.created_at = new Date().toISOString();
  if (headers.includes('updated_at')) {
    rowData.updated_at = new Date().toISOString();
  }
  
  const newRowValues = headers.map(h => {
    return rowData[h] !== undefined ? rowData[h] : '';
  });
  
  sheet.appendRow(newRowValues);
  return [rowData];
}

// Mengupdate baris berdasarkan kolom ID
function updateRow(sheetName, id, updateData) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found: " + sheetName);
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) throw new Error("No data to update");
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().map(r => Number(r[0]));
  
  const rowIndex = ids.indexOf(Number(id));
  if (rowIndex === -1) throw new Error("Row not found with ID: " + id);
  
  const actualRowNumber = rowIndex + 2; // 1-indexed dan lewati header
  
  updateData.updated_at = new Date().toISOString();
  
  const currentValues = sheet.getRange(actualRowNumber, 1, 1, headers.length).getValues()[0];
  const updatedRowData = {};
  
  for (let j = 0; j < headers.length; j++) {
    const h = headers[j];
    if (updateData[h] !== undefined) {
      sheet.getRange(actualRowNumber, j + 1).setValue(updateData[h]);
      updatedRowData[h] = updateData[h];
    } else {
      updatedRowData[h] = currentValues[j];
    }
  }
  
  return [updatedRowData];
}

// Menghapus baris berdasarkan kolom ID
function deleteRow(sheetName, id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found: " + sheetName);
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) throw new Error("No data to delete");
  
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().map(r => Number(r[0]));
  const rowIndex = ids.indexOf(Number(id));
  if (rowIndex === -1) throw new Error("Row not found with ID: " + id);
  
  const actualRowNumber = rowIndex + 2;
  sheet.deleteRow(actualRowNumber);
  
  return { success: true };
}

// Mengunggah gambar base64 ke folder Google Drive dan menjadikannya publik
function uploadImageToDrive(base64Data, fileName) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  
  const parts = base64Data.split(',');
  const contentType = parts[0].split(':')[1].split(';')[0];
  const base64Str = parts[1];
  
  const decodedData = Utilities.base64Decode(base64Str);
  const blob = Utilities.newBlob(decodedData, contentType, fileName);
  
  const file = folder.createFile(blob);
  
  // Set hak akses file Drive agar siapa saja yang memiliki link dapat melihat
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  const fileId = file.getId();
  const directUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
  
  return { url: directUrl };
}

// Inisialisasi otomatis jika sheet-sheet belum terbuat
function checkAndInitSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  const requiredSheets = {
    categories: ['id', 'name', 'slug', 'description', 'created_at'],
    portfolio_items: ['id', 'title', 'description', 'full_description', 'image_url', 'demo_url', 'github_url', 'category_id', 'is_featured', 'start_date', 'end_date', 'created_at', 'updated_at'],
    personal_info: ['id', 'name', 'title', 'bio', 'email', 'github_url', 'linkedin_url', 'twitter_url', 'profile_image_url', 'hero_title', 'hero_subtitle', 'hero_tagline', 'created_at', 'updated_at'],
    skills: ['id', 'name', 'level', 'category', 'created_at']
  };
  
  for (const name in requiredSheets) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(requiredSheets[name]);
      
      // Seed default personal_info
      if (name === 'personal_info') {
        sheet.appendRow([
          1,
          'John Doe',
          'Full Stack Developer',
          'Passionate developer dengan pengalaman membangun aplikasi web modern menggunakan Next.js, React, dan Node.js.',
          'john@example.com',
          'https://github.com',
          'https://linkedin.com',
          'https://twitter.com',
          '',
          'Halo, saya John Doe!',
          'Welcome to Pelican Town',
          'Membangun aplikasi web interaktif dengan pixel art dan retro styling.',
          new Date().toISOString(),
          new Date().toISOString()
        ]);
      } else if (name === 'categories') {
        sheet.appendRow([1, 'Web Development', 'web-development', 'Full stack web applications', new Date().toISOString()]);
        sheet.appendRow([2, 'Mobile Apps', 'mobile-apps', 'Native dan cross-platform mobile apps', new Date().toISOString()]);
      } else if (name === 'skills') {
        sheet.appendRow([1, 'React', 5, 'Frontend', new Date().toISOString()]);
        sheet.appendRow([2, 'Next.js', 5, 'Frontend', new Date().toISOString()]);
        sheet.appendRow([3, 'Tailwind CSS', 5, 'Frontend', new Date().toISOString()]);
      }
    }
  }
}
```
