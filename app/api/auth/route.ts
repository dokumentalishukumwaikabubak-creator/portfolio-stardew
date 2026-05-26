import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, encryptSession, decryptSession } from '@/lib/session'

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)
  
  if (!sessionCookie) {
    return NextResponse.json({ session: null })
  }

  const session = decryptSession(sessionCookie.value)
  if (!session) {
    return NextResponse.json({ session: null })
  }

  return NextResponse.json({
    session: {
      user: {
        email: session.email,
        id: 'admin-id'
      },
      expires_at: Math.floor(session.expires / 1000)
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'login') {
      const { email, password } = body
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
      const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123'

      if (email !== adminEmail || password !== adminPassword) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }

      const sessionData = {
        email,
        expires: Date.now() + 24 * 60 * 60 * 1000
      }
      const token = encryptSession(sessionData)

      const response = NextResponse.json({
        session: {
          user: {
            email,
            id: 'admin-id'
          },
          expires_at: Math.floor(sessionData.expires / 1000)
        }
      })

      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60
      })

      return response
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true })
      response.cookies.set(SESSION_COOKIE_NAME, '', {
        maxAge: -1
      })
      return response
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
