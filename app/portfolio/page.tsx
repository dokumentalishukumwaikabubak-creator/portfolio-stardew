// @ts-nocheck
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import PortfolioFilter from '@/components/portfolio/PortfolioFilter'
import type { PortfolioItemWithCategory, Category } from '@/types/database.types'

// Fetch data for static generation
async function getPortfolioData() {
  const [projectsResponse, categoriesResponse] = await Promise.all([
    supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .order('name')
  ])

  const projects = projectsResponse.data || []
  const categories = categoriesResponse.data || []

  // Map projects with their categories
  const projectsWithCategories: PortfolioItemWithCategory[] = projects.map(project => ({
    ...project,
    category: categories.find(c => c.id === project.category_id) || null
  }))

  return {
    projects: projectsWithCategories,
    categories
  }
}

export default async function PortfolioPage() {
  const { projects, categories } = await getPortfolioData()

  return (
    <div>
      <h1 className="page-header">PORTFOLIO</h1>

      {/* Category Filter - Client Component */}
      <PortfolioFilter categories={categories} projects={projects} />
    </div>
  )
}