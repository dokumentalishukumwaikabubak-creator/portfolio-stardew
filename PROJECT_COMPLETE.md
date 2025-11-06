# Portfolio Website - Stardew Valley Theme

## Status: Production Ready ✅

Website portfolio dengan tema Stardew Valley aesthetic telah selesai dibangun dan siap untuk di-deploy.

---

## Fitur Lengkap

### Frontend (Public Pages)

✅ **Home Page** (`/`)
- Hero section dengan Stardew Valley theme
- Stats overview (Total Projects, Years Experience, Happy Clients)
- Featured projects showcase
- Call-to-action buttons

✅ **Portfolio Page** (`/portfolio`)
- Grid layout untuk semua portfolio items
- Category filtering (All, Web Development, Mobile App, Design, dll)
- Responsive grid (1 column mobile, 2-3 columns desktop)
- Click untuk melihat detail

✅ **Portfolio Detail** (`/portfolio/[id]`)
- Full project description
- Project images gallery
- Technologies used
- Links ke demo & GitHub
- Category badge
- Back to portfolio button

✅ **About Page** (`/about`)
- Profile photo upload
- Personal bio
- Skills showcase dengan star ratings
- Contact information
- Social media links (GitHub, LinkedIn, Twitter)

### Admin Panel

✅ **Authentication** (`/admin/login`)
- Email & password login
- Supabase Auth integration
- Session management
- Auto-redirect jika sudah login

✅ **Dashboard** (`/admin/dashboard`)
- Quick stats overview
- Total portfolio items
- Categories count
- Quick navigation ke management pages

✅ **Portfolio Management** (`/admin/portfolio`)
- List semua portfolio items
- Create, Read, Update, Delete operations
- Featured toggle
- Image upload ke Supabase Storage
- Category assignment
- Demo & GitHub URL fields

✅ **Categories Management** (`/admin/categories`)
- Inline editing
- Add new categories
- Delete categories
- Auto-generate slug dari nama
- Description field

✅ **Personal Info Editor** (`/admin/personal-info`)
- Edit name, title, bio
- Profile photo upload
- Email & social media links
- Preview changes
- Image management (upload/delete)

### Design Features

✅ **Stardew Valley Aesthetic**
- Earth tone color palette (browns, greens, warm oranges)
- Pixel borders dengan box shadow
- Retro typography (Press Start 2P, VT323, Lato)
- Vintage card styles
- 8-bit inspired animations
- Warm, cozy atmosphere

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints untuk tablet & desktop
- Responsive images dengan Next.js Image component
- Flexible grid layouts
- Touch-friendly UI pada mobile

✅ **Accessibility**
- Semantic HTML elements
- ARIA labels untuk icons
- Keyboard navigation support
- Color contrast compliance
- Alt text untuk images

---

## Tech Stack

**Framework**: Next.js 14.2.19 (App Router)  
**Language**: TypeScript  
**Styling**: Tailwind CSS v3  
**Icons**: Lucide React  
**Backend**: Supabase  
- PostgreSQL Database
- Authentication
- Storage (Image uploads)
- Row Level Security (RLS)

**Hosting Options**: Vercel, Netlify, Docker, VPS

---

## Database Schema

### Tables

1. **users** - Admin authentication
2. **categories** - Portfolio categories
3. **portfolio_items** - Project showcase items
4. **personal_info** - About page content
5. **skills** - Skills dengan rating

### Storage

**Bucket**: `portfolio-images`
- Public access
- Auto-optimization
- Direct URL access

---

## File Structure

