'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientSupabase } from '@/lib/auth/supabase'
import { authHelpers } from '@/lib/auth/auth-helpers'
import { AuthContextType, Profile, SignUpData, AuthState } from '@/lib/auth/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isAuthenticated: false,
  })

  const supabase = createClientSupabase()

  // Load initial auth state
  useEffect(() => {
    const getInitialAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const profile = await authHelpers.getProfile(user.id)
          setAuthState({
            user,
            profile,
            loading: false,
            isAuthenticated: true,
          })
        } else {
          setAuthState({
            user: null,
            profile: null,
            loading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('Error loading auth state:', error)
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          isAuthenticated: false,
        })
      }
    }

    getInitialAuth()
  }, [supabase])

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await authHelpers.getProfile(session.user.id)
          setAuthState({
            user: session.user,
            profile,
            loading: false,
            isAuthenticated: true,
          })
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            profile: null,
            loading: false,
            isAuthenticated: false,
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    const result = await authHelpers.signIn(email, password)
    if (!result.success) {
      throw new Error(result.error)
    }
  }

  const signUp = async (data: SignUpData) => {
    const result = await authHelpers.signUp(data)
    if (!result.success) {
      throw new Error(result.error)
    }
  }

  const signOut = async () => {
    const result = await authHelpers.signOut()
    if (!result.success) {
      throw new Error(result.error)
    }
  }

  const updateProfile = async (data: Partial<Profile>) => {
    if (!authState.user) {
      throw new Error('User not authenticated')
    }

    const result = await authHelpers.updateProfile(authState.user.id, data)
    if (!result.success) {
      throw new Error(result.error)
    }

    // Update local state
    setAuthState(prev => ({
      ...prev,
      profile: result.data
    }))
  }

  const refreshProfile = async () => {
    if (!authState.user) return

    const profile = await authHelpers.getProfile(authState.user.id)
    setAuthState(prev => ({
      ...prev,
      profile
    }))
  }

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={contextValue}>
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