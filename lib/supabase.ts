import type { Database } from '@/types/database.types'

class QueryBuilder {
  private tableName: string
  private actionVal: 'read' | 'insert' | 'update' | 'delete' = 'read'
  private orderCol: string | null = null
  private orderAsc: boolean = true
  private limitVal: number | null = null
  private filters: { col: string; type: 'eq' | 'in'; val: any }[] = []
  private bodyData: any = null

  constructor(tableName: string) {
    this.tableName = tableName
  }

  select(columns: string = '*', options?: { count?: string; head?: boolean }): any {
    return this
  }

  order(column: string, options?: { ascending?: boolean }): any {
    this.orderCol = column
    this.orderAsc = options?.ascending !== false
    return this
  }

  eq(column: string, value: any): any {
    this.filters.push({ col: column, type: 'eq', val: value })
    return this
  }

  in(column: string, values: any[]): any {
    this.filters.push({ col: column, type: 'in', val: values })
    return this
  }

  limit(n: number): any {
    this.limitVal = n
    return this
  }

  insert(values: any[]): any {
    this.actionVal = 'insert'
    this.bodyData = values
    return this
  }

  update(values: any): any {
    this.actionVal = 'update'
    this.bodyData = values
    return this
  }

  delete(): any {
    this.actionVal = 'delete'
    return this
  }

  async execute() {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: this.actionVal,
          table: this.tableName,
          filters: this.filters,
          orderCol: this.orderCol,
          orderAsc: this.orderAsc,
          limitVal: this.limitVal,
          data: this.bodyData,
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        return { data: null, error: { message: errorText } }
      }

      const json = await res.json()
      return { data: json.data, error: json.error }
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Network error' } }
    }
  }

  // Promise-like then for direct await support
  async then(onfulfilled?: (value: any) => any) {
    const res = await this.execute()
    return onfulfilled ? onfulfilled(res) : res
  }

  async maybeSingle() {
    const { data, error } = await this.execute()
    if (error) return { data: null, error }
    return { data: data && data.length > 0 ? data[0] : null, error: null }
  }
}

// Auth listeners for onAuthStateChange compatibility
const authListeners = new Set<(event: string, session: any) => void>()

export const supabase = {
  from(tableName: string): any {
    return new QueryBuilder(tableName)
  },
  auth: {
    async getSession() {
      try {
        const res = await fetch('/api/auth')
        if (res.ok) {
          const data = await res.json()
          return { data: { session: data.session }, error: null }
        }
      } catch (e) {}
      return { data: { session: null }, error: null }
    },
    async signInWithPassword({ email, password }: any) {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', email, password }),
        })
        if (res.ok) {
          const data = await res.json()
          
          // Trigger listeners
          authListeners.forEach(cb => cb('SIGNED_IN', data.session))
          
          return { data: { session: data.session }, error: null }
        } else {
          const text = await res.text()
          return { data: { session: null }, error: { message: text } }
        }
      } catch (err: any) {
        return { data: { session: null }, error: { message: err.message } }
      }
    },
    async signOut() {
      try {
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout' }),
        })
        
        // Trigger listeners
        authListeners.forEach(cb => cb('SIGNED_OUT', null))
      } catch (e) {}
      return { error: null }
    },
    onAuthStateChange(callback: (event: string, session: any) => void): any {
      authListeners.add(callback)
      
      // Call immediately with the current session status asynchronously
      fetch('/api/auth')
        .then(res => (res.ok ? res.json() : { session: null }))
        .then(data => {
          callback(data.session ? 'SIGNED_IN' : 'SIGNED_OUT', data.session)
        })
        .catch(() => {
          callback('SIGNED_OUT', null)
        })

      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners.delete(callback)
            }
          }
        }
      }
    }
  },
}

// Helper function to upload image
export async function uploadImage(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!res.ok) {
      console.error('Failed to upload image')
      return null
    }
    
    const data = await res.json()
    return data.url
  } catch (err) {
    console.error('Error uploading image:', err)
    return null
  }
}

// Helper function to delete image
export async function deleteImage(url: string): Promise<boolean> {
  return true
}
