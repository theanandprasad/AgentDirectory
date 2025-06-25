import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/auth/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    
    // Get the current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({
        success: true,
        data: {
          user: null,
          profile: null,
          isValid: false
        }
      })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          emailConfirmed: user.email_confirmed_at !== null,
          lastSignIn: user.last_sign_in_at,
        },
        profile: profile || null,
        isValid: true
      }
    })

  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Same as GET but for POST requests (some clients prefer POST for auth checks)
  return GET(request)
} 