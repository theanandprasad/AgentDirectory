'use client'

import { useAuth } from './useAuth'
import { authHelpers } from '@/lib/auth/auth-helpers'

export function useRoleGuard() {
  const { profile, isAuthenticated } = useAuth()

  const hasRole = (requiredRole: 'user' | 'vendor' | 'admin'): boolean => {
    if (!isAuthenticated || !profile) return false
    return authHelpers.hasRole(profile, requiredRole)
  }

  const isAdmin = (): boolean => {
    return authHelpers.isAdmin(profile)
  }

  const isVendor = (): boolean => {
    return authHelpers.isVendor(profile)
  }

  const canAccess = (requiredRole?: 'user' | 'vendor' | 'admin'): boolean => {
    if (!requiredRole) return isAuthenticated
    return hasRole(requiredRole)
  }

  const requireAuth = (): boolean => {
    return isAuthenticated
  }

  return {
    hasRole,
    isAdmin,
    isVendor,
    canAccess,
    requireAuth,
    isAuthenticated,
    profile,
  }
} 