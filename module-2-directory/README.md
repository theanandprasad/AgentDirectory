# Module 2: Tool Directory Core

## 🎯 Module Focus
This Cursor instance is dedicated to building the **Tool Directory Core** module for AgentDirectory.

## 📋 Module Responsibilities
- Tool submission and CRUD operations
- Role-based categorization (Sales, Marketing, CS, HR, Finance)
- Use case tagging system
- PostgreSQL full-text search
- Tool filtering and public browsing
- Vendor tool management

## 📄 Complete Specification
See [`PRD-Module2-Directory.md`](./PRD-Module2-Directory.md) for the complete technical specification.

## 🏗️ Development Focus Areas

### Files to Create in Main Project
```
src/
├── app/
│   ├── tools/
│   │   ├── page.tsx
│   │   ├── [slug]/page.tsx
│   │   └── category/[category]/page.tsx
│   ├── submit-tool/page.tsx
│   ├── my-tools/
│   │   ├── page.tsx
│   │   └── [id]/edit/page.tsx
│   └── api/tools/
│       ├── route.ts
│       ├── [id]/route.ts
│       ├── search/route.ts
│       ├── categories/route.ts
│       └── vendor/[vendorId]/route.ts
├── components/tools/
│   ├── ToolCard.tsx
│   ├── ToolList.tsx
│   ├── ToolForm.tsx
│   ├── ToolSearch.tsx
│   ├── ToolFilters.tsx
│   ├── CategoryGrid.tsx
│   └── VendorToolsTable.tsx
├── lib/tools/
│   ├── api.ts
│   ├── types.ts
│   ├── validation.ts
│   ├── search.ts
│   └── constants.ts
└── hooks/tools/
    ├── useTools.ts
    ├── useToolSearch.ts
    ├── useCategories.ts
    └── useVendorTools.ts
```

## 🔌 Module Dependencies

### Consumes from Module 1 (Authentication)
Uses these APIs from the authentication module:

```typescript
// User validation for protected routes
GET /api/auth/validate-session

// User profile for vendor information
GET /api/auth/profile
```

**Development Mode**: Use mock responses provided in the PRD until Module 1 is complete.

## 📤 APIs This Module Provides
Module 3 (Admin Panel) will consume these APIs:

### Tool Data API
```typescript
GET /api/tools
GET /api/tools/[id]
POST /api/tools
PUT /api/tools/[id]
```

### Search API
```typescript
GET /api/tools/search?q=query&category=sales
```

### Categories API
```typescript
GET /api/tools/categories
```

## 🧪 Testing Strategy
Focus on testing:
- Tool CRUD operations
- Search functionality
- Category filtering
- File upload (logos)
- Vendor tool management
- Public browsing (no auth)

## ⚡ Development Timeline
**Weeks 3-4**
- Week 3: Tool listings, submission, basic search
- Week 4: Advanced filtering, vendor management, optimization

## 🚀 Getting Started
1. Open this directory in Cursor
2. Read the complete PRD specification
3. Set up database schema for tools and categories
4. Start with tool listing pages and work through the structure

## 🔧 Database Setup
```sql
-- Run these migrations (provided in PRD)
CREATE TABLE categories (...);
CREATE TABLE use_cases (...);
CREATE TABLE tools (...);
-- Plus indexes and RLS policies
```

## 📊 Mock Data for Development
```typescript
// Use these mock responses for Module 1 APIs
const mockUserValidation = {
  success: true,
  data: {
    user: { id: "user-123", role: "vendor" },
    isValid: true
  }
};
```

## ✅ Success Criteria
- [ ] Tool submission working
- [ ] Public tool browsing functional
- [ ] Search and filtering operational
- [ ] Vendor tool management complete
- [ ] Categories and use cases implemented
- [ ] APIs ready for Module 3 consumption 