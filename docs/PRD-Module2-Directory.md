# Module 2: Tool Directory Core - Complete Specification

## Overview

Module 2 handles the core tool directory functionality including tool listings, categorization, search, and public browsing. This module depends on Module 1 for user authentication and provides tool data to Module 3.

## Business Requirements

### Core Functionality
- Tool submission and CRUD operations
- Role-based categorization (Sales, Marketing, CS, HR, Finance)
- Use case tagging system
- PostgreSQL full-text search
- Tool filtering by category and use case
- Public tool browsing (no auth required)
- Vendor tool management
- Basic tool approval workflow

### User Stories
- **Public Users**: Browse tools by role/category without authentication
- **Registered Users**: Submit tool reviews and save favorites
- **Vendors**: Submit tools for approval and manage their listings
- **Admins**: Approve/reject tool submissions (handled in Module 3)

## Technical Specification

### Technology Stack
- **Frontend**: Next.js 14 App Router + TypeScript
- **Database**: Supabase PostgreSQL
- **Search**: PostgreSQL Full-Text Search
- **Storage**: Supabase Storage for logos/images
- **Styling**: Tailwind CSS + Shadcn/ui
- **Validation**: Zod for schema validation

### Database Schema

```sql
-- Tool categories (predefined)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Icon name for UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Use cases for tools
CREATE TABLE use_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Main tools table
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  
  -- Categorization
  primary_category_id UUID REFERENCES categories(id),
  use_case_ids UUID[] DEFAULT '{}', -- Array of use case IDs
  
  -- Vendor information
  vendor_id UUID REFERENCES profiles(id), -- From Module 1
  vendor_contact_email TEXT,
  
  -- Tool details
  pricing_model TEXT CHECK (pricing_model IN ('free', 'freemium', 'paid', 'custom')),
  pricing_details TEXT,
  integration_difficulty INTEGER CHECK (integration_difficulty BETWEEN 1 AND 5),
  
  -- Metadata
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  
  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || description || ' ' || COALESCE(long_description, ''))
  ) STORED,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX tools_search_idx ON tools USING GIN (search_vector);
CREATE INDEX tools_category_idx ON tools (primary_category_id);
CREATE INDEX tools_approved_idx ON tools (approved);
CREATE INDEX tools_vendor_idx ON tools (vendor_id);

-- Row Level Security
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view approved tools"
  ON tools FOR SELECT
  USING (approved = TRUE);

CREATE POLICY "Vendors can view their own tools"
  ON tools FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own tools"
  ON tools FOR INSERT
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own tools"
  ON tools FOR UPDATE
  USING (vendor_id = auth.uid());

-- Seed data for categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Sales', 'sales', 'Tools for sales teams and revenue generation', 'TrendingUp'),
('Marketing', 'marketing', 'Marketing automation and campaign management', 'Megaphone'),
('Customer Success', 'customer-success', 'Customer support and success tools', 'Users'),
('Human Resources', 'hr', 'HR management and employee tools', 'UserCheck'),
('Finance', 'finance', 'Financial planning and accounting tools', 'DollarSign');

-- Seed data for use cases
INSERT INTO use_cases (name, slug, category_id, description) VALUES
-- Sales use cases
('Lead Generation', 'lead-generation', (SELECT id FROM categories WHERE slug = 'sales'), 'Find and qualify potential customers'),
('CRM Management', 'crm-management', (SELECT id FROM categories WHERE slug = 'sales'), 'Manage customer relationships'),
('Sales Analytics', 'sales-analytics', (SELECT id FROM categories WHERE slug = 'sales'), 'Track and analyze sales performance'),

-- Marketing use cases  
('Email Marketing', 'email-marketing', (SELECT id FROM categories WHERE slug = 'marketing'), 'Email campaign automation'),
('Social Media', 'social-media', (SELECT id FROM categories WHERE slug = 'marketing'), 'Social media management'),
('Content Creation', 'content-creation', (SELECT id FROM categories WHERE slug = 'marketing'), 'Create marketing content'),

-- Customer Success use cases
('Help Desk', 'help-desk', (SELECT id FROM categories WHERE slug = 'customer-success'), 'Customer support ticketing'),
('Live Chat', 'live-chat', (SELECT id FROM categories WHERE slug = 'customer-success'), 'Real-time customer chat'),
('Knowledge Base', 'knowledge-base', (SELECT id FROM categories WHERE slug = 'customer-success'), 'Self-service documentation'),

-- HR use cases
('Recruiting', 'recruiting', (SELECT id FROM categories WHERE slug = 'hr'), 'Talent acquisition and hiring'),
('Performance Management', 'performance-management', (SELECT id FROM categories WHERE slug = 'hr'), 'Employee performance tracking'),
('Payroll', 'payroll', (SELECT id FROM categories WHERE slug = 'hr'), 'Payroll and benefits management'),

-- Finance use cases
('Accounting', 'accounting', (SELECT id FROM categories WHERE slug = 'finance'), 'Financial record keeping'),
('Invoicing', 'invoicing', (SELECT id FROM categories WHERE slug = 'finance'), 'Invoice generation and management'),
('Expense Management', 'expense-management', (SELECT id FROM categories WHERE slug = 'finance'), 'Track and manage expenses');
```

