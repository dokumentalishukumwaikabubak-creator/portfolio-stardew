// Simple in-memory rate limiter
// For production, consider using Redis or external service

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 60 * 60 * 1000 // 1 hour block after max attempts

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Clean up expired entries
  if (entry && now > entry.resetTime && !entry.blocked) {
    rateLimitStore.delete(identifier)
  }

  // Check if blocked
  if (entry?.blocked) {
    if (now < entry.resetTime) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    } else {
      // Block expired, reset
      rateLimitStore.delete(identifier)
    }
  }

  // Get or create entry
  const currentEntry = rateLimitStore.get(identifier)

  if (!currentEntry || now > currentEntry.resetTime) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
      blocked: false,
    })
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    }
  }

  // Increment count
  currentEntry.count++

  if (currentEntry.count >= MAX_ATTEMPTS) {
    // Block for 1 hour
    currentEntry.blocked = true
    currentEntry.resetTime = now + BLOCK_DURATION
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentEntry.resetTime,
    }
  }

  rateLimitStore.set(identifier, currentEntry)

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - currentEntry.count,
    resetTime: currentEntry.resetTime,
  }
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

export function getRateLimitStatus(identifier: string): { remaining: number; resetTime: number; blocked: boolean } {
  const entry = rateLimitStore.get(identifier)
  const now = Date.now()

  if (!entry || (now > entry.resetTime && !entry.blocked)) {
    return {
      remaining: MAX_ATTEMPTS,
      resetTime: now + RATE_LIMIT_WINDOW,
      blocked: false,
    }
  }

  if (entry.blocked && now < entry.resetTime) {
    return {
      remaining: 0,
      resetTime: entry.resetTime,
      blocked: true,
    }
  }

  return {
    remaining: Math.max(0, MAX_ATTEMPTS - entry.count),
    resetTime: entry.resetTime,
    blocked: false,
  }
}

