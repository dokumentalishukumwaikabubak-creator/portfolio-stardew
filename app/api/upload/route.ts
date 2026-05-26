import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, decryptSession } from '@/lib/session'
import fs from 'fs/promises'
import path from 'path'

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || ''
const GOOGLE_SCRIPT_API_KEY = process.env.GOOGLE_SCRIPT_API_KEY || ''

const isScriptConfigured = () => {
  return GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('your-apps-script')
}

export async function POST(req: NextRequest) {
  try {
    // Check auth
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const session = decryptSession(sessionCookie.value)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Fallback to local upload if Apps Script is not configured
    if (!isScriptConfigured()) {
      console.warn('Google Apps Script not configured. Saving uploaded image locally.')
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      // Ensure upload directory exists
      await fs.mkdir(uploadDir, { recursive: true })
      
      const safeFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const localFilePath = path.join(uploadDir, safeFileName)
      
      await fs.writeFile(localFilePath, buffer)
      const directUrl = `/uploads/${safeFileName}`
      
      return NextResponse.json({ url: directUrl })
    }

    // Convert to base64 for Apps Script
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`
    const fileName = file.name

    const scriptRes = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'uploadImage',
        fileData: base64Data,
        fileName,
        apiKey: GOOGLE_SCRIPT_API_KEY
      })
    })

    if (!scriptRes.ok) {
      const errorText = await scriptRes.text()
      console.error('Google Script Upload Error:', errorText)
      return NextResponse.json({ error: `Upload error: ${errorText}` }, { status: 500 })
    }

    const scriptJson = await scriptRes.json()
    if (scriptJson.error) {
      console.error('Google Script Business Error:', scriptJson.error)
      return NextResponse.json({ error: scriptJson.error }, { status: 500 })
    }

    // Convert the returned Google Drive URL to our local image proxy endpoint URL
    const fileId = scriptJson.data.url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{25,})/)?.[1]
    const proxyUrl = fileId ? `/api/image-proxy?id=${fileId}` : scriptJson.data.url

    return NextResponse.json({ url: proxyUrl })

  } catch (error: any) {
    console.error('Image Upload Handler Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
