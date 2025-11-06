// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogIn, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push('/admin/dashboard')
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
            <div className="p-4 bg-semantic-error/10 border-2 border-semantic-error text-semantic-error font-body">
              {error}
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
