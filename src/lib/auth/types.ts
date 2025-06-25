import { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string
  fullName: string | null
  companyName: string | null
  role: 'user' | 'vendor' | 'admin'
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAuthenticated: boolean
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  companyName?: string
  role: 'user' | 'vendor'
}

export interface AuthResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
} 