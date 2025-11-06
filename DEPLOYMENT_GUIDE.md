# Panduan Deployment - Portfolio Website Stardew Valley Theme

## Pilihan Platform Deployment

### Option 1: Vercel (Direkomendasikan) ⭐

Vercel adalah platform terbaik untuk Next.js karena dibuat oleh tim yang sama.

#### Langkah-langkah:

1. **Push Code ke GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy ke Vercel**
   - Buka https://vercel.com
   - Sign up / Login dengan akun GitHub
   - Click "New Project"
   - Import repository Anda
   - Vercel akan auto-detect Next.js project

3. **Set Environment Variables**
   Di Vercel dashboard, masuk ke Project Settings > Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ctzhzsrnpvohmxmmdltg.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Deploy**
   - Click "Deploy"
   - Tunggu proses build (~2-3 menit)
   - Website akan live di `https://your-project.vercel.app`

#### Auto-Deployment
Setiap kali Anda push ke GitHub, Vercel akan otomatis rebuild dan deploy.

---

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Project**
   ```bash
   cd portfolio-nextjs
   pnpm build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables**
   Di Netlify dashboard > Site settings > Environment variables

---

### Option 3: Docker (Self-Hosting)

1. **Create Dockerfile** (sudah ada di project)

2. **Build Docker Image**
   ```bash
   docker build -t portfolio-nextjs .
   ```

3. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=https://ctzhzsrnpvohmxmmdltg.supabase.co \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key> \
     portfolio-nextjs
   ```

---

### Option 4: Manual Node.js Deployment

Untuk VPS (DigitalOcean, Linode, AWS EC2, dll):

1. **Install Node.js 20+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Upload Project ke Server**
   ```bash
   scp -r portfolio-nextjs user@your-server:/var/www/
   ```

3. **Install Dependencies & Build**
   ```bash
   cd /var/www/portfolio-nextjs
   npm install -g pnpm
   pnpm install
   pnpm build
   ```

4. **Setup Environment Variables**
   ```bash
   nano .env.local
   # Paste environment variables
   ```

5. **Run with PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Setup Database (Supabase)

Database sudah dikonfigurasi di Supabase. Untuk setup fresh database:

1. Buka Supabase Dashboard
2. Pilih project: `ctzhzsrnpvohmxmmdltg`
3. Run migration files di `supabase/migrations/`

Atau gunakan script:
```bash
cd portfolio-nextjs
node run-migration.js
```

---

## Testing Setelah Deployment

1. **Frontend Pages**
   - [ ] Homepage (/)
   - [ ] Portfolio (/portfolio)
   - [ ] Portfolio Detail (/portfolio/[id])
   - [ ] About (/about)

2. **Admin Panel**
   - [ ] Login (/admin/login)
   - [ ] Dashboard (/admin/dashboard)
   - [ ] Portfolio Management (/admin/portfolio)
   - [ ] Categories Management (/admin/categories)
   - [ ] Personal Info Editor (/admin/personal-info)

3. **Features**
   - [ ] Image upload ke Supabase Storage
   - [ ] CRUD operations untuk portfolio items
   - [ ] Category filtering
   - [ ] Responsive design (mobile, tablet, desktop)

---

## Troubleshooting

### Build Error: "Invalid API Key"
- Check environment variables sudah benar
- Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY terset

### Database Connection Error
- Verify Supabase project aktif
- Check migrations sudah di-run
- Verify RLS policies sudah di-setup

### Image Upload Gagal
- Check storage bucket "portfolio-images" sudah dibuat
- Verify storage policies allow public upload
- Check file size limits (default 5MB)

---

## Admin Credentials (Default)

**IMPORTANT**: Ubah password setelah deployment pertama!

```
Email: admin@portfolio.com
Password: password123
```

Untuk mengganti password:
1. Login ke admin panel
2. Buka Supabase Dashboard > Authentication > Users
3. Reset password untuk user admin

---

## Performance Tips

1. **Enable Caching**
   - Vercel & Netlify: Auto-enabled
   - Manual: Setup CDN (Cloudflare, AWS CloudFront)

2. **Image Optimization**
   - Next.js Image component sudah digunakan
   - Supabase Storage auto-optimizes images

3. **Database Optimization**
   - Index sudah dibuat untuk foreign keys
   - Use pagination untuk large datasets

---

## Support

Jika ada masalah deployment:
1. Check build logs untuk error messages
2. Verify environment variables
3. Test locally terlebih dahulu dengan `pnpm dev`
4. Check Supabase dashboard untuk database issues

---

**Project Status**: Production Ready ✅
**Tech Stack**: Next.js 14 + TypeScript + Tailwind CSS + Supabase
**Build Time**: ~2-3 minutes
**Bundle Size**: ~140KB (gzipped)
