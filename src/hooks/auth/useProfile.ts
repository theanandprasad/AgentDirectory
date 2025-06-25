'use client'

import { useAuth } from './useAuth'
import { Profile } from '@/lib/auth/types'

export function useProfile() {
  const { profile, updateProfile, refreshProfile, loading } = useAuth()

  const updateUserProfile = async (data: Partial<Profile>) => {
    try {
      await updateProfile(data)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      }
    }
  }

  const refreshUserProfile = async () => {
    try {
      await refreshProfile()
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Refresh failed' 
      }
    }
  }

  return {
    profile,
    loading,
    updateProfile: updateUserProfile,
    refreshProfile: refreshUserProfile,
    hasProfile: !!profile,
    isAdmin: profile?.role === 'admin',
    isVendor: profile?.role === 'vendor' || profile?.role === 'admin',
    isUser: !!profile,
  }
} 