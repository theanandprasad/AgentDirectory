'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'
import { useRoleGuard } from '@/hooks/auth/useRoleGuard'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'vendor' | 'admin'
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { loading, isAuthenticated } = useAuth()
  const { canAccess } = useRoleGuard()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && !canAccess(requiredRole)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [loading, isAuthenticated, requiredRole, canAccess, router, redirectTo])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Don't render children if not authenticated or authorized
  if (!isAuthenticated || (requiredRole && !canAccess(requiredRole))) {
    return null
  }

  return <>{children}</>
} 