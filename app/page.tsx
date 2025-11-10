// @ts-nocheck
// @ts-nocheck
'use client'

import Link from 'next/link'
import { ArrowRight, Star, Code, Palette, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PortfolioCard from '@/components/portfolio/PortfolioCard'
import { useLanguage } from '@/components/LanguageContext'
import { useEffect, useState, useRef } from 'react'
import type { PortfolioItemWithCategory, PersonalInfo, Category } from '@/types/database.types'
import { motion } from 'framer-motion'

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

// Fetch projects that admin has marked to show on home (is_featured)
async function getFeaturedProjects(limit: number = 6) {
  const { data: projects, error: projectsError } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (projectsError) {
    console.error('Error fetching featured projects:', projectsError)
    return []
  }

  // Manually fetch categories for the returned projects
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  // Refs for scroll navigation
  const portfolioRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  // Function to handle smooth scroll
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [personalInfoData, latestProjectsData] = await Promise.all([
          getPersonalInfo(),
          // get projects selected by admin for home page
          getFeaturedProjects(6),
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

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mq.matches)
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      try {
        mq.addEventListener('change', listener)
      } catch {
        // Safari fallback
        // @ts-ignore
        mq.addListener(listener)
      }
      return () => {
        try {
          mq.removeEventListener('change', listener)
        } catch {
          // @ts-ignore
          mq.removeListener(listener)
        }
      }
    }
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
      <section className="min-h-[60vh] sm:min-h-[80vh] py-4 sm:py-6 md:py-8 mb-0 sm:mb-4 md:mb-8 relative">
        <div className="card-vintage max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 sm:gap-6 md:gap-8">
            {/* Text column */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading mb-3 sm:mb-4 md:mb-6 leading-tight text-pixel-shadow"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {personalInfo?.hero_title || t('home.title')}
              </motion.h1>
              {personalInfo?.hero_subtitle && (
                <motion.p 
                  className="text-lg sm:text-xl md:text-2xl font-subheading text-accent-500 mb-3 md:mb-6"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {personalInfo.hero_subtitle}
                </motion.p>
              )}
              <motion.p 
                className="text-base md:text-lg font-body text-neutral-700 mb-6 md:mb-8 max-w-2xl mx-auto md:mx-0 px-4 md:px-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {personalInfo?.hero_tagline || t('home.description')}
              </motion.p>

              <motion.div 
                className="flex gap-2 sm:gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <button 
                  onClick={() => scrollToSection(portfolioRef)} 
                  className="btn-retro text-sm sm:text-base py-2 px-3 sm:px-4 sm:py-3 h-auto flex items-center"
                >
                  {t('home.viewPortfolio').toUpperCase()} 
                  <ArrowRight className="inline ml-1 sm:ml-2" size={16} />
                </button>
                <Link 
                  href="/about"
                  className="text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 font-subheading pixel-border bg-background-surface hover:bg-primary-100 transition-colors h-auto flex items-center"
                >
                  {t('home.aboutMe').toUpperCase()}
                </Link>
              </motion.div>
            </motion.div>

            {/* Image column: show GIF on md+; hide if user prefers reduced motion */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {!prefersReducedMotion && (
                <img
                  src="/ezgif-48df44af39b81a7f-unscreen.gif"
                  alt="Karakter animasi"
                  className="hidden md:block w-72 max-w-full rounded-lg shadow-lg"
                />
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator - hidden on mobile */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer hidden md:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          onClick={() => scrollToSection(portfolioRef)}
        >
          <ChevronDown 
            size={32} 
            className="text-accent-500 animate-bounce" 
          />
        </motion.div>
      </section>

      {/* Latest Projects */}
      {latestProjects.length > 0 && (
        <section ref={portfolioRef} className="scroll-mt-0 sm:scroll-mt-4 md:scroll-mt-8 min-h-[60vh] sm:min-h-[80vh] pt-0 pb-4 sm:py-6 md:py-8 flex flex-col justify-center">
          <motion.div 
            className="text-center mb-2 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-heading text-primary-900 flex items-center gap-2 sm:gap-3 justify-center mb-3 md:mb-4">
              <Star className="text-accent-500" /> {t('portfolio.title')}
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-12">
            {latestProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PortfolioCard item={project} />
              </motion.div>
            ))}
          </div>

          {/* Navigation to next section - hidden on mobile */}
          <motion.div 
            className="text-center hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => scrollToSection(ctaRef)}
              className="btn-retro flex items-center gap-2 mx-auto"
            >
              GET IN TOUCH <ChevronDown size={20} />
            </button>
          </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <section ref={ctaRef} className="scroll-mt-4 sm:scroll-mt-6 md:scroll-mt-8 min-h-[60vh] py-4 sm:py-6 md:py-8 flex items-center">
        <motion.div 
          className="card-vintage bg-gradient-to-r from-primary-100 to-secondary-100 max-w-2xl mx-auto w-full px-4 sm:px-6 md:px-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl font-heading mb-3 md:mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('home.subtitle')}
          </motion.h2>
          <motion.p 
            className="font-body text-base sm:text-lg text-neutral-700 mb-4 md:mb-6 px-4 md:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {language === 'id' ? 'Tertarik bekerja sama? Jangan ragu untuk menghubungi saya!' : 'Interested in collaborating? Don\'t hesitate to reach out!'}
          </motion.p>
          {personalInfo?.email && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a 
                href={`mailto:${personalInfo.email}`}
                className="btn-retro inline-block"
              >
                {language === 'id' ? 'HUBUNGI SAYA' : 'CONTACT ME'}
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  )
}