### File Structure

```
src/
├── app/
│   ├── tools/                      # Public tool directory
│   │   ├── page.tsx               # Tool listing page
│   │   ├── [slug]/
│   │   │   └── page.tsx           # Individual tool page
│   │   └── category/
│   │       └── [category]/
│   │           └── page.tsx       # Category-specific listings
│   ├── submit-tool/               # Tool submission (protected)
│   │   └── page.tsx
│   ├── my-tools/                  # Vendor tool management (protected)
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   └── api/
│       └── tools/                 # Tool API endpoints
│           ├── route.ts           # GET all tools, POST new tool
│           ├── [id]/
│           │   └── route.ts       # GET, PUT, DELETE specific tool
│           ├── search/
│           │   └── route.ts       # Search functionality
│           ├── categories/
│           │   └── route.ts       # Get categories and use cases
│           └── vendor/
│               └── [vendorId]/
│                   └── route.ts   # Vendor's tools
├── components/
│   └── tools/                     # Tool-specific components
│       ├── ToolCard.tsx          # Tool display card
│       ├── ToolList.tsx          # Tool listing component
│       ├── ToolForm.tsx          # Tool submission/edit form
│       ├── ToolSearch.tsx        # Search interface
│       ├── ToolFilters.tsx       # Category/use case filters
│       ├── CategoryGrid.tsx      # Category overview
│       └── VendorToolsTable.tsx  # Vendor tool management
├── lib/
│   └── tools/                     # Tool-specific utilities
│       ├── api.ts                # Tool API functions
│       ├── types.ts              # TypeScript interfaces
│       ├── validation.ts         # Zod schemas
│       ├── search.ts             # Search utilities
│       └── constants.ts          # Static data and enums
└── hooks/
    └── tools/                     # Tool-related hooks
        ├── useTools.ts           # Tool data fetching
        ├── useToolSearch.ts      # Search functionality
        ├── useCategories.ts      # Category data
        └── useVendorTools.ts     # Vendor tool management
```

### API Specifications

#### Tool Endpoints

**GET /api/tools**
```typescript
// Query parameters
{
  category?: string;
  useCases?: string[]; // Array of use case slugs
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

// Response
{
  success: true;
  data: {
    tools: Tool[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

**POST /api/tools**
```typescript
// Headers: Authorization: Bearer <token>
// Request
{
  name: string;
  description: string;
  longDescription?: string;
  websiteUrl: string;
  logoUrl?: string;
  primaryCategoryId: string;
  useCaseIds: string[];
  pricingModel: 'free' | 'freemium' | 'paid' | 'custom';
  pricingDetails?: string;
  integrationDifficulty: 1 | 2 | 3 | 4 | 5;
  vendorContactEmail?: string;
}

