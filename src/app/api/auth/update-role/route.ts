import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/auth/supabase'
import { z } from 'zod'

const updateRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['user', 'vendor', 'admin'], {
    required_error: 'Role is required',
  }),
})

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const body = await request.json()

    // Validate input
    const validation = updateRoleSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input',
          details: validation.error.flatten()
        },
        { status: 400 }
      )
    }

    // Get the current user (admin performing the action)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if current user is admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminError || adminProfile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Update target user's role
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        role: validation.data.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', validation.data.userId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user role' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: `User role updated to ${validation.data.role}`
    })

  } catch (error) {
    console.error('Role update error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 