# Deployment Guide - Portfolio Website

Panduan lengkap untuk deploy portfolio website ke Vercel.

## Prerequisites

- Node.js >= 20.9.0
- pnpm (atau npm/yarn)
- GitHub account
- Vercel account
- Supabase account dengan project aktif

## Step 1: Persiapan Local Development

### 1.1 Install Dependencies

\`\`\`bash
cd portfolio-nextjs
pnpm install
\`\`\`

### 1.2 Setup Environment Variables

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit \`.env.local\` dengan Supabase credentials Anda:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### 1.3 Setup Database

**IMPORTANT**: Ikuti instruksi lengkap di [SETUP_DATABASE.md](./SETUP_DATABASE.md)

Quick summary:
1. Login ke Supabase Dashboard
2. Go to SQL Editor
3. Run \`001_initial_schema.sql\`
4. Run \`002_storage_setup.sql\`
5. Create admin user via Authentication > Users

### 1.4 Test Local

\`\`\`bash
pnpm dev
\`\`\`

Verify:
- [ ] Home page loads dengan stats
- [ ] Portfolio page menampilkan categories
- [ ] About page menampilkan personal info
- [ ] Admin login works

## Step 2: Prepare for Deployment

### 2.1 Create Git Repository

\`\`\`bash
# Initialize git (jika belum)
git init

# Create .gitignore (sudah otomatis ada dari Next.js)
# Pastikan .env.local tidak di-commit!

# Add all files
git add .

# Commit
git commit -m "feat: portfolio website dengan Stardew Valley theme"
\`\`\`

### 2.2 Push ke GitHub

\`\`\`bash
# Create repo di GitHub terlebih dahulu, kemudian:
git remote add origin https://github.com/username/portfolio-website.git
git branch -M main
git push -u origin main
\`\`\`

## Step 3: Deploy ke Vercel

### 3.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Login dengan GitHub account
3. Click **Import Git Repository**
4. Select your portfolio repository
5. Click **Import**

### 3.2 Configure Project

**Framework Preset**: Next.js (auto-detected)

**Build & Development Settings**:
- Build Command: \`pnpm build\` (atau \`npm run build\`)
- Output Directory: \`.next\` (default)
- Install Command: \`pnpm install\` (atau \`npm install\`)

**Root Directory**: \`./\` (default)

### 3.3 Set Environment Variables

Di Vercel project settings, go to **Environment Variables** tab.

Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Your Supabase URL | All |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Your Supabase Anon Key | All |

**Important**: 
- Select "All" untuk environment (Production, Preview, Development)
- Don't expose these values publicly
- Supabase anon key is safe untuk client-side (protected by RLS)

### 3.4 Deploy

1. Click **Deploy**
2. Wait 2-5 minutes untuk build complete
3. Vercel akan provide URL: \`https://your-project.vercel.app\`

### 3.5 Verify Deployment

Visit your deployed URL dan check:
- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] Portfolio page loads dengan data dari Supabase
- [ ] About page displays personal info
- [ ] Admin login accessible at \`/admin/login\`
- [ ] Can login dengan admin credentials
- [ ] Dashboard displays stats

## Step 4: Post-Deployment Setup

### 4.1 Add Content

1. Login ke admin panel di \`your-url.vercel.app/admin/login\`
2. Add portfolio items:
   - Upload images
   - Fill descriptions
   - Set categories
   - Mark featured items
3. Update personal info di Personal Info page

### 4.2 Custom Domain (Optional)

1. Go to Vercel project > Settings > Domains
2. Add your custom domain (e.g., \`yourname.com\`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

### 4.3 Update URLs

Jika menggunakan custom domain, update:
- Supabase Auth redirect URLs (if using OAuth)
- Social media links
- Contact forms (if any)

## Step 5: Continuous Deployment

Setelah setup awal, setiap push ke GitHub main branch akan auto-deploy ke Vercel:

\`\`\`bash
# Make changes
git add .
git commit -m "update: tambah portfolio item baru"
git push

# Vercel akan auto-build dan deploy!
\`\`\`

## Troubleshooting

### Build Failed

**Error: Node version mismatch**
- Vercel menggunakan Node.js 20.x by default (compatible)
- Jika perlu specify version, add \`engines\` di \`package.json\`:
  \`\`\`json
  "engines": {
    "node": ">=20.9.0"
  }
  \`\`\`

**Error: Missing environment variables**
- Check Environment Variables di Vercel settings
- Pastikan both variables sudah di-set
- Redeploy setelah add variables

**Error: Type errors**
- Run \`pnpm build\` locally untuk check errors
- Fix TypeScript errors sebelum push

### Runtime Errors

**Error: Supabase connection failed**
- Verify environment variables correct
- Check Supabase project status
- Test Supabase URL di browser (should return JSON)

**Error: Auth not working**
- Check admin user sudah dibuat di Supabase
- Clear browser cache dan cookies
- Verify Supabase Auth is enabled

**Error: Images not uploading**
- Check storage bucket \`portfolio-images\` exists
- Verify storage policies di Supabase
- Check file size (max 50MB by Supabase, recommended 5MB)

### Performance Issues

**Slow page loads**
- Enable Vercel Analytics untuk monitor
- Check Supabase query performance
- Consider adding caching headers

**Images loading slow**
- Use Next.js Image component (sudah implemented)
- Compress images sebelum upload
- Consider using Vercel Image Optimization

## Monitoring & Maintenance

### Vercel Analytics

Enable di Vercel dashboard untuk:
- Page views tracking
- Performance metrics
- User behavior insights

### Supabase Monitoring

Check di Supabase Dashboard:
- Database usage (rows, storage)
- API requests (bandwidth)
- Auth events
- Logs untuk errors

### Regular Tasks

**Weekly**:
- Check for broken links
- Review new portfolio items
- Update personal info jika perlu

**Monthly**:
- Review analytics
- Backup database (Supabase provides daily backups)
- Update dependencies:
  \`\`\`bash
  pnpm update
  \`\`\`

**Quarterly**:
- Review design dan UX
- Add new features jika perlu
- Security audit (check Supabase RLS policies)

## Rollback Strategy

Jika deployment bermasalah:

1. **Quick Rollback via Vercel**:
   - Go to Vercel dashboard > Deployments
   - Find last working deployment
   - Click "..." > "Promote to Production"

2. **Rollback via Git**:
   \`\`\`bash
   git revert HEAD
   git push
   # Vercel akan auto-deploy previous version
   \`\`\`

## Scaling Considerations

### Free Tier Limits

**Vercel Free**:
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Edge network

**Supabase Free**:
- 500MB database storage
- 1GB file storage
- 50,000 monthly active users
- Paused after 1 week inactivity

### When to Upgrade

Consider upgrading jika:
- Traffic > 100GB/month (Vercel Pro)
- Database > 500MB (Supabase Pro)
- Need custom domain features
- Need priority support

## Security Best Practices

1. **Environment Variables**: Never commit secrets ke Git
2. **RLS Policies**: Always enable dan test thoroughly
3. **Admin Access**: Use strong passwords untuk admin
4. **HTTPS**: Always use (Vercel provides free)
5. **Updates**: Keep dependencies updated regularly

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Final Checklist

Sebelum announce portfolio ke public:

- [ ] All migrations run successfully
- [ ] Admin user created dan tested
- [ ] Sample content added (minimal 3-5 portfolio items)
- [ ] Personal info updated dengan data real
- [ ] Social links correct
- [ ] Contact email works
- [ ] All pages tested (home, portfolio, about, detail)
- [ ] Admin panel tested (login, dashboard, CRUD)
- [ ] Mobile responsive checked
- [ ] Images optimized dan loading
- [ ] SEO metadata updated
- [ ] Analytics enabled (optional)
- [ ] Custom domain configured (optional)
- [ ] Backup plan in place

Selamat! Portfolio website Anda sudah live!
