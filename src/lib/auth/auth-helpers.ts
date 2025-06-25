import { createClientSupabase } from './supabase'
import { Profile, SignUpData, AuthResponse } from './types'

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export const authHelpers = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const supabase = createClientSupabase()
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            company_name: data.companyName || null,
            role: data.role,
          },
        },
      })

      if (authError) {
        throw new AuthError(authError.message, authError.message)
      }

      return {
        success: true,
        data: authData,
        message: 'Registration successful. Please check your email to verify your account.',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const supabase = createClientSupabase()
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new AuthError(error.message, error.message)
      }

      return {
        success: true,
        data,
        message: 'Login successful',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }
    }
  },

  async signOut(): Promise<AuthResponse> {
    const supabase = createClientSupabase()
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw new AuthError(error.message)
      }

      return {
        success: true,
        message: 'Logged out successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }
    }
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = createClientSupabase()
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        throw new AuthError(error.message)
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<AuthResponse> {
    const supabase = createClientSupabase()
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw new AuthError(error.message)
      }

      return {
        success: true,
        data,
        message: 'Profile updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed',
      }
    }
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    const supabase = createClientSupabase()
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw new AuthError(error.message)
      }

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      }
    }
  },

  hasRole(profile: Profile | null, requiredRole: string): boolean {
    if (!profile) return false
    
    const roleHierarchy = { user: 1, vendor: 2, admin: 3 }
    const userLevel = roleHierarchy[profile.role as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
    
    return userLevel >= requiredLevel
  },

  isAdmin(profile: Profile | null): boolean {
    return profile?.role === 'admin'
  },

  isVendor(profile: Profile | null): boolean {
    return profile?.role === 'vendor' || profile?.role === 'admin'
  },
} 