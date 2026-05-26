import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return new NextResponse('Missing image ID', { status: 400 })
    }

    // Google Drive direct download URL
    const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`

    // Fetch the image from Google Drive on the server-side
    const res = await fetch(driveUrl, {
      headers: {
        // User-Agent to avoid potential blockages
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (!res.ok) {
      console.error(`Google Drive proxy failed with status: ${res.status}`)
      return new NextResponse(`Failed to fetch image from Google Drive: ${res.statusText}`, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    // Return the image buffer directly to the client with appropriate headers
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': contentType,
        // Cache the image for 30 days on the browser/CDN side for better performance
        'Cache-Control': 'public, max-age=2592000, immutable',
      },
    })
  } catch (error: any) {
    console.error('Image proxy handler error:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
