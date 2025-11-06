// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Briefcase, 
  Folder, 
  User, 
  Star,
  LogOut,
  Plus,
  Loader2
} from 'lucide-react'

interface Stats {
  portfolioCount: number
  categoryCount: number
  skillCount: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    portfolioCount: 0,
    categoryCount: 0,
    skillCount: 0,
  })
  const [recentProjects, setRecentProjects] = useState<any[]>([])

  useEffect(() => {
    checkAuth()
    fetchStats()
    fetchRecentProjects()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    setLoading(false)
  }

  async function fetchStats() {
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
  }

  async function fetchRecentProjects() {
    const { data } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    setRecentProjects(data || [])
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="animate-spin text-accent-500" size={48} />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-heading text-primary-900">ADMIN DASHBOARD</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-700 text-white font-subheading hover:bg-neutral-900 transition-colors pixel-border"
        >
          <LogOut size={20} /> LOGOUT
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card-vintage text-center bg-gradient-to-br from-accent-50 to-accent-100">
          <Briefcase className="mx-auto mb-3 text-accent-500" size={40} />
          <div className="text-4xl font-heading text-accent-700 mb-2">{stats.portfolioCount}</div>
          <div className="font-subheading text-lg text-neutral-700">Portfolio Items</div>
        </div>

        <div className="card-vintage text-center bg-gradient-to-br from-secondary-50 to-secondary-100">
          <Folder className="mx-auto mb-3 text-secondary-500" size={40} />
          <div className="text-4xl font-heading text-secondary-700 mb-2">{stats.categoryCount}</div>
          <div className="font-subheading text-lg text-neutral-700">Categories</div>
        </div>

        <div className="card-vintage text-center bg-gradient-to-br from-primary-50 to-primary-100">
          <Star className="mx-auto mb-3 text-primary-500" size={40} />
          <div className="text-4xl font-heading text-primary-700 mb-2">{stats.skillCount}</div>
          <div className="font-subheading text-lg text-neutral-700">Skills</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading text-primary-900 mb-6">QUICK ACTIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/portfolio/new"
            className="card-vintage hover:shadow-card-hover transition-all flex items-center gap-3 justify-center py-6"
          >
            <Plus className="text-accent-500" size={24} />
            <span className="font-subheading text-lg">Add Portfolio Item</span>
          </Link>
          <Link
            href="/admin/categories"
            className="card-vintage hover:shadow-card-hover transition-all flex items-center gap-3 justify-center py-6"
          >
            <Folder className="text-secondary-500" size={24} />
            <span className="font-subheading text-lg">Manage Categories</span>
          </Link>
          <Link
            href="/admin/personal-info"
            className="card-vintage hover:shadow-card-hover transition-all flex items-center gap-3 justify-center py-6"
          >
            <User className="text-primary-500" size={24} />
            <span className="font-subheading text-lg">Edit Personal Info</span>
          </Link>
          <Link
            href="/admin/portfolio"
            className="card-vintage hover:shadow-card-hover transition-all flex items-center gap-3 justify-center py-6"
          >
            <Briefcase className="text-accent-500" size={24} />
            <span className="font-subheading text-lg">All Portfolio Items</span>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div>
          <h2 className="text-2xl font-heading text-primary-900 mb-6">RECENT PROJECTS</h2>
          <div className="card-vintage">
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-background-page hover:bg-primary-50 transition-colors"
                >
                  <div>
                    <h3 className="font-subheading text-lg text-primary-900">{project.title}</h3>
                    <p className="font-body text-sm text-neutral-600 line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                  <Link
                    href={`/admin/portfolio/${project.id}`}
                    className="px-4 py-2 bg-accent-500 text-white font-subheading hover:bg-accent-700 transition-colors"
                  >
                    EDIT
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
