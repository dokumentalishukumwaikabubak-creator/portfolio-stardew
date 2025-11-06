'use client'

import { useState } from 'react'
import type { PortfolioItemWithCategory, Category } from '@/types/database.types'
import PortfolioCard from './PortfolioCard'
import { Loader2 } from 'lucide-react'

interface PortfolioFilterProps {
  categories: Category[]
  projects: PortfolioItemWithCategory[]
}

export default function PortfolioFilter({ categories, projects }: PortfolioFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // Filter projects berdasarkan category yang dipilih
  const filteredProjects = selectedCategory 
    ? projects.filter(p => p.category_id === selectedCategory)
    : projects

  return (
    <>
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
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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
    </>
  )
}