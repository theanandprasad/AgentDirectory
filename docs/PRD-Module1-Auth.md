# Module 1: Authentication & User Management - Complete Specification

## Overview

Module 1 handles all user authentication, registration, profile management, and role-based access control for AgentDirectory. This module is the foundation layer with zero dependencies on other modules.

## Business Requirements

### Core Functionality
- User registration with email verification
- User login/logout with session management
- Password reset functionality
- User profile management (company info, role)
- Role-based access control (Admin, Vendor, User)
- Social authentication (optional for future)

### User Roles
- **User**: Can browse tools, submit reviews, basic account management
- **Vendor**: Can submit tools for approval, manage listings
- **Admin**: Full system access, user management, content moderation

## Technical Specification

### Technology Stack
- **Frontend**: Next.js 14 App Router + TypeScript
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS + Shadcn/ui
- **Validation**: Zod for schema validation
- **State Management**: React state + Supabase Auth context

### Database Schema

```sql
-- Supabase Auth handles users table automatically
-- We only need to create profiles table

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'vendor', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### File Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth pages layout
│   │   ├── layout.tsx            # Auth-specific layout
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── register/
│   │   │   └── page.tsx          # Registration page
│   │   ├── forgot-password/
│   │   │   └── page.tsx          # Password reset
│   │   └── verify-email/
│   │       └── page.tsx          # Email verification
│   ├── profile/
│   │   ├── page.tsx              # Profile management
│   │   └── settings/
│   │       └── page.tsx          # Profile settings
│   └── api/
│       └── auth/                 # Auth API endpoints
│           ├── profile/
│           │   └── route.ts      # Profile CRUD
│           ├── validate-session/
│           │   └── route.ts      # Session validation
│           └── update-role/
│               └── route.ts      # Role management (admin only)
├── components/
│   └── auth/                     # Auth-specific components
│       ├── AuthProvider.tsx     # Supabase Auth context
│       ├── LoginForm.tsx        # Login form component
│       ├── RegisterForm.tsx     # Registration form
│       ├── ProfileForm.tsx      # Profile editing form
│       ├── ProtectedRoute.tsx   # Route protection HOC
│       └── RoleGuard.tsx        # Role-based access component
├── lib/
│   └── auth/                     # Auth utilities
│       ├── supabase.ts          # Supabase client
│       ├── auth-helpers.ts      # Auth utility functions
│       ├── validation.ts        # Zod schemas
│       └── types.ts             # TypeScript types
└── hooks/
    └── auth/                     # Auth-related hooks
        ├── useAuth.ts           # Auth state management
        ├── useProfile.ts        # Profile data management
        └── useRoleGuard.ts      # Role checking hook
```

### API Specifications

#### Authentication Endpoints

**POST /api/auth/register**
```typescript
// Request
{
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  role: 'user' | 'vendor';
}

// Response
{
  success: true;
  data: {
    user: User;
    session: Session;
  };
  message: "Registration successful. Please verify your email.";
}
```

**POST /api/auth/login**
```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  success: true;
  data: {
    user: User;
    session: Session;
  };
  message: "Login successful";
}
```

**POST /api/auth/logout**
```typescript
// Response
{
  success: true;
  message: "Logged out successfully";
}
```

**GET /api/auth/validate-session**
```typescript
// Headers: Authorization: Bearer <token>

// Response
{
  success: true;
  data: {
    user: User;
    profile: Profile;
    isValid: boolean;
  };
}
```

#### Profile Endpoints

**GET /api/auth/profile**
```typescript
// Headers: Authorization: Bearer <token>

// Response
{
  success: true;
  data: {
    id: string;
    email: string;
    fullName: string;
    companyName: string | null;
    role: 'user' | 'vendor' | 'admin';
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
```

**PUT /api/auth/profile**
```typescript
// Request
{
  fullName?: string;
  companyName?: string;
  avatarUrl?: string;
}

// Response
{
  success: true;
  data: Profile;
  message: "Profile updated successfully";
}
```

### TypeScript Types

```typescript
// lib/auth/types.ts

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  companyName: string | null;
  role: 'user' | 'vendor' | 'admin';
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  role: 'user' | 'vendor';
}
```

### Validation Schemas

```typescript
// lib/auth/validation.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  companyName: z.string().optional(),
  role: z.enum(['user', 'vendor']),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  companyName: z.string().optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
});
```

## Mock APIs for Other Modules

Since Module 1 has no dependencies, other modules will consume these APIs:

### For Module 2 (Tool Directory)
```typescript
// Mock user validation response
{
  success: true,
  data: {
    user: {
      id: "user-123",
      email: "john@example.com",
      role: "vendor"
    },
    isValid: true
  }
}
```

### For Module 3 (Admin Panel)
```typescript
// Mock admin check response
{
  success: true,
  data: {
    user: {
      id: "admin-123",
      email: "admin@example.com",
      role: "admin"
    },
    hasAdminAccess: true
  }
}
```

## Component Specifications

### AuthProvider Component
```typescript
// components/auth/AuthProvider.tsx
'use client';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Manages global auth state
  // Provides auth context to entire app
  // Handles session persistence
  // Manages profile data
}
```

### ProtectedRoute Component
```typescript
// components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'vendor' | 'admin';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  // Checks authentication status
  // Validates user role if specified
  // Redirects to login if unauthorized
}
```

## Testing Strategy

### Unit Tests
- Auth helper functions
- Validation schemas
- Component logic
- API route handlers

### Integration Tests
- Supabase Auth integration
- Database operations
- API endpoint flows
- Authentication workflows

### Test Files Structure
```
__tests__/
├── auth/
│   ├── components/
│   │   ├── LoginForm.test.tsx
│   │   ├── RegisterForm.test.tsx
│   │   └── ProtectedRoute.test.tsx
│   ├── api/
│   │   ├── profile.test.ts
│   │   └── validate-session.test.ts
│   └── hooks/
│       ├── useAuth.test.ts
│       └── useProfile.test.ts
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Deployment Considerations

### Supabase Setup
1. Create new Supabase project
2. Run database migrations
3. Configure authentication settings
4. Set up email templates
5. Configure RLS policies

### Vercel Deployment
1. Environment variables configuration
2. Build settings for Next.js
3. Preview deployments for testing
4. Production domain setup

### Security Considerations
- JWT token validation
- Rate limiting on auth endpoints
- CORS configuration
- Secure session management
- Password policies

## Development Checklist

### Week 1
- [ ] Set up Supabase project and database
- [ ] Create authentication pages (login, register)
- [ ] Implement AuthProvider and context
- [ ] Build basic profile management
- [ ] Add form validation with Zod

### Week 2
- [ ] Implement role-based access control
- [ ] Add password reset functionality
- [ ] Create protected route components
- [ ] Write comprehensive tests
- [ ] Deploy to Vercel and test

### Success Metrics
- User registration success rate
- Login/logout functionality
- Session persistence across browser refreshes
- Role-based access working correctly
- All auth API endpoints responding correctly

This module provides the complete authentication foundation that other modules will depend on through well-defined API contracts. 