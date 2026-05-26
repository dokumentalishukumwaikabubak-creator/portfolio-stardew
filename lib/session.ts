import crypto from 'crypto'

export const SESSION_COOKIE_NAME = 'admin_session'
const SECRET = process.env.SESSION_SECRET || 'fallback-secret'

export function encryptSession(data: any): string {
  const payload = JSON.stringify(data)
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
  return Buffer.from(payload).toString('base64') + '.' + signature
}

export function decryptSession(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const payload = Buffer.from(parts[0], 'base64').toString('utf8')
    const signature = parts[1]
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
    if (signature !== expectedSignature) return null
    const session = JSON.parse(payload)
    if (session.expires < Date.now()) return null
    return session
  } catch (e) {
    return null
  }
}
