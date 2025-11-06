// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import PortfolioCard from '@/components/portfolio/PortfolioCard'
import { Loader2 } from 'lucide-react'
import type { PortfolioItemWithCategory, Category } from '@/types/database.types'

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioItemWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProjects()
  }, [selectedCategory])

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (!error && data) {
      setCategories(data)
    }
  }

  async function fetchProjects() {
    setLoading(true)
    let query = supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }

    const { data: projectsData, error } = await query

    if (!error && projectsData) {
      // Manually fetch categories
      const categoryIds = [...new Set(projectsData.map(p => p.category_id).filter(Boolean))] as number[]
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .in('id', categoryIds)

      const projectsWithCategories: PortfolioItemWithCategory[] = projectsData.map(project => ({
        ...project,
        category: categoriesData?.find(c => c.id === project.category_id) || null
      }))

      setProjects(projectsWithCategories)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="page-header">PORTFOLIO</h1>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 font-subheading text-lg transition-all ${
              selectedCategory === null
                ? 'bg-accent-500 text-white pixel-border'
                : 'bg-background-surface text-neutral-700 hover:bg-primary-100'
            }`}
          >
            ALL
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 font-subheading text-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-accent-500 text-white pixel-border'
                  : 'bg-background-surface text-neutral-700 hover:bg-primary-100'
              }`}
            >
              {category.name.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin text-accent-500" size={48} />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <PortfolioCard key={project.id} item={project} />
          ))}
        </div>
      ) : (
        <div className="card-vintage text-center py-16">
          <p className="font-subheading text-xl text-neutral-500">
            Belum ada project untuk kategori ini
          </p>
        </div>
      )}
    </div>
  )
}
