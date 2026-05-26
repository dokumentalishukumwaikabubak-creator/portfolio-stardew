import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, decryptSession } from '@/lib/session'

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || ''
const GOOGLE_SCRIPT_API_KEY = process.env.GOOGLE_SCRIPT_API_KEY || ''

// Mock fallback data to ensure the app runs immediately even without Google Sheet setup
const FALLBACK_DB: Record<string, any[]> = {
  personal_info: [
    {
      id: 1,
      name: 'John Doe',
      title: 'Full Stack Developer',
      bio: 'Passionate developer dengan pengalaman membangun aplikasi web modern menggunakan Next.js, React, dan Node.js.',
      email: 'john@example.com',
      github_url: 'https://github.com',
      linkedin_url: 'https://linkedin.com',
      twitter_url: 'https://twitter.com',
      profile_image_url: '',
      hero_title: 'Halo, saya John Doe!',
      hero_subtitle: 'Welcome to Pelican Town',
      hero_tagline: 'Membangun aplikasi web interaktif dengan pixel art dan retro styling.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  categories: [
    { id: 1, name: 'Web Development', slug: 'web-development', description: 'Full stack web applications', created_at: new Date().toISOString() },
    { id: 2, name: 'Mobile Apps', slug: 'mobile-apps', description: 'Native dan cross-platform mobile apps', created_at: new Date().toISOString() },
    { id: 3, name: 'UI/UX Design', slug: 'ui-ux-design', description: 'User interface dan experience design', created_at: new Date().toISOString() },
    { id: 4, name: 'Open Source', slug: 'open-source', description: 'Open source contributions dan projects', created_at: new Date().toISOString() }
  ],
  skills: [
    { id: 1, name: 'React', level: 5, category: 'Frontend', created_at: new Date().toISOString() },
    { id: 2, name: 'Next.js', level: 5, category: 'Frontend', created_at: new Date().toISOString() },
    { id: 3, name: 'TypeScript', level: 4, category: 'Frontend', created_at: new Date().toISOString() },
    { id: 4, name: 'Node.js', level: 4, category: 'Backend', created_at: new Date().toISOString() },
    { id: 5, name: 'Tailwind CSS', level: 5, category: 'Frontend', created_at: new Date().toISOString() },
    { id: 6, name: 'PostgreSQL', level: 3, category: 'Backend', created_at: new Date().toISOString() },
    { id: 7, name: 'Git', level: 4, category: 'Tools', created_at: new Date().toISOString() }
  ],
  portfolio_items: []
}

// Check if GOOGLE_SCRIPT_URL is valid and not a placeholder
const isScriptConfigured = () => {
  return GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('your-apps-script')
}

// Convert Google Drive view URL to our local image proxy endpoint URL
function proxyfyGoogleDriveUrl(url: string | null | undefined): string {
  if (!url) return ''
  // Support uc?id=..., uc?export=view&id=..., or /file/d/FILE_ID/view...
  const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{25,})/)
  if (match && match[1]) {
    return `/api/image-proxy?id=${match[1]}`
  }
  return url
}

