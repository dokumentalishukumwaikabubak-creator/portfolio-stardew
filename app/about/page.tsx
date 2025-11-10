'use client'

// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Github, Linkedin, Twitter, User, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { PersonalInfo, Skill } from '@/types/database.types'
import { useLanguage } from '@/components/LanguageContext'
import { motion } from 'framer-motion'

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {t('about.title')}
      </motion.h1>

      {/* About Content */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Image */}
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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
        </motion.div>

        {/* Bio */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div 
            className="card-vintage h-full"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="font-heading text-2xl mb-4">{t('about.bio')}</h3>
            <p className="font-body text-lg text-neutral-700 leading-relaxed whitespace-pre-line">
              {personalInfo?.bio || 'Tell us about yourself...'}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Skills Section */}
      {Object.keys(skillsByCategory).length > 0 && (
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-heading text-primary-900 mb-8">{t('about.skills')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
              <motion.div 
                key={category}
                className="card-vintage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="font-subheading text-xl mb-4 text-secondary-500">
                  {category.toUpperCase()}
                </h3>
                <div className="space-y-3">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div 
                      key={skill.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 + skillIndex * 0.05 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-body text-neutral-700">{skill.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Contact Section */}
      {personalInfo && (
        <motion.div 
          className="card-vintage bg-gradient-to-r from-primary-100 to-secondary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-heading text-center mb-6">{t('about.getInTouch')}</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {personalInfo.email && (
              <motion.a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 px-6 py-3 bg-background-surface pixel-border hover:shadow-card-hover transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <Mail size={20} />
                <span className="font-subheading">{t('about.email')}</span>
              </motion.a>
            )}
            {personalInfo.github_url && (
              <motion.a
                href={personalInfo.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-background-surface pixel-border hover:shadow-card-hover transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
              >
                <Github size={20} />
                <span className="font-subheading">{t('about.github')}</span>
              </motion.a>
            )}
            {personalInfo.linkedin_url && (
              <motion.a
                href={personalInfo.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-background-surface pixel-border hover:shadow-card-hover transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                <Linkedin size={20} />
                <span className="font-subheading">{t('about.linkedin')}</span>
              </motion.a>
            )}
            {personalInfo.twitter_url && (
              <motion.a
                href={personalInfo.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-background-surface pixel-border hover:shadow-card-hover transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.2 }}
              >
                <Twitter size={20} />
                <span className="font-subheading">{t('about.twitter')}</span>
              </motion.a>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