// Response
{
  success: true;
  data: Tool;
  message: "Tool submitted for approval";
}
```

**GET /api/tools/[id]**
```typescript
// Response
{
  success: true;
  data: Tool & {
    category: Category;
    useCases: UseCase[];
    vendor: {
      id: string;
      fullName: string;
      companyName: string;
    };
  };
}
```

**PUT /api/tools/[id]**
```typescript
// Headers: Authorization: Bearer <token>
// Request: Same as POST but partial
// Response: Updated tool data
```

**GET /api/tools/search**
```typescript
// Query parameters
{
  q: string; // Search query
  category?: string;
  useCases?: string[];
  limit?: number;
}

// Response
{
  success: true;
  data: {
    tools: Tool[];
    suggestions: string[]; // Search suggestions
  };
}
```

**GET /api/tools/categories**
```typescript
// Response
{
  success: true;
  data: {
    categories: (Category & {
      useCases: UseCase[];
      toolCount: number;
    })[];
  };
}
```

**GET /api/tools/vendor/[vendorId]**
```typescript
// Headers: Authorization: Bearer <token>
// Response
{
  success: true;
  data: {
    tools: Tool[];
    totalTools: number;
    approvedTools: number;
    pendingTools: number;
  };
}
```

### TypeScript Types

```typescript
// lib/tools/types.ts

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
}

export interface UseCase {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string | null;
  createdAt: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string | null;
  websiteUrl: string;
  logoUrl: string | null;
  
  // Categorization
  primaryCategoryId: string;
  useCaseIds: string[];
  
  // Vendor
  vendorId: string;
  vendorContactEmail: string | null;
  
  // Details
  pricingModel: 'free' | 'freemium' | 'paid' | 'custom';
  pricingDetails: string | null;
  integrationDifficulty: 1 | 2 | 3 | 4 | 5;
  
