'use client'

import { createContext, useContext, ReactNode } from 'react'

type Language = 'id' | 'en'

interface Translations {
  [key: string]: {
    id: string
    en: string
  }
}

const translations: Translations = {
  // Navigation
  'nav.home': { id: 'Beranda', en: 'Home' },
  'nav.portfolio': { id: 'My Portfolio', en: 'My Portfolio' },
  'nav.about': { id: 'About Me', en: 'About Me' },
  'nav.language': { id: 'Bahasa', en: 'Language' },
  'nav.switch': { id: 'Ganti Bahasa', en: 'Switch Language' },

  // Home page
  'home.title': { id: 'SELAMAT DATANG', en: 'WELCOME' },
  'home.subtitle': { id: 'GET IN TOUCH', en: 'GET IN TOUCH' },
  'home.description': { id: 'Jelajahi karya-karya terbaik saya dalam bidang development, design, dan teknologi.', en: 'Explore my best works in development, design, and technology.' },
  'home.viewPortfolio': { id: 'Lihat Portfolio', en: 'View Portfolio' },
  'home.aboutMe': { id: 'Tentang Saya', en: 'About Me' },

  // About page
  'about.title': { id: 'TENTANG SAYA', en: 'ABOUT ME' },
  'about.intro': { id: 'Halo! Saya adalah seorang developer dan designer yang passionate dalam menciptakan pengalaman digital yang menarik.', en: 'Hello! I am a developer and designer who is passionate about creating engaging digital experiences.' },
  'about.skills': { id: 'Keahlian', en: 'Skills' },
  'about.experience': { id: 'Pengalaman', en: 'Experience' },
  'about.contact': { id: 'Kontak', en: 'Contact' },
  'about.bio': { id: 'BIO', en: 'BIO' },
  'about.getInTouch': { id: 'HUBUNGI SAYA', en: 'GET IN TOUCH' },
  'about.email': { id: 'Email', en: 'Email' },
  'about.github': { id: 'GitHub', en: 'GitHub' },
  'about.linkedin': { id: 'LinkedIn', en: 'LinkedIn' },
  'about.twitter': { id: 'Twitter', en: 'Twitter' },

  // Portfolio page
  'portfolio.title': { id: 'PORTFOLIO', en: 'PORTFOLIO' },
  'portfolio.filter.all': { id: 'SEMUA', en: 'ALL' },
  'portfolio.viewDetails': { id: 'Lihat Detail', en: 'View Details' },
  'portfolio.demo': { id: 'Demo', en: 'Demo' },
  'portfolio.github': { id: 'GitHub', en: 'GitHub' },
  'portfolio.letsLook': { id: "Mari Lihat", en: "Let's take a look" },
  'portfolio.noProjects': { id: 'Belum ada project untuk kategori ini', en: 'No projects found for this category' },

  // Portfolio detail
  'detail.backToPortfolio': { id: 'KEMBALI KE PORTFOLIO', en: 'BACK TO PORTFOLIO' },
  'detail.projectDescription': { id: 'DESKRIPSI PROJECT', en: 'PROJECT DESCRIPTION' },
  'detail.info': { id: 'INFO', en: 'INFO' },
  'detail.category': { id: 'Kategori', en: 'Category' },
  'detail.date': { id: 'Tanggal', en: 'Date' },
  'detail.status': { id: 'Status', en: 'Status' },
  'detail.featured': { id: 'UNGGULAN', en: 'FEATURED' },
  'detail.links': { id: 'Links', en: 'Links' },
  'detail.sourceCode': { id: 'Source Code', en: 'Source Code' },

  // Footer
  'footer.rights': { id: 'Semua hak cipta dilindungi.', en: 'All rights reserved.' },

  // Common
  'common.loading': { id: 'Memuat...', en: 'Loading...' },
  'common.save': { id: 'Simpan', en: 'Save' },
  'common.cancel': { id: 'Batal', en: 'Cancel' },
  'common.delete': { id: 'Hapus', en: 'Delete' },
  'common.edit': { id: 'Edit', en: 'Edit' },
  'common.add': { id: 'Tambah', en: 'Add' },
  'common.update': { id: 'Update', en: 'Update' },
  'common.create': { id: 'Buat', en: 'Create' },
  'common.other': { id: 'Lainnya', en: 'Other' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always use English, language switching is disabled
  const language: Language = 'en'

  // Disabled: no language switching allowed
  const handleSetLanguage = (_lang: Language) => {
    // Do nothing - language is locked to English
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