// Server-side cache
const cache: { data: Record<string, any[]> | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, table, filters, orderCol, orderAsc, limitVal, data: reqData } = body

    // 1. Handled read requests
    if (action === 'read') {
      let data: any[] = []

      if (isScriptConfigured()) {
        try {
          // Check cache first
          const now = Date.now()
          if (cache.data && (now - cache.timestamp) < CACHE_TTL_MS) {
            data = cache.data[table] || []
          } else {
            const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=readAll`, {
              method: 'GET',
              next: { revalidate: 0 }
            })
            if (res.ok) {
              const json = await res.json()
              if (json.data) {
                cache.data = json.data
                cache.timestamp = now
                data = json.data[table] || []
              }
            } else {
              console.warn('Apps Script return not OK, using fallback data.')
              data = FALLBACK_DB[table] || []
            }
          }
        } catch (e) {
          console.error('Failed to fetch from Apps Script, using fallback data:', e)
          data = FALLBACK_DB[table] || []
        }
      } else {
        data = FALLBACK_DB[table] || []
      }

      // Apply Filters
      if (filters && filters.length > 0) {
        for (const filter of filters) {
          if (filter.type === 'eq') {
            data = data.filter((row: any) => {
              const val = row[filter.col]
              const queryVal = filter.val
              if (typeof queryVal === 'boolean') {
                return (val === true || val === 'true') === queryVal
              }
              if (queryVal === null || queryVal === undefined) {
                return val === null || val === undefined || val === ''
              }
              return String(val) === String(queryVal)
            })
          } else if (filter.type === 'in') {
            const queryVals = filter.val.map((v: any) => String(v))
            data = data.filter((row: any) => queryVals.includes(String(row[filter.col])))
          }
        }
      }

      // Apply Order
      if (orderCol) {
        data.sort((a: any, b: any) => {
          let valA = a[orderCol]
          let valB = b[orderCol]

          if (valA === undefined || valA === null) valA = ''
          if (valB === undefined || valB === null) valB = ''

          if (typeof valA === 'number' && typeof valB === 'number') {
            return orderAsc ? valA - valB : valB - valA
          }

          valA = String(valA).toLowerCase()
          valB = String(valB).toLowerCase()

          if (valA < valB) return orderAsc ? -1 : 1
          if (valA > valB) return orderAsc ? 1 : -1
          return 0
        })
      }

      // Apply Limit
      if (limitVal !== null && limitVal !== undefined) {
        data = data.slice(0, limitVal)
      }

      // Convert Google Drive image URLs to proxy URLs dynamically
      if (data && Array.isArray(data)) {
        data = data.map((row: any) => {
          const newRow = { ...row }
          if (typeof newRow.image_url === 'string') {
            newRow.image_url = proxyfyGoogleDriveUrl(newRow.image_url)
          }
          if (typeof newRow.profile_image_url === 'string') {
            newRow.profile_image_url = proxyfyGoogleDriveUrl(newRow.profile_image_url)
          }
          return newRow
        })
      }

      return NextResponse.json({ data, error: null })
    }

    // 2. Handle write requests (auth check required)
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)
    if (!sessionCookie) {
      return NextResponse.json({ data: null, error: { message: 'Unauthorized' } }, { status: 401 })
    }
    const session = decryptSession(sessionCookie.value)
    if (!session) {
      return NextResponse.json({ data: null, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    // If script not configured, simulate writes to local memory (will reset on reload, but good for local dev)
    if (!isScriptConfigured()) {
      console.warn('Apps Script not configured. Simulating write operation locally.')
      if (action === 'insert') {
        const list = FALLBACK_DB[table] || []
        const newId = list.length > 0 ? Math.max(...list.map(r => r.id || 0)) + 1 : 1
        const newRow = { id: newId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...reqData[0] }
        list.push(newRow)
        return NextResponse.json({ data: [newRow], error: null })
      }
      if (action === 'update') {
        // Find filter for ID
        const idFilter = filters?.find((f: any) => f.col === 'id')
        const id = idFilter ? Number(idFilter.val) : null
        const list = FALLBACK_DB[table] || []
        const idx = list.findIndex(r => r.id === id)
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...reqData, updated_at: new Date().toISOString() }
          return NextResponse.json({ data: [list[idx]], error: null })
        }
        return NextResponse.json({ data: null, error: { message: 'Row not found' } })
      }
      if (action === 'delete') {
        const idFilter = filters?.find((f: any) => f.col === 'id')
        const id = idFilter ? Number(idFilter.val) : null
        FALLBACK_DB[table] = (FALLBACK_DB[table] || []).filter(r => r.id !== id)
        return NextResponse.json({ data: { success: true }, error: null })
      }
    }

    // Forward to Google Apps Script
    // For update/delete, extract the ID from the filters
    const idFilter = filters?.find((f: any) => f.col === 'id')
    const id = idFilter ? idFilter.val : null

    const scriptRes = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        table,
        id,
        data: action === 'insert' ? reqData[0] : reqData,
        apiKey: GOOGLE_SCRIPT_API_KEY
      })
    })

    if (!scriptRes.ok) {
      const errorText = await scriptRes.text()
      return NextResponse.json({ data: null, error: { message: `Google Script Error: ${errorText}` } })
    }

    const scriptJson = await scriptRes.json()
    // Invalidate cache after write
    cache.data = null
    return NextResponse.json({ data: scriptJson.data, error: scriptJson.error })

  } catch (error: any) {
    return NextResponse.json({ data: null, error: { message: error.message || 'Internal Server Error' } }, { status: 500 })
  }
}
