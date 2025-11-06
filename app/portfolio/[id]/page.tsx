// @ts-nocheck
'use client'

// Remove generateStaticParams to avoid conflicts with client component
// Static params will be generated at build time by the parent layout

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ExternalLink, Github, Calendar } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import { useEffect, useState } from 'react'
import type { PortfolioItemWithCategory } from '@/types/database.types'

async function getProject(id: string): Promise<PortfolioItemWithCategory | null> {
  const { data: project, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', parseInt(id))
    .maybeSingle()

  if (error || !project) {
    return null
  }

  // Fetch category if exists
  if (project.category_id) {
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('id', project.category_id)
      .maybeSingle()

    return { ...project, category }
  }

  return { ...project, category: null }
}

export default function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLanguage()
  const [project, setProject] = useState<PortfolioItemWithCategory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const resolvedParams = await params
        const projectData = await getProject(resolvedParams.id)
        setProject(projectData)
        if (!projectData) {
          notFound()
        }
      } catch (error) {
        console.error('Error loading project:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [params])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin text-accent-500">{t('common.loading')}</div>
      </div>
    )
  }

  if (!project) {
    notFound()
  }

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 font-subheading text-lg text-accent-500 hover:text-accent-700 transition-colors mb-8"
      >
        <ArrowLeft size={20} /> {t('detail.backToPortfolio')}
      </Link>

      {/* Project Hero */}
      <div className="card-vintage mb-8">
        {project.image_url && (
          <div className="relative w-full h-96 mb-6">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading text-primary-900 mb-3">
              {project.title}
            </h1>
            {project.category && (
              <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 font-subheading text-lg">
                {project.category.name}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-subheading hover:bg-accent-700 transition-colors pixel-border"
              >
                <ExternalLink size={20} /> {t('portfolio.letsLook').toUpperCase()}
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-neutral-700 text-white font-subheading hover:bg-neutral-900 transition-colors pixel-border"
              >
                <Github size={20} /> GITHUB
              </a>
            )}
          </div>
        </div>

        {project.created_at && (
          <div className="flex items-center gap-2 text-neutral-500 font-body">
            <Calendar size={16} />
            <span>{new Date(project.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        )}
      </div>

      {/* Project Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card-vintage">
            <h2 className="text-2xl font-heading mb-4">{t('detail.projectDescription')}</h2>
            {project.full_description ? (
              <div className="font-body text-lg text-neutral-700 leading-relaxed whitespace-pre-line">
                {project.full_description}
              </div>
            ) : (
              <p className="font-body text-lg text-neutral-700 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="card-vintage">
            <h3 className="text-xl font-heading mb-4">{t('detail.info')}</h3>
            <div className="space-y-4 font-body">
              {project.category && (
                <div>
                  <div className="text-sm text-neutral-500 mb-1">{t('detail.category')}</div>
                  <div className="text-neutral-700 font-semibold">{project.category.name}</div>
                </div>
              )}
              {project.created_at && (
                <div>
                  <div className="text-sm text-neutral-500 mb-1">{t('detail.date')}</div>
                  <div className="text-neutral-700 font-semibold">
                    {new Date(project.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </div>
                </div>
              )}
              {project.is_featured && (
                <div>
                  <div className="text-sm text-neutral-500 mb-1">{t('detail.status')}</div>
                  <div className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-sm font-subheading">
                    {t('detail.featured')}
                  </div>
                </div>
              )}
            </div>

            {(project.demo_url || project.github_url) && (
              <div className="mt-6 pt-6 border-t-2 border-neutral-200">
                <h4 className="text-sm text-neutral-500 mb-3">{t('detail.links')}</h4>
                <div className="space-y-2">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent-500 hover:text-accent-700 transition-colors"
                    >
                      <ExternalLink size={16} /> {t('portfolio.letsLook')}
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                    >
                      <Github size={16} /> {t('detail.sourceCode')}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
