// @ts-nocheck
// @ts-nocheck
import Link from 'next/link'
import { ArrowRight, Star, Code, Palette } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PortfolioCard from '@/components/portfolio/PortfolioCard'
import type { PortfolioItemWithCategory, PersonalInfo, Category } from '@/types/database.types'

async function getPersonalInfo(): Promise<PersonalInfo | null> {
  const { data, error } = await supabase
    .from('personal_info')
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('Error fetching personal info:', error)
    return null
  }

  return data
}

async function getFeaturedProjects() {
  const { data: projects, error: projectsError } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (projectsError) {
    console.error('Error fetching projects:', projectsError)
    return []
  }

  // Manually fetch categories
  if (projects && projects.length > 0) {
    const categoryIds = [...new Set(projects.map(p => p.category_id).filter(Boolean))] as number[]
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .in('id', categoryIds)

    const projectsWithCategories: PortfolioItemWithCategory[] = projects.map(project => ({
      ...project,
      category: categories?.find(c => c.id === project.category_id) || null
    }))

    return projectsWithCategories
  }

  return []
}

async function getStats() {
  const [projectsCount, categoriesCount, skillsCount] = await Promise.all([
    supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
  ])

  return {
    projects: projectsCount.count || 0,
    categories: categoriesCount.count || 0,
    skills: skillsCount.count || 0,
  }
}

export default async function HomePage() {
  const [personalInfo, featuredProjects, stats] = await Promise.all([
    getPersonalInfo(),
    getFeaturedProjects(),
    getStats(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 mb-16">
        <div className="card-vintage max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-heading mb-6 text-pixel-shadow">
            {personalInfo?.name || 'PORTFOLIO'}
          </h1>
          <p className="text-2xl font-subheading text-accent-500 mb-6">
            {personalInfo?.title || 'Creative Developer'}
          </p>
          <p className="text-lg font-body text-neutral-700 mb-8 max-w-2xl mx-auto">
            {personalInfo?.bio || 'Welcome to my portfolio! Explore my projects and get to know more about my work.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/portfolio" className="btn-retro">
              VIEW PORTFOLIO <ArrowRight className="inline ml-2" size={20} />
            </Link>
            <Link 
              href="/about"
              className="px-6 py-3 font-subheading text-lg pixel-border bg-background-surface hover:bg-primary-100 transition-colors"
            >
              ABOUT ME
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-vintage text-center">
            <div className="text-4xl font-heading text-accent-500 mb-2">{stats.projects}</div>
            <div className="font-subheading text-lg text-neutral-700 flex items-center justify-center gap-2">
              <Code size={20} /> PROJECTS
            </div>
          </div>
          <div className="card-vintage text-center">
            <div className="text-4xl font-heading text-secondary-500 mb-2">{stats.categories}</div>
            <div className="font-subheading text-lg text-neutral-700 flex items-center justify-center gap-2">
              <Palette size={20} /> CATEGORIES
            </div>
          </div>
          <div className="card-vintage text-center">
            <div className="text-4xl font-heading text-primary-500 mb-2">{stats.skills}</div>
            <div className="font-subheading text-lg text-neutral-700 flex items-center justify-center gap-2">
              <Star size={20} /> SKILLS
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading text-primary-900 flex items-center gap-3">
              <Star className="text-accent-500" /> FEATURED PROJECTS
            </h2>
            <Link 
              href="/portfolio"
              className="font-subheading text-lg text-accent-500 hover:text-accent-700 transition-colors flex items-center gap-2"
            >
              VIEW ALL <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <PortfolioCard key={project.id} item={project} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="mt-16 text-center">
        <div className="card-vintage bg-gradient-to-r from-primary-100 to-secondary-100 max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading mb-4">MARI BERKOLABORASI</h2>
          <p className="font-body text-lg text-neutral-700 mb-6">
            Tertarik bekerja sama? Jangan ragu untuk menghubungi saya!
          </p>
          {personalInfo?.email && (
            <a 
              href={`mailto:${personalInfo.email}`}
              className="btn-retro inline-block"
            >
              HUBUNGI SAYA
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