```
portfolio-nextjs/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── about/                   # About page
│   ├── portfolio/               # Portfolio pages
│   │   ├── page.tsx            # Portfolio listing
│   │   └── [id]/page.tsx       # Portfolio detail
│   └── admin/                   # Admin panel
│       ├── login/
│       ├── dashboard/
│       ├── portfolio/
│       ├── categories/
│       └── personal-info/
├── components/                   # Reusable components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── portfolio/
│       └── PortfolioCard.tsx
├── lib/                         # Utilities
│   └── supabase.ts             # Supabase client & helpers
├── types/                       # TypeScript types
│   └── database.types.ts       # Generated from Supabase
├── public/                      # Static assets
├── supabase/                    # Database migrations
│   └── migrations/
├── next.config.mjs              # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

---

## Environment Variables

Buat file `.env.local` di root project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ctzhzsrnpvohmxmmdltg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-here>
```

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

---

## Deployment

Lihat file `DEPLOYMENT_GUIDE.md` untuk instruksi lengkap deployment ke:
- ✅ Vercel (Recommended)
- ✅ Netlify
- ✅ Docker
- ✅ Manual VPS Deployment

**Quick Start (Vercel)**:
1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables
4. Deploy!

---

## Default Credentials

⚠️ **PENTING**: Ganti password setelah deployment pertama!

```
Email: admin@portfolio.com
Password: password123
```

---

## Customization Guide

### Warna Theme
Edit `tailwind.config.ts` untuk mengubah color palette:
```typescript
colors: {
  primary: { ... },    // Brown tones
  secondary: { ... },  // Green tones
  accent: { ... },     // Orange tones
}
```

### Typography
Font sudah di-import di `globals.css`:
- **Heading**: Press Start 2P (pixel font)
- **Subheading**: VT323 (retro monospace)
- **Body**: Lato + Inter (clean sans-serif)

### Logo/Branding
Replace images di `public/` folder

### Content
Semua content editable via Admin Panel:
- Personal info di `/admin/personal-info`
- Portfolio items di `/admin/portfolio`
- Categories di `/admin/categories`

---

## Testing Checklist

### Frontend
- [ ] Homepage loads dengan featured projects
- [ ] Portfolio page menampilkan semua items
- [ ] Category filter berfungsi
- [ ] Portfolio detail page accessible
- [ ] About page menampilkan personal info
- [ ] Responsive di mobile, tablet, desktop
- [ ] Images load dengan benar
- [ ] Links external berfungsi

### Admin Panel
- [ ] Login dengan credentials berfungsi
- [ ] Dashboard menampilkan stats
- [ ] Create portfolio item baru
- [ ] Upload image berhasil
- [ ] Edit portfolio item existing
- [ ] Delete portfolio item dengan konfirmasi
- [ ] Category management berfungsi
- [ ] Personal info editor save changes
- [ ] Logout berfungsi

### Database
- [ ] Data persist setelah refresh
- [ ] Image URLs valid dan accessible
- [ ] Relationships (portfolio <-> category) correct
- [ ] RLS policies allow public read, admin write

---

## Known Limitations

1. **Image Upload**: Max 5MB per file (configurable di Supabase)
2. **Authentication**: Single admin user (dapat ditambah via Supabase dashboard)
3. **Static Generation**: Some pages use server-side rendering (requires Node.js runtime)

---

## Future Enhancements (Optional)

- [ ] Multi-language support (i18n)
- [ ] Blog section
- [ ] Contact form dengan email notifications
- [ ] Analytics integration (Google Analytics, Plausible)
- [ ] SEO optimization (meta tags, sitemap.xml)
- [ ] Dark mode toggle
- [ ] Image optimization dan lazy loading
- [ ] Search functionality
- [ ] Tags/filters untuk portfolio items

---

## Support & Maintenance

### Update Dependencies
```bash
pnpm update
```

### Database Migrations
Jika ada perubahan schema:
```bash
node run-migration.js
```

### Backup
Backup Supabase database secara berkala di dashboard

---

## License

MIT License - Free to use dan modify

---

## Project Info

**Created**: 2025-11-06  
**Version**: 1.0.0  
**Status**: Production Ready  
**Build**: Next.js 14 + Supabase  
**Theme**: Stardew Valley Aesthetic
