# Portfolio Website - Stardew Valley Theme

Portfolio website dengan aesthetic retro Stardew Valley, dibangun menggunakan Next.js 14 dan Supabase.

## Teknologi Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL Database + Authentication + Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Fitur

### Frontend Portfolio
- **Home Page**: Hero section dengan stats dan featured projects
- **Portfolio Page**: Grid showcase dengan category filter
- **Portfolio Detail**: Detail project dengan image galleries
- **About Page**: Personal info, skills, dan contact

### Admin Panel
- **Dashboard**: Overview stats dan quick actions
- **Portfolio CRUD**: Manage portfolio items (create, read, update, delete)
- **Categories Management**: Organize portfolio by categories
- **Personal Info Editor**: Edit about section content
- **Image Upload**: Upload images ke Supabase Storage
- **Authentication**: Login/logout dengan Supabase Auth

### Design Features
- Stardew Valley inspired aesthetic dengan earth tones
- Pixel borders dan retro typography (Press Start 2P, VT323)
- Responsive design untuk desktop dan mobile
- Custom Tailwind utilities untuk retro styling

## Setup Development

### 1. Clone Repository

\`\`\`bash
cd portfolio-nextjs
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Setup Supabase

#### A. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create new project
3. Copy your project URL and anon key

#### B. Setup Environment Variables

Copy \`.env.local.example\` to \`.env.local\` and fill in your Supabase credentials:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Update \`.env.local\`:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
\`\`\`

#### C. Run Database Migrations

**Lihat dokumentasi lengkap di [SETUP_DATABASE.md](./SETUP_DATABASE.md)**

Quick steps:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migrations in order:
   - \`supabase/migrations/001_initial_schema.sql\`
   - \`supabase/migrations/002_storage_setup.sql\`

#### D. Create Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User" > "Create new user"
3. Enter email and password for admin account
4. Note: Use this credential to login to admin panel

### 4. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Access Admin Panel

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login dengan credentials yang dibuat di step 3D
3. Start managing your portfolio!

## Project Structure

\`\`\`
portfolio-nextjs/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── about/
│   │   └── page.tsx              # About page
│   ├── portfolio/
│   │   ├── page.tsx              # Portfolio grid page
│   │   └── [id]/
│   │       └── page.tsx          # Portfolio detail page
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Admin login
│   │   └── dashboard/
│   │       └── page.tsx          # Admin dashboard
│   └── globals.css               # Global styles
├── components/
│   ├── Navigation.tsx            # Main navigation
│   ├── Footer.tsx                # Footer component
│   └── portfolio/
│       └── PortfolioCard.tsx     # Portfolio card component
├── lib/
│   └── supabase.ts               # Supabase client & helpers
├── types/
│   └── database.types.ts         # TypeScript types
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql    # Database schema
│       └── 002_storage_setup.sql     # Storage bucket setup
└── public/
    └── images/                   # Static images
\`\`\`

## Database Schema

### Tables

1. **profiles** - User profiles (extends auth.users)
2. **categories** - Portfolio categories
3. **portfolio_items** - Portfolio projects
4. **personal_info** - Personal information untuk about page
5. **skills** - Skills dengan proficiency levels

### Row Level Security (RLS)

- **Public Read**: Semua tabel memiliki public read access
- **Authenticated Write**: Hanya authenticated users (admin) dapat create/update/delete
- **Storage**: Public read, authenticated write untuk portfolio-images bucket

## Deployment ke Vercel

### Prerequisites
- GitHub account
- Vercel account (dapat login dengan GitHub)

### Steps

1. **Push ke GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-github-repo-url
   git push -u origin main
   \`\`\`

2. **Deploy ke Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: \`pnpm build\`
     - Output Directory: .next

3. **Set Environment Variables**
   Di Vercel dashboard, go to Settings > Environment Variables, tambahkan:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   \`\`\`

4. **Deploy**
   - Click "Deploy"
   - Wait untuk deployment selesai
   - Your website akan tersedia di \`https://your-project.vercel.app\`

### Production Checklist

- [ ] Supabase migrations sudah dijalankan
- [ ] Admin user sudah dibuat
- [ ] Environment variables sudah di-set di Vercel
- [ ] Sample content sudah ditambahkan (optional)
- [ ] Test all pages dan features
- [ ] Setup custom domain (optional)

## Customization

### Design Tokens

Edit \`tailwind.config.ts\` untuk mengubah theme:
- Colors (primary, secondary, accent, neutral)
- Typography (fonts, sizes)
- Spacing, borders, shadows
- Animation durations

### Content

1. **Personal Info**: Edit via Admin Panel > Personal Info
2. **Portfolio Items**: Manage via Admin Panel > Portfolio
3. **Categories**: Edit via Supabase Dashboard atau tambahkan via SQL
4. **Skills**: Edit via Supabase Dashboard atau tambahkan via SQL

## Troubleshooting

### Database Connection Error
- Pastikan environment variables sudah benar
- Check Supabase project status
- Verify RLS policies sudah di-enable

### Authentication Error
- Clear browser cookies
- Check admin user sudah dibuat di Supabase
- Verify email/password correct

### Image Upload Error
- Check storage bucket \`portfolio-images\` sudah dibuat
- Verify storage policies sudah di-setup
- Check file size (max 5MB recommended)

## License

MIT

## Support

Untuk pertanyaan atau issues, silakan buat issue di GitHub repository.
