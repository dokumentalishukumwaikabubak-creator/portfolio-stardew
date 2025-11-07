// @ts-nocheck
// @ts-nocheck
'use client'

import Link from 'next/link'
import { ArrowRight, Star, Code, Palette } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PortfolioCard from '@/components/portfolio/PortfolioCard'
import { useLanguage } from '@/components/LanguageContext'
import { useEffect, useState } from 'react'
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

async function getLatestProjects() {
  const { data: projects, error: projectsError } = await supabase
    .from('portfolio_items')
    .select('*')
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



export default function HomePage() {
  const { t, language } = useLanguage()
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [latestProjects, setLatestProjects] = useState<PortfolioItemWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [personalInfoData, latestProjectsData] = await Promise.all([
          getPersonalInfo(),
          getLatestProjects(),
        ])
        
        setPersonalInfo(personalInfoData)
        setLatestProjects(latestProjectsData)
      } catch (error) {
        console.error('Error fetching data:', error)
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
      {/* Hero Section */}
      <section className="text-center py-16 mb-16">
        <div className="card-vintage max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-heading mb-6 text-pixel-shadow">
            {personalInfo?.name || t('home.title')}
          </h1>
          <p className="text-2xl font-subheading text-accent-500 mb-6">
            {personalInfo?.title || 'Creative Developer'}
          </p>
          <p className="text-lg font-body text-neutral-700 mb-8 max-w-2xl mx-auto">
            {personalInfo?.bio || t('home.description')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/portfolio" className="btn-retro">
              {t('home.viewPortfolio').toUpperCase()} <ArrowRight className="inline ml-2" size={20} />
            </Link>
            <Link 
              href="/about"
              className="px-6 py-3 font-subheading text-lg pixel-border bg-background-surface hover:bg-primary-100 transition-colors"
            >
              {t('home.aboutMe').toUpperCase()}
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Projects */}
      {latestProjects.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading text-primary-900 flex items-center gap-3">
              <Star className="text-accent-500" /> {t('portfolio.title')}
            </h2>
            <Link 
              href="/portfolio"
              className="font-subheading text-lg text-accent-500 hover:text-accent-700 transition-colors flex items-center gap-2"
            >
              {t('portfolio.viewDetails')} <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestProjects.map((project) => (
              <PortfolioCard key={project.id} item={project} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="mt-16 text-center">
        <div className="card-vintage bg-gradient-to-r from-primary-100 to-secondary-100 max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading mb-4">{t('home.subtitle')}</h2>
          <p className="font-body text-lg text-neutral-700 mb-6">
            {language === 'id' ? 'Tertarik bekerja sama? Jangan ragu untuk menghubungi saya!' : 'Interested in collaborating? Don\'t hesitate to reach out!'}
          </p>
          {personalInfo?.email && (
            <a 
              href={`mailto:${personalInfo.email}`}
              className="btn-retro inline-block"
            >
              {language === 'id' ? 'HUBUNGI SAYA' : 'CONTACT ME'}
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
