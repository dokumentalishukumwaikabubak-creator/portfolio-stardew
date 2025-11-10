'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github, Briefcase } from 'lucide-react'
import { useLanguage } from '../LanguageContext'
import type { PortfolioItemWithCategory } from '@/types/database.types'
import { motion } from 'framer-motion'

interface PortfolioCardProps {
  item: PortfolioItemWithCategory
}

export default function PortfolioCard({ item }: PortfolioCardProps) {
  const { t } = useLanguage()
  
  return (
    <motion.div 
      className="card-vintage hover:shadow-card-hover transition-all duration-normal group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Image */}
      <motion.div 
        className="relative w-full h-48 mb-4 overflow-hidden bg-neutral-100"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-slow"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <Briefcase size={48} />
          </div>
        )}
        {item.is_featured && (
          <motion.div 
            className="absolute top-2 right-2 bg-accent-500 text-white px-3 py-1 font-subheading text-sm pixel-border-secondary"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {t('detail.featured')}
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <motion.h3 
        className="font-subheading text-2xl text-primary-900 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {item.title}
      </motion.h3>
      
      {item.category && (
        <motion.span 
          className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 text-sm font-body mb-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {item.category.name}
        </motion.span>
      )}

      <motion.p 
        className="font-body text-neutral-700 mb-4 line-clamp-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {item.description}
      </motion.p>

      {/* Links */}
      <motion.div 
        className="flex gap-4 mt-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Link
            href={`/portfolio/${item.id}`}
            className="block text-center py-2 bg-primary-500 text-white font-subheading hover:bg-primary-700 transition-colors"
          >
            {t('portfolio.viewDetails')}
          </Link>
        </motion.div>
        {item.demo_url && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href={item.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-accent-500 text-white hover:bg-accent-700 transition-colors block"
              title={t('portfolio.letsLook')}
            >
              <ExternalLink size={20} />
            </a>
          </motion.div>
        )}
        {item.github_url && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href={item.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-700 text-white hover:bg-neutral-900 transition-colors block"
              title={t('portfolio.github')}
            >
              <Github size={20} />
            </a>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
