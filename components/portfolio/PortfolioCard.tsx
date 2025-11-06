import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github, Briefcase } from 'lucide-react'
import type { PortfolioItemWithCategory } from '@/types/database.types'

interface PortfolioCardProps {
  item: PortfolioItemWithCategory
}

export default function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <div className="card-vintage hover:shadow-card-hover transition-all duration-normal group">
      {/* Image */}
      <div className="relative w-full h-48 mb-4 overflow-hidden bg-neutral-100">
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
          <div className="absolute top-2 right-2 bg-accent-500 text-white px-3 py-1 font-subheading text-sm pixel-border-secondary">
            FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="font-subheading text-2xl text-primary-900 mb-2">
        {item.title}
      </h3>
      
      {item.category && (
        <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 text-sm font-body mb-3">
          {item.category.name}
        </span>
      )}

      <p className="font-body text-neutral-700 mb-4 line-clamp-3">
        {item.description}
      </p>

      {/* Links */}
      <div className="flex gap-4 mt-auto">
        <Link
          href={`/portfolio/${item.id}`}
          className="flex-1 text-center py-2 bg-primary-500 text-white font-subheading hover:bg-primary-700 transition-colors"
        >
          View Details
        </Link>
        {item.demo_url && (
          <a
            href={item.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-accent-500 text-white hover:bg-accent-700 transition-colors"
            title="Live Demo"
          >
            <ExternalLink size={20} />
          </a>
        )}
        {item.github_url && (
          <a
            href={item.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-neutral-700 text-white hover:bg-neutral-900 transition-colors"
            title="GitHub"
          >
            <Github size={20} />
          </a>
        )}
      </div>
    </div>
  )
}
