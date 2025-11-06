// @ts-nocheck
'use client'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import PortfolioFilter from '@/components/portfolio/PortfolioFilter'
import { useLanguage } from '@/components/LanguageContext'
import { useEffect, useState } from 'react'
import type { PortfolioItemWithCategory, Category } from '@/types/database.types'

export default function PortfolioPage() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<PortfolioItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPortfolioData()
        setProjects(data.projects)
        setCategories(data.categories)
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin text-accent-500">{t('common.loading')}</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-header">{t('portfolio.title')}</h1>

      {/* Category Filter - Client Component */}
      <PortfolioFilter categories={categories} projects={projects} />
    </div>
  )
}

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