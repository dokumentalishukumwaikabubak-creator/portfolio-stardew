'use client';

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import PortfolioManager from '@/components/admin/PortfolioManager'

interface Stats {
  portfolioCount: number
  categoryCount: number
  skillCount: number
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    portfolioCount: 0,
    categoryCount: 0,
    skillCount: 0,
  })

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.href = '/admin/login'
      return
    }
    setLoading(false)
  }

  async function fetchStats() {
    try {
      const [portfolioData, categoryData, skillData] = await Promise.all([
        supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        portfolioCount: portfolioData.count || 0,
        categoryCount: categoryData.count || 0,
        skillCount: skillData.count || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-stone-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-stone-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-stone-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <AdminHeader title="Dashboard" subtitle="Overview of your portfolio" />

        <div className="p-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Quick Statistics</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.portfolioCount}</div>
              <div className="text-stone-600">Portfolio Items</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.categoryCount}</div>
              <div className="text-stone-600">Categories</div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.skillCount}</div>
              <div className="text-stone-600">Skills</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-stone-800 mb-6">Quick Actions</h2>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link
              href="/admin/portfolio/new"
              className="bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition-colors text-center"
            >
              <div className="text-2xl mb-2">➕</div>
              <div>Add Portfolio Item</div>
            </Link>

            <Link
              href="/admin/skills"
              className="bg-orange-600 text-white rounded-lg p-4 hover:bg-orange-700 transition-colors text-center"
            >
              <div className="text-2xl mb-2">⚡</div>
              <div>Manage Skills</div>
            </Link>

            <Link
              href="/admin/categories"
              className="bg-green-600 text-white rounded-lg p-4 hover:bg-green-700 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🏷️</div>
              <div>Manage Categories</div>
            </Link>

            <Link
              href="/admin/personal-info"
              className="bg-purple-600 text-white rounded-lg p-4 hover:bg-purple-700 transition-colors text-center"
            >
              <div className="text-2xl mb-2">👤</div>
              <div>Edit Personal Info</div>
            </Link>
          </div>

          {/* Portfolio Manager Embedded */}
          <PortfolioManager />
        </div>
      </div>
    </div>
  )
}
