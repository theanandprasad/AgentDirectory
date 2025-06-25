# Module 1: Authentication & User Management

## 🎯 Module Focus
This Cursor instance is dedicated to building the **Authentication & User Management** module for AgentDirectory.

## 📋 Module Responsibilities
- User registration and login
- Password reset functionality  
- User profile management
- Role-based access control (Admin, Vendor, User)
- Session management with Supabase Auth

## 📄 Complete Specification
See [`PRD-Module1-Auth.md`](./PRD-Module1-Auth.md) for the complete technical specification.

## 🏗️ Development Focus Areas

### Files to Create in Main Project
```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── profile/
│   │   ├── page.tsx
│   │   └── settings/page.tsx
│   └── api/auth/
│       ├── profile/route.ts
│       ├── validate-session/route.ts
│       └── update-role/route.ts
├── components/auth/
│   ├── AuthProvider.tsx
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ProfileForm.tsx
│   ├── ProtectedRoute.tsx
│   └── RoleGuard.tsx
├── lib/auth/
│   ├── supabase.ts
│   ├── auth-helpers.ts
│   ├── validation.ts
│   └── types.ts
└── hooks/auth/
    ├── useAuth.ts
    ├── useProfile.ts
    └── useRoleGuard.ts
```

## 🔌 Module Dependencies
**None** - This is the foundation module with no dependencies on other modules.

## 📤 APIs This Module Provides
Other modules will consume these APIs:

### User Validation API
```typescript
GET /api/auth/validate-session
Response: {
  success: true,
  data: {
    user: User,
    profile: Profile,
    isValid: boolean
  }
}
```

### Profile API
```typescript
GET /api/auth/profile
Response: {
  success: true,
  data: Profile
}
```

## 🧪 Testing Strategy
Focus on testing:
- Authentication flows
- Role-based access control
- Session management
- Form validation
- Supabase integration

## ⚡ Development Timeline
**Weeks 1-2**
- Week 1: Core authentication (login/register/logout)
- Week 2: Profiles, roles, and protection mechanisms

## 🚀 Getting Started
1. Open this directory in Cursor
2. Read the complete PRD specification
3. Set up Supabase project and environment variables
4. Start with authentication pages and work through the file structure

## 🔧 Environment Setup
```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## ✅ Success Criteria
- [ ] User registration working
- [ ] Login/logout functional
- [ ] Profile management complete
- [ ] Role-based access implemented
- [ ] Session persistence working
- [ ] All authentication APIs ready for other modules 