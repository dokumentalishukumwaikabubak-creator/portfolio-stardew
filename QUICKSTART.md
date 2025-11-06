# Quick Start Guide

Panduan cepat untuk setup dan run portfolio website.

## Prerequisite

- Node.js >= 20.9.0
- pnpm (atau npm/yarn)
- Akun Supabase (gratis di https://supabase.com)

## Setup dalam 5 Langkah

### 1. Install Dependencies

\`\`\`bash
cd portfolio-nextjs
pnpm install
\`\`\`

### 2. Setup Supabase Database

1. Buat project di [Supabase](https://supabase.com)
2. Copy URL dan anon key
3. Di Supabase Dashboard, go to **SQL Editor**
4. Run file ini secara berurutan:
   - Copy isi \`supabase/migrations/001_initial_schema.sql\` → Paste → Run
   - Copy isi \`supabase/migrations/002_storage_setup.sql\` → Paste → Run

### 3. Create Admin User

Di Supabase Dashboard:
- Go to **Authentication** > **Users**
- Click **Add User** > **Create new user**
- Email: \`admin@example.com\` (atau email Anda)
- Password: (buat password yang kuat)
- Click **Create user**

### 4. Setup Environment Variables

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit \`.env.local\`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
\`\`\`

### 5. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Buka http://localhost:3000

## Access Points

- **Home**: http://localhost:3000
- **Portfolio**: http://localhost:3000/portfolio
- **About**: http://localhost:3000/about
- **Admin Login**: http://localhost:3000/admin/login

## Deploy ke Vercel

\`\`\`bash
# 1. Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 2. Import di Vercel (vercel.com)
# 3. Set environment variables
# 4. Deploy!
\`\`\`

## Troubleshooting

**Error: Supabase connection failed**
- Check environment variables di \`.env.local\`
- Pastikan Supabase project aktif

**Error: Admin login failed**
- Pastikan admin user sudah dibuat di Supabase
- Check email/password correct

**Error: Images not uploading**
- Pastikan storage migration (002_storage_setup.sql) sudah dijalankan

## Dokumentasi Lengkap

- **Setup**: [README.md](./README.md)
- **Database**: [SETUP_DATABASE.md](./SETUP_DATABASE.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Overview**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

## Sample Content

Database migrations sudah include sample data:
- 1 personal info (John Doe)
- 4 categories (Web Dev, Mobile, UI/UX, Open Source)
- 8 skills (React, Next.js, TypeScript, etc.)

Edit via admin panel atau Supabase Dashboard.

## Support

Jika menemui masalah:
1. Check dokumentasi lengkap di README.md
2. Review error messages di browser console
3. Check Supabase logs di Dashboard > Logs
