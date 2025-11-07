# Rekomendasi Keamanan Admin Panel

## 🔒 Masalah Keamanan yang Ditemukan

### 1. **Client-Side Only Authentication** ⚠️ KRITIS
- **Masalah**: Semua halaman admin hanya check auth di client-side
- **Risiko**: User bisa bypass dengan disable JavaScript atau edit localStorage
- **Solusi**: Implementasi server-side middleware untuk proteksi route

### 2. **Tidak Ada Rate Limiting** ⚠️ TINGGI
- **Masalah**: Login page tidak ada rate limiting
- **Risiko**: Brute force attack pada login
- **Solusi**: Tambahkan rate limiting (max 5 attempts per 15 menit)

### 3. **Error Messages Terlalu Detail** ⚠️ SEDANG
- **Masalah**: Error message dari Supabase langsung ditampilkan
- **Risiko**: Information disclosure (user enumeration)
- **Solusi**: Generic error messages

### 4. **Tidak Ada Session Timeout** ⚠️ SEDANG
- **Masalah**: Session tidak expire otomatis
- **Risiko**: Session hijacking jika device tidak di-lock
- **Solusi**: Auto logout setelah 30 menit inactive

### 5. **Tidak Ada CSRF Protection** ⚠️ SEDANG
- **Masalah**: Tidak ada CSRF token untuk form submissions
- **Risiko**: CSRF attacks
- **Solusi**: Implementasi CSRF tokens

### 6. **Tidak Ada Audit Logging** ⚠️ RENDAH
- **Masalah**: Tidak ada log untuk aktivitas admin
- **Risiko**: Sulit track jika ada security breach
- **Solusi**: Log semua admin actions

## 🛡️ Rekomendasi Implementasi

### Priority 1: Server-Side Route Protection (KRITIS)

Buat middleware untuk proteksi semua route `/admin/*`:

```typescript
// middleware.ts (root level)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect all /admin routes except /admin/login
  if (req.nextUrl.pathname.startsWith('/admin') && 
      !req.nextUrl.pathname.startsWith('/admin/login')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Redirect to dashboard if logged in user tries to access login
  if (req.nextUrl.pathname === '/admin/login' && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

### Priority 2: Rate Limiting untuk Login

Implementasi rate limiting dengan Supabase atau external service:

```typescript
// lib/rateLimit.ts
const loginAttempts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const attempt = loginAttempts.get(identifier)

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 })
    return true
  }

  if (attempt.count >= 5) {
    return false // Blocked
  }

  attempt.count++
  return true
}
```

### Priority 3: Generic Error Messages

```typescript
// Jangan tampilkan error detail dari Supabase
if (signInError) {
  // Generic error message
  setError('Invalid email or password')
  // Log actual error untuk debugging
  console.error('Login error:', signInError)
}
```

### Priority 4: Session Timeout

```typescript
// Auto logout setelah 30 menit inactive
useEffect(() => {
  const timeout = setTimeout(() => {
    supabase.auth.signOut()
    router.push('/admin/login')
  }, 30 * 60 * 1000) // 30 minutes

  const resetTimeout = () => {
    clearTimeout(timeout)
    setTimeout(() => {
      supabase.auth.signOut()
      router.push('/admin/login')
    }, 30 * 60 * 1000)
  }

  window.addEventListener('mousemove', resetTimeout)
  window.addEventListener('keypress', resetTimeout)

  return () => {
    clearTimeout(timeout)
    window.removeEventListener('mousemove', resetTimeout)
    window.removeEventListener('keypress', resetTimeout)
  }
}, [])
```

### Priority 5: Audit Logging

Buat tabel untuk log aktivitas admin:

```sql
CREATE TABLE admin_audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INTEGER,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON admin_audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON admin_audit_logs(created_at);
```

## 🔐 Best Practices Tambahan

### 1. **Password Requirements**
- Minimum 12 karakter
- Kombinasi huruf besar, kecil, angka, simbol
- Tidak boleh sama dengan email

### 2. **2FA/MFA** (Optional, untuk production)
- Implementasi Two-Factor Authentication
- Menggunakan TOTP (Google Authenticator, Authy)

### 3. **IP Whitelist** (Optional)
- Restrict admin access dari IP tertentu saja
- Berguna untuk production environment

### 4. **Security Headers**
Tambahkan di `next.config.mjs`:

```javascript
async headers() {
  return [
    {
      source: '/admin/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ]
}
```

### 5. **Environment Variables Security**
- Jangan commit `.env.local` ke git
- Gunakan strong Supabase anon key
- Rotate keys secara berkala

### 6. **Database RLS Policies**
Pastikan RLS policies sudah benar:

```sql
-- Hanya authenticated users bisa write
CREATE POLICY "Authenticated users can manage portfolio items" 
ON portfolio_items FOR ALL 
USING (auth.role() = 'authenticated');

-- Public hanya bisa read
CREATE POLICY "Public can view portfolio items" 
ON portfolio_items FOR SELECT 
USING (true);
```

## 📋 Checklist Keamanan

- [ ] Implementasi server-side middleware
- [ ] Rate limiting untuk login
- [ ] Generic error messages
- [ ] Session timeout (30 menit)
- [ ] Audit logging
- [ ] Security headers
- [ ] Password requirements
- [ ] RLS policies verified
- [ ] Environment variables secure
- [ ] Regular security audits

## 🚀 Quick Wins (Implementasi Cepat)

1. **Generic Error Messages** - 5 menit
2. **Session Timeout** - 15 menit
3. **Security Headers** - 10 menit
4. **Rate Limiting** - 30 menit

## 📚 Resources

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

