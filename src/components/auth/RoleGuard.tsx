'use client'

import { useRoleGuard } from '@/hooks/auth/useRoleGuard'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'vendor' | 'admin'
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  fallback = null,
  requireAuth = true 
}: RoleGuardProps) {
  const { canAccess, isAuthenticated } = useRoleGuard()

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>
  }

  // Check role requirement
  if (requiredRole && !canAccess(requiredRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Convenience components for specific roles
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="admin" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function VendorOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="vendor" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function AuthOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard requireAuth={true} fallback={fallback}>
      {children}
    </RoleGuard>
  )
} 