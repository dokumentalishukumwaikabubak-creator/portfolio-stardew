// @ts-nocheck
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogIn, Loader2, AlertCircle } from 'lucide-react'
import { checkRateLimit, getRateLimitStatus } from '@/lib/rateLimit'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="font-body text-neutral-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rateLimitStatus, setRateLimitStatus] = useState<{ remaining: number; resetTime: number; blocked: boolean } | null>(null)

  useEffect(() => {
    // Check if user is already logged in (with small delay to avoid race condition)
    const checkSession = async () => {
      // Small delay to ensure logout is complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const redirect = searchParams.get('redirect') || '/admin/dashboard'
        router.push(redirect)
      }
    }
    
    checkSession()

    // Check rate limit status
    if (email) {
      const status = getRateLimitStatus(email)
      setRateLimitStatus(status)
    }
  }, [email, router, searchParams])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check rate limit
    const rateLimit = checkRateLimit(email || 'unknown')
    if (!rateLimit.allowed) {
      const minutesLeft = Math.ceil((rateLimit.resetTime - Date.now()) / 60000)
      setError(`Too many login attempts. Please try again in ${minutesLeft} minute(s).`)
      setLoading(false)
      setRateLimitStatus({
        remaining: 0,
        resetTime: rateLimit.resetTime,
        blocked: true,
      })
      return
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      // Generic error message untuk security (tidak reveal apakah email exist atau tidak)
      setError('Invalid email or password')
      // Log actual error untuk debugging (hanya di development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', signInError)
      }
      setLoading(false)
      setRateLimitStatus(getRateLimitStatus(email))
      return
    }

    if (data.session) {
      const redirect = searchParams.get('redirect') || '/admin/dashboard'
      router.push(redirect)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card-vintage max-w-md w-full">
        <div className="text-center mb-8">
          <LogIn className="mx-auto mb-4 text-accent-500" size={48} />
          <h1 className="text-3xl font-heading text-primary-900 mb-2">ADMIN LOGIN</h1>
          <p className="font-body text-neutral-600">Masuk untuk mengelola portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block font-subheading text-lg mb-2">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-retro"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-subheading text-lg mb-2">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-retro"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-semantic-error/10 border-2 border-semantic-error text-semantic-error font-body flex items-start gap-2">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Login Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {rateLimitStatus && rateLimitStatus.remaining < 3 && rateLimitStatus.remaining > 0 && (
            <div className="p-3 bg-yellow-50 border-2 border-yellow-400 text-yellow-800 font-body text-sm">
              ⚠️ {rateLimitStatus.remaining} attempt(s) remaining
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-retro flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                LOADING...
              </>
            ) : (
              <>
                <LogIn size={20} />
                LOGIN
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-body text-sm text-neutral-500">
            Belum punya akun? Hubungi administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