  // Metadata
  approved: boolean;
  featured: boolean;
  viewCount: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface ToolWithRelations extends Tool {
  category: Category;
  useCases: UseCase[];
  vendor: {
    id: string;
    fullName: string;
    companyName: string | null;
  };
}

export interface ToolFilters {
  category?: string;
  useCases?: string[];
  search?: string;
  pricingModel?: string[];
  integrationDifficulty?: number[];
}

export interface SearchResult {
  tools: Tool[];
  suggestions: string[];
  totalResults: number;
}
```

### Validation Schemas

```typescript
// lib/tools/validation.ts
import { z } from 'zod';

export const toolSubmissionSchema = z.object({
  name: z.string().min(2, 'Tool name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  websiteUrl: z.string().url('Invalid website URL'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  primaryCategoryId: z.string().uuid('Invalid category'),
  useCaseIds: z.array(z.string().uuid()).min(1, 'Select at least one use case'),
  pricingModel: z.enum(['free', 'freemium', 'paid', 'custom']),
  pricingDetails: z.string().optional(),
  integrationDifficulty: z.number().int().min(1).max(5),
  vendorContactEmail: z.string().email().optional(),
});

export const toolSearchSchema = z.object({
  q: z.string().min(1, 'Search query required'),
  category: z.string().optional(),
  useCases: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(50).default(20),
});

export const toolFiltersSchema = z.object({
  category: z.string().optional(),
  useCases: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
  featured: z.boolean().optional(),
});
```

## Mock APIs for Dependencies

### Module 1 (Authentication) - Mock Responses

```typescript
// User validation response (when checking auth)
export const mockUserValidation = {
  success: true,
  data: {
    user: {
      id: "user-123",
      email: "vendor@example.com",
      role: "vendor"
    },
    profile: {
      id: "user-123",
      fullName: "John Doe",
      companyName: "TechCorp AI",
      role: "vendor"
    },
    isValid: true
  }
};

// Admin check response
export const mockAdminCheck = {
  success: true,
  data: {
    user: {
      id: "admin-123",
      email: "admin@example.com", 
      role: "admin"
    },
    hasAdminAccess: true
  }
};

// Unauthorized response
export const mockUnauthorized = {
  success: false,
  error: "Unauthorized access",
  code: "AUTH_REQUIRED"
};
```

### For Module 3 (Admin Panel) - Mock Tool Data

```typescript
// Tool data that Module 3 will consume
export const mockToolForAdmin = {
  success: true,
  data: {
    id: "tool-123",
    name: "AI Sales Assistant",
    slug: "ai-sales-assistant",
    description: "Automate your sales process with AI",
    approved: false,
    vendor: {
      id: "vendor-123",
      fullName: "Jane Smith",
      companyName: "AI Solutions Inc"
    },
    category: {
      name: "Sales",
      slug: "sales"
    },
    createdAt: "2024-01-15T10:00:00Z"
  }
};
```

## Component Specifications

### ToolCard Component
```typescript
// components/tools/ToolCard.tsx
interface ToolCardProps {
  tool: Tool;
  category: Category;
  showVendor?: boolean;
  variant?: 'grid' | 'list';
}

export function ToolCard({ tool, category, showVendor = true, variant = 'grid' }: ToolCardProps) {
  // Displays tool information in card format
  // Shows logo, name, description, category
  // Includes pricing model and integration difficulty
  // Links to detailed tool page
}
```

### ToolSearch Component
```typescript
// components/tools/ToolSearch.tsx
interface ToolSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export function ToolSearch({ onSearch, placeholder, showFilters = true }: ToolSearchProps) {
  // Search input with debounced queries
  // Optional category and use case filters
  // Search suggestions dropdown
  // Clear search functionality
}
```

### ToolForm Component
```typescript
// components/tools/ToolForm.tsx
interface ToolFormProps {
  tool?: Tool; // For editing existing tools
  onSubmit: (data: ToolSubmissionData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ToolForm({ tool, onSubmit, isSubmitting }: ToolFormProps) {
  // Form for submitting/editing tools
  // Category and use case selection
  // Logo upload functionality
  // Form validation with Zod
  // Rich text editor for long description
}
```

## Testing Strategy

### Unit Tests
- Tool API functions
- Search functionality
- Form validation
- Component rendering
- Data transformation utilities

### Integration Tests
- Database operations
- File upload to Supabase Storage
- Search with PostgreSQL
- API endpoint functionality

### Test Files Structure
```
__tests__/
├── tools/
│   ├── components/
│   │   ├── ToolCard.test.tsx
│   │   ├── ToolSearch.test.tsx
│   │   └── ToolForm.test.tsx
│   ├── api/
│   │   ├── tools.test.ts
│   │   ├── search.test.ts
│   │   └── categories.test.ts
│   └── hooks/
│       ├── useTools.test.ts
│       └── useToolSearch.test.ts
```

## Environment Variables

```bash
# .env.local (inherited from Module 1)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional for enhanced features
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name # If using Cloudinary for images
```

## Deployment Considerations

### Database Setup
1. Run migration scripts for tools, categories, use_cases tables
2. Seed initial category and use case data
3. Set up RLS policies
4. Create database indexes for performance

### File Storage
1. Configure Supabase Storage bucket for tool logos
2. Set up public access policies for approved tool images
3. Image optimization and resizing rules

### Search Optimization
1. PostgreSQL full-text search configuration
2. Regular reindexing for search performance
3. Search analytics for query optimization

## Development Checklist

### Week 3
- [ ] Set up database schema and migrations
- [ ] Create tool listing and detail pages
- [ ] Implement basic search functionality
- [ ] Build tool submission form
- [ ] Add category and use case filtering

### Week 4
- [ ] Implement vendor tool management
- [ ] Add file upload for logos
- [ ] Create search with suggestions
- [ ] Build responsive tool cards
- [ ] Add pagination and performance optimization
- [ ] Write comprehensive tests

### Success Metrics
- Tool submission and approval workflow
- Search functionality working correctly
- Category filtering operational
- Vendor tool management functional
- Public tool browsing without authentication
- Performance under load (100+ tools)

This module provides the complete tool directory functionality that serves as the core content platform for AgentDirectory. 