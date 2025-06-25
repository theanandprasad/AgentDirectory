'use client'

import { useContext } from 'react'
import { AuthContext } from '@/components/auth/AuthProvider'

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Re-export the context type for convenience
export type { AuthContextType } from '@/lib/auth/types' 