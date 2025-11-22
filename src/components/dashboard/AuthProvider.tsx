'use client'

/**
 * Auth Provider
 * 
 * Provides authentication context for dashboard
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Session {
  authenticated: boolean
  tenantId?: string
  ownerId?: string
  email?: string
  role?: string
  tenantName?: string
  tenantDomain?: string
}

interface AuthContextType {
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    if (!loading && !session?.authenticated && pathname?.startsWith('/dashboard')) {
      router.push('/login')
    }
  }, [loading, session, pathname, router])

  async function checkSession() {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      })

      const data = await response.json()

      if (data.authenticated) {
        setSession(data)
      } else {
        setSession({ authenticated: false })
      }
    } catch (error) {
      console.error('[AUTH] Error checking session:', error)
      setSession({ authenticated: false })
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        await checkSession()
        router.push('/dashboard')
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('[AUTH] Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      setSession({ authenticated: false })
      router.push('/login')
    } catch (error) {
      console.error('[AUTH] Logout error:', error)
    }
  }

  async function refreshSession() {
    await checkSession()
  }

  return (
    <AuthContext.Provider value={{ session, loading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
