'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, User, LogIn, LayoutDashboard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/portfolio', label: 'Tiko Site', icon: Briefcase },
    { href: '/about', label: 'About', icon: User },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-background-surface pixel-border mb-8 sticky top-0 z-50 backdrop-blur-sm bg-background-surface/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-heading text-xl text-primary-900 hover:text-accent-500 transition-colors">
            PORTFOLIO
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 font-subheading text-lg transition-colors ${
                    isActive(item.href)
                      ? 'text-accent-500'
                      : 'text-neutral-700 hover:text-accent-500'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              )
            })}

            {/* Admin Link */}
            {isAuthenticated ? (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 font-subheading text-lg text-secondary-500 hover:text-secondary-700 transition-colors"
              >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Admin</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="flex items-center gap-2 font-subheading text-lg text-neutral-500 hover:text-accent-500 transition-colors"
              >
                <LogIn size={18} />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
