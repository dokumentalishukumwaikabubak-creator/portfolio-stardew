# Setup Database Supabase - Portfolio Website

Dokumentasi ini menjelaskan cara setup database Supabase untuk portfolio website.

## Langkah 1: Persiapan

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Navigasi ke **SQL Editor**

## Langkah 2: Jalankan Migration

### A. Initial Schema (001_initial_schema.sql)

Copy dan paste entire content dari file `supabase/migrations/001_initial_schema.sql` ke SQL Editor, lalu klik **Run**.

Migration ini akan membuat:
- 5 tabel utama (profiles, categories, portfolio_items, personal_info, skills)
- Indexes untuk query optimization
- Row Level Security (RLS) policies
- Sample data (1 personal_info, 4 categories, 8 skills)

### B. Storage Setup (002_storage_setup.sql)

Copy dan paste entire content dari file `supabase/migrations/002_storage_setup.sql` ke SQL Editor, lalu klik **Run**.

Migration ini akan membuat:
- Storage bucket: `portfolio-images` (public)
- Storage policies untuk upload/delete images

**IMPORTANT**: Jika ada error "bucket already exists", itu normal - abaikan saja.

## Langkah 3: Verify Setup

### Check Tables

Navigasi ke **Table Editor** di Supabase Dashboard, Anda harus melihat 5 tabel:
- ✓ profiles
- ✓ categories (berisi 4 sample categories)
- ✓ portfolio_items (kosong)
- ✓ personal_info (berisi 1 sample data)
- ✓ skills (berisi 8 sample skills)

### Check Storage

Navigasi ke **Storage** di Supabase Dashboard, Anda harus melihat:
- ✓ Bucket: `portfolio-images` (public)

### Check Policies

Navigasi ke **Authentication > Policies**, verify RLS policies sudah active untuk semua tabel.

## Langkah 4: Create Admin User

1. Navigasi ke **Authentication > Users**
2. Klik **Add User** > **Create new user**
3. Input:
   - Email: `admin@example.com` (atau email Anda)
   - Password: `password123` (atau password aman lainnya)
   - Email Confirm: Yes
4. Klik **Create user**

**IMPORTANT**: Simpan credentials ini - Anda akan menggunakannya untuk login ke admin panel!

## Langkah 5: Test Database

### Option 1: Menggunakan SQL Editor

Run query test di SQL Editor:

\`\`\`sql
-- Check categories
SELECT * FROM categories;

-- Check personal info
SELECT * FROM personal_info;

-- Check skills
SELECT * FROM skills;
\`\`\`

Semua query harus return data.

### Option 2: Menggunakan Next.js App

1. Pastikan environment variables sudah di-set di `.env.local`
2. Jalankan `pnpm dev`
3. Buka [http://localhost:3000](http://localhost:3000)
4. Jika home page menampilkan stats dan personal info, database setup berhasil!

## Troubleshooting

### Error: "relation already exists"

Jika Anda mendapat error ini saat run migration, artinya tabel sudah ada. Anda punya 2 opsi:

**Option A: Drop dan recreate (HANYA untuk development)**
\`\`\`sql
-- WARNING: Ini akan menghapus semua data!
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS personal_info CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Kemudian run migration lagi
\`\`\`

**Option B: Skip tabel yang sudah ada**
- Comment out bagian CREATE TABLE yang error
- Hanya jalankan bagian yang belum dibuat

### Error: "permission denied for table"

RLS policies mungkin belum di-enable. Run:
\`\`\`sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
\`\`\`

### Storage Bucket Error

Jika storage bucket tidak bisa dibuat via SQL:

1. Go to **Storage** di Supabase Dashboard
2. Klik **Create bucket**
3. Name: `portfolio-images`
4. Public: **Yes**
5. Klik **Create bucket**

Kemudian run storage policies manually via SQL Editor.

## Next Steps

Setelah database setup selesai:

1. ✓ Database schema created
2. ✓ Sample data inserted
3. ✓ Storage bucket ready
4. ✓ Admin user created

Lanjut ke:
- Setup environment variables di Next.js app
- Login ke admin panel
- Tambahkan portfolio items

## Additional Notes

### Sample Data

Migration sudah include sample data:

**Categories:**
- Web Development
- Mobile Apps
- UI/UX Design
- Open Source

**Personal Info:**
- Name: John Doe
- Title: Full Stack Developer
- Email: john@example.com

**Skills:**
- React (Level 5)
- Next.js (Level 5)
- TypeScript (Level 4)
- Node.js (Level 4)
- Supabase (Level 4)
- Tailwind CSS (Level 5)
- PostgreSQL (Level 3)
- Git (Level 4)

Anda dapat edit/delete sample data ini via Admin Panel setelah login.

### Production Setup

Untuk production deployment:

1. Gunakan password yang kuat untuk admin user
2. Backup database regularly via Supabase Dashboard
3. Monitor usage di Supabase Dashboard > Reports
4. Setup alerts untuk storage quota

## Support

Jika menemukan masalah saat setup database:

1. Check Supabase Dashboard > Logs untuk error messages
2. Verify semua migrations sudah dijalankan dengan benar
3. Test koneksi dari Next.js app
4. Konsultasi Supabase documentation: https://supabase.com/docs
