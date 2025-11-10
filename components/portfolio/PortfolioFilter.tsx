'use client'

import { useState } from 'react'
import { useLanguage } from '../LanguageContext'
import type { PortfolioItemWithCategory, Category } from '@/types/database.types'
import PortfolioCard from './PortfolioCard'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PortfolioFilterProps {
  categories: Category[]
  projects: PortfolioItemWithCategory[]
}

export default function PortfolioFilter({ categories, projects }: PortfolioFilterProps) {
  const { t } = useLanguage()
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
        <motion.div 
          className="flex flex-wrap gap-3 justify-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 font-subheading text-lg transition-all ${
              selectedCategory === null
                ? 'bg-accent-500 text-white pixel-border'
                : 'bg-background-surface text-neutral-700 hover:bg-primary-100'
            }`}
          >
            {t('portfolio.filter.all')}
          </motion.button>
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 font-subheading text-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-accent-500 text-white pixel-border'
                  : 'bg-background-surface text-neutral-700 hover:bg-primary-100'
              }`}
            >
              {category.name.toUpperCase()}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <motion.div 
          className="flex justify-center items-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader2 className="animate-spin text-accent-500" size={48} />
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PortfolioCard item={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="card-vintage text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-subheading text-xl text-neutral-500">
                {t('portfolio.noProjects')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}