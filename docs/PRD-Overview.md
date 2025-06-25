# AgentDirectory - Architecture Overview

## Project Structure for Modular Development

This project is designed for independent module development using Cursor AI. Each module is completely self-contained with its own PRD, database schema, API specification, and testing strategy.

## Module Independence Strategy

### Core Principle
Each module can be developed, tested, and deployed independently without requiring knowledge of other modules' internal implementation.

### Module Communication
- Modules communicate only through well-defined API contracts
- Mock API responses are provided for development isolation
- Database schemas are module-specific with minimal shared tables

## MVP Modules

### Module 1: Authentication & User Management
**File**: `docs/PRD-Module1-Auth.md`
**Responsibility**: User registration, login, profiles, role management
**Dependencies**: None (pure Supabase Auth integration)
**Provides**: User validation API for other modules

### Module 2: Tool Directory Core
**File**: `docs/PRD-Module2-Directory.md`
**Responsibility**: Tool CRUD, categories, search, public listings
**Dependencies**: User validation from Module 1
**Provides**: Tool data API for other modules

### Module 3: Admin Panel & Reviews
**File**: `docs/PRD-Module3-Admin.md`
**Responsibility**: Admin dashboard, tool approval, reviews system
**Dependencies**: User validation + Tool data APIs
**Provides**: Admin operations and review data

## Development Workflow

### Phase 1: Module 1 (Weeks 1-2)
1. Develop authentication system using `PRD-Module1-Auth.md`
2. Deploy and test authentication endpoints
3. Generate real API responses for other modules

### Phase 2: Module 2 (Weeks 3-4)
1. Develop tool directory using `PRD-Module2-Directory.md`
2. Use Module 1's real APIs (or mocks if needed)
3. Deploy and test tool management

### Phase 3: Module 3 (Weeks 5-6)
1. Develop admin panel using `PRD-Module3-Admin.md`
2. Integrate with real APIs from Modules 1 & 2
3. Deploy complete system

## Shared Infrastructure

### Technology Stack
- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API routes
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

### Common Patterns
- TypeScript for all modules
- Tailwind CSS + Shadcn/ui for styling
- Supabase client for database operations
- Standard error handling patterns
- Consistent API response formats

## Integration Points

### API Response Format (Standard)
```typescript
// Success Response
{
  success: true,
  data: T,
  message?: string
}

// Error Response
{
  success: false,
  error: string,
  code?: string
}
```

### Authentication Flow
1. Module 1 handles all auth operations
2. Returns JWT tokens via Supabase Auth
3. Other modules validate tokens via Module 1 API
4. User roles stored in Module 1's profiles table

### Database Isolation
- Each module owns specific tables
- Cross-module queries only through APIs
- No direct database access between modules
- Minimal shared reference data

## Development Guidelines

### For Cursor AI Development
1. Each module PRD is complete and self-contained
2. Context size kept under 100k tokens per module
3. Mock APIs provided for independent development
4. Clear file structure specified per module
5. Testing strategy isolated to each module

### Module Boundaries
- **No shared state** between modules in frontend
- **API-only communication** between modules
- **Independent deployment** capability
- **Isolated testing** for each module

## Quality Assurance

### Testing Strategy
- Unit tests within each module
- Integration tests for API contracts
- End-to-end tests for complete user flows
- Performance tests for each module independently

### Deployment Strategy
- Each module can be deployed independently
- Rollback capability per module
- Feature flags for module activation
- Health checks per module

This modular approach ensures that Cursor can develop each module independently while maintaining system coherence and enabling parallel development. 