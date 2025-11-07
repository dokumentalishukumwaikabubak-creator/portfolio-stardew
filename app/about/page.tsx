'use client'

// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Github, Linkedin, Twitter, User, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { PersonalInfo, Skill } from '@/types/database.types'
import { useLanguage } from '@/components/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [personalInfoResult, skillsResult] = await Promise.all([
        supabase
          .from('personal_info')
          .select('*')
          .maybeSingle(),
        supabase
          .from('skills')
          .select('*')
          .order('level', { ascending: false })
      ])

      if (personalInfoResult.error) {
        console.error('Error fetching personal info:', personalInfoResult.error)
      } else {
        setPersonalInfo(personalInfoResult.data)
      }

      if (skillsResult.error) {
        console.error('Error fetching skills:', skillsResult.error)
      } else {
        setSkills(skillsResult.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="animate-spin text-accent-500" size={48} />
      </div>
    )
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || t('common.other')
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div>
      <h1 className="page-header">{t('about.title')}</h1>

      {/* About Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Profile Image */}
        <div className="md:col-span-1">
          <div className="card-vintage">
            {personalInfo?.profile_image_url ? (
              <div className="relative w-full aspect-square mb-4">
                <Image
                  src={personalInfo.profile_image_url}
                  alt={personalInfo.name || 'Profile'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-neutral-100 flex items-center justify-center mb-4">
                <User size={64} className="text-neutral-300" />
              </div>
            )}
            <h2 className="font-heading text-2xl text-center mb-2">
              {personalInfo?.name || 'Your Name'}
            </h2>
            <p className="font-subheading text-lg text-center text-accent-500">
              {personalInfo?.title || 'Your Title'}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <div className="card-vintage h-full">
            <h3 className="font-heading text-2xl mb-4">{t('about.bio')}</h3>
            <p className="font-body text-lg text-neutral-700 leading-relaxed whitespace-pre-line">
              {personalInfo?.bio || 'Tell us about yourself...'}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-heading text-primary-900 mb-8">{t('about.skills')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="card-vintage">
                <h3 className="font-subheading text-xl mb-4 text-secondary-500">
                  {category.toUpperCase()}
                </h3>
                <div className="space-y-3">
                  {categorySkills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-body text-neutral-700">{skill.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      {personalInfo && (
        <div className="card-vintage bg-gradient-to-r from-primary-100 to-secondary-100">
          <h2 className="text-3xl font-heading text-center mb-6">{t('about.getInTouch')}</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 px-6 py-3 bg-background-surface pixel-border hover:shadow-card-hover transition-all"
              >
                <Mail size={20} />
                <span className="font-subheading">{t('about.email')}</span>
              </a>
            )}
            {personalInfo.github_url && (
              <a
                href={personalInfo.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-background-surface pixel-border hover:shadow-card-hover transition-all"
              >
                <Github size={20} />
                <span className="font-subheading">{t('about.github')}</span>
              </a>
            )}
            {personalInfo.linkedin_url && (
              <a
                href={personalInfo.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-background-surface pixel-border hover:shadow-card-hover transition-all"
              >
                <Linkedin size={20} />
                <span className="font-subheading">{t('about.linkedin')}</span>
              </a>
            )}
            {personalInfo.twitter_url && (
              <a
                href={personalInfo.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-background-surface pixel-border hover:shadow-card-hover transition-all"
              >
                <Twitter size={20} />
                <span className="font-subheading">{t('about.twitter')}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
