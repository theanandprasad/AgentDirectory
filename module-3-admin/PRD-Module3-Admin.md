# Module 3: Admin Panel & Reviews - Complete Specification

## Overview

Module 3 handles administrative operations and user review functionality. This module depends on both Module 1 (authentication) and Module 2 (tool data) to provide content moderation, tool approval, and review management capabilities.

## Business Requirements

### Core Functionality
- Admin dashboard with key metrics
- Tool approval/rejection workflow
- User review and rating system (1-5 stars)
- Content moderation tools
- Basic analytics and reporting
- User management (basic)
- Implementation story collection

### User Stories
- **Admins**: Approve/reject tool submissions, moderate content, view analytics
- **Users**: Submit reviews and implementation stories for tools
- **Vendors**: View reviews on their tools and respond to feedback

## Technical Specification

### Technology Stack
- **Frontend**: Next.js 14 App Router + TypeScript
- **Database**: Supabase PostgreSQL
- **Charts**: Recharts for dashboard analytics
- **Styling**: Tailwind CSS + Shadcn/ui
- **Rich Text**: Tiptap for rich text editing
- **Validation**: Zod for schema validation

### Database Schema

```sql
-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  review_text TEXT NOT NULL,
  implementation_story TEXT,
  
  -- Metadata
  verified BOOLEAN DEFAULT FALSE,
  helpful_votes INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  
  -- Moderation
  flagged BOOLEAN DEFAULT FALSE,
  moderated BOOLEAN DEFAULT FALSE,
  moderated_by UUID REFERENCES profiles(id),
  moderation_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Review votes (helpful/unhelpful)
CREATE TABLE review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  UNIQUE(review_id, user_id)
);

-- Admin actions log
CREATE TABLE admin_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES profiles(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('approve_tool', 'reject_tool', 'moderate_review', 'update_user_role')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('tool', 'review', 'user')),
  entity_id UUID NOT NULL,
  
  -- Action details
  old_value JSONB,
  new_value JSONB,
  reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX reviews_tool_idx ON reviews (tool_id);
CREATE INDEX reviews_user_idx ON reviews (user_id);
CREATE INDEX reviews_rating_idx ON reviews (rating);
CREATE INDEX admin_actions_admin_idx ON admin_actions (admin_id);
CREATE INDEX admin_actions_type_idx ON admin_actions (action_type);

-- Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Review policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (moderated = TRUE AND flagged = FALSE);

CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (user_id = auth.uid());

-- Vote policies
CREATE POLICY "Users can vote on reviews"
  ON review_votes FOR ALL
  USING (user_id = auth.uid());

-- Admin action policies
CREATE POLICY "Only admins can view admin actions"
  ON admin_actions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));
```

### File Structure

```
src/
├── app/
│   ├── admin/                      # Admin panel (protected)
│   │   ├── layout.tsx             # Admin layout with navigation
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── tools/
│   │   │   ├── page.tsx           # Tool approval queue
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Tool review page
│   │   ├── reviews/
│   │   │   ├── page.tsx           # Review moderation
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Individual review moderation
│   │   ├── users/
│   │   │   ├── page.tsx           # User management
│   │   │   └── [id]/
│   │   │       └── page.tsx       # User profile management
│   │   └── analytics/
│   │       └── page.tsx           # Analytics dashboard
│   ├── tools/
│   │   └── [slug]/
│   │       └── reviews/
│   │           └── page.tsx       # Public reviews for a tool
│   ├── submit-review/             # Review submission (protected)
│   │   └── [toolId]/
│   │       └── page.tsx
│   └── api/
│       ├── admin/                 # Admin API endpoints
│       │   ├── dashboard/
│       │   │   └── route.ts       # Dashboard metrics
│       │   ├── tools/
│       │   │   ├── route.ts       # Tool approval operations
│       │   │   └── [id]/
│       │   │       └── route.ts   # Individual tool approval
│       │   ├── reviews/
│       │   │   ├── route.ts       # Review moderation
│       │   │   └── [id]/
│       │   │       └── route.ts   # Individual review moderation
│       │   └── users/
│       │       ├── route.ts       # User management
│       │       └── [id]/
│       │           └── route.ts   # User operations
│       └── reviews/               # Public review API
│           ├── route.ts           # GET all reviews, POST new review
│           ├── [id]/
│           │   ├── route.ts       # GET, PUT, DELETE specific review
│           │   └── vote/
│           │       └── route.ts   # Vote on review
│           └── tool/
│               └── [toolId]/
│                   └── route.ts   # Reviews for specific tool
├── components/
│   ├── admin/                     # Admin-specific components
│   │   ├── AdminLayout.tsx       # Admin panel layout
│   │   ├── DashboardStats.tsx    # Dashboard metrics cards
│   │   ├── ToolApprovalCard.tsx  # Tool approval interface
│   │   ├── ReviewModerationCard.tsx # Review moderation interface
│   │   ├── UserManagementTable.tsx # User management table
│   │   └── AnalyticsChart.tsx    # Charts for analytics
│   └── reviews/                   # Review-specific components
│       ├── ReviewCard.tsx        # Individual review display
│       ├── ReviewForm.tsx        # Review submission form
│       ├── ReviewList.tsx        # List of reviews
│       ├── RatingStars.tsx       # Star rating component
│       └── ReviewVoting.tsx      # Helpful/unhelpful voting
├── lib/
│   ├── admin/                     # Admin utilities
│   │   ├── api.ts                # Admin API functions
│   │   ├── types.ts              # Admin TypeScript types
│   │   └── validation.ts         # Admin validation schemas
│   └── reviews/                   # Review utilities
│       ├── api.ts                # Review API functions
│       ├── types.ts              # Review TypeScript types
│       ├── validation.ts         # Review validation schemas
│       └── constants.ts          # Review constants
└── hooks/
    ├── admin/                     # Admin hooks
    │   ├── useAdminDashboard.ts  # Dashboard data
    │   ├── useToolApproval.ts    # Tool approval operations
    │   └── useReviewModeration.ts # Review moderation
    └── reviews/                   # Review hooks
        ├── useReviews.ts         # Review data fetching
        ├── useReviewSubmission.ts # Review submission
        └── useReviewVoting.ts    # Review voting
```

### API Specifications

#### Admin Dashboard API

**GET /api/admin/dashboard**
```typescript
// Headers: Authorization: Bearer <token> (admin required)

// Response
{
  success: true;
  data: {
    stats: {
      totalTools: number;
      pendingTools: number;
      approvedTools: number;
      totalReviews: number;
      flaggedReviews: number;
      totalUsers: number;
      newUsersThisWeek: number;
    };
    recentActivity: AdminAction[];
    topTools: {
      id: string;
      name: string;
      reviewCount: number;
      averageRating: number;
    }[];
  };
}
```

#### Tool Approval API

**GET /api/admin/tools**
```typescript
// Headers: Authorization: Bearer <token> (admin required)
// Query: ?status=pending&page=1&limit=20

// Response
{
  success: true;
  data: {
    tools: (Tool & {
      vendor: Profile;
      category: Category;
    })[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

**PUT /api/admin/tools/[id]**
```typescript
// Headers: Authorization: Bearer <token> (admin required)
// Request
{
  action: 'approve' | 'reject';
  reason?: string;
  notes?: string;
}

// Response
{
  success: true;
  data: {
    tool: Tool;
    action: AdminAction;
  };
  message: "Tool approved successfully";
}
```

#### Review Management API

**GET /api/reviews**
```typescript
// Query parameters
{
  toolId?: string;
  userId?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

// Response
{
  success: true;
  data: {
    reviews: (Review & {
      user: {
        id: string;
        fullName: string;
        verified: boolean;
      };
      tool: {
        id: string;
        name: string;
        slug: string;
      };
    })[];
    pagination: PaginationInfo;
    averageRating: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
}
```

**POST /api/reviews**
```typescript
// Headers: Authorization: Bearer <token>
// Request
{
  toolId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  reviewText: string;
  implementationStory?: string;
}

// Response
{
  success: true;
  data: Review;
  message: "Review submitted successfully";
}
```

**POST /api/reviews/[id]/vote**
```typescript
// Headers: Authorization: Bearer <token>
// Request
{
  isHelpful: boolean;
}

// Response
{
  success: true;
  data: {
    helpfulVotes: number;
    totalVotes: number;
    userVote: boolean | null;
  };
}
```

### TypeScript Types

```typescript
// lib/reviews/types.ts

export interface Review {
  id: string;
  toolId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  reviewText: string;
  implementationStory: string | null;
  verified: boolean;
  helpfulVotes: number;
  totalVotes: number;
  flagged: boolean;
  moderated: boolean;
  moderatedBy: string | null;
  moderationNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewWithRelations extends Review {
  user: {
    id: string;
    fullName: string;
    companyName: string | null;
    verified: boolean;
  };
  tool: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
}

export interface AdminDashboardStats {
  totalTools: number;
  pendingTools: number;
  approvedTools: number;
  totalReviews: number;
  flaggedReviews: number;
  totalUsers: number;
  newUsersThisWeek: number;
}

export interface AdminAction {
  id: string;
  adminId: string;
  actionType: 'approve_tool' | 'reject_tool' | 'moderate_review' | 'update_user_role';
  entityType: 'tool' | 'review' | 'user';
  entityId: string;
  oldValue: any;
  newValue: any;
  reason: string | null;
  createdAt: string;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}
```

### Validation Schemas

```typescript
// lib/reviews/validation.ts
import { z } from 'zod';

export const reviewSubmissionSchema = z.object({
  toolId: z.string().uuid('Invalid tool ID'),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  reviewText: z.string().min(20, 'Review must be at least 20 characters').max(2000, 'Review too long'),
  implementationStory: z.string().max(1000, 'Implementation story too long').optional(),
});

export const reviewVoteSchema = z.object({
  isHelpful: z.boolean(),
});

export const toolApprovalSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const reviewModerationSchema = z.object({
  flagged: z.boolean(),
  moderationNotes: z.string().optional(),
});
```

## Mock APIs for Dependencies

### Module 1 (Authentication) - Mock Responses

```typescript
// Admin authentication check
export const mockAdminAuth = {
  success: true,
  data: {
    user: {
      id: "admin-123",
      email: "admin@agentdirectory.com",
      role: "admin"
    },
    profile: {
      id: "admin-123",
      fullName: "Admin User",
      role: "admin"
    },
    isValid: true
  }
};

// Regular user authentication
export const mockUserAuth = {
  success: true,
  data: {
    user: {
      id: "user-456",
      email: "user@example.com",
      role: "user"
    },
    profile: {
      id: "user-456",
      fullName: "John Doe",
      companyName: "Tech Corp",
      role: "user"
    },
    isValid: true
  }
};
```

### Module 2 (Tool Directory) - Mock Responses

```typescript
// Tool data for reviews
export const mockToolData = {
  success: true,
  data: {
    id: "tool-789",
    name: "AI Sales Assistant",
    slug: "ai-sales-assistant",
    description: "Automate your sales process with AI-powered insights",
    websiteUrl: "https://aisalesassistant.com",
    logoUrl: "https://example.com/logo.png",
    primaryCategoryId: "cat-sales",
    approved: true,
    vendor: {
      id: "vendor-123",
      fullName: "Jane Smith",
      companyName: "AI Solutions Inc"
    },
    category: {
      id: "cat-sales",
      name: "Sales",
      slug: "sales"
    }
  }
};

// Pending tool for approval
export const mockPendingTool = {
  success: true,
  data: {
    id: "tool-pending-123",
    name: "Marketing Automation Pro",
    slug: "marketing-automation-pro",
    description: "Advanced marketing automation platform",
    approved: false,
    vendor: {
      id: "vendor-456",
      fullName: "Bob Johnson",
      companyName: "MarketingTech Ltd"
    },
    createdAt: "2024-01-15T10:00:00Z"
  }
};
```

## Component Specifications

### AdminLayout Component
```typescript
// components/admin/AdminLayout.tsx
interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  // Admin navigation sidebar
  // Header with admin user info
  // Breadcrumb navigation
  // Role-based access control
}
```

### ReviewForm Component
```typescript
// components/reviews/ReviewForm.tsx
interface ReviewFormProps {
  toolId: string;
  onSubmit: (data: ReviewSubmissionData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ReviewForm({ toolId, onSubmit, isSubmitting }: ReviewFormProps) {
  // Star rating input
  // Title and review text fields
  // Implementation story field
  // Form validation
  // Rich text editor for stories
}
```

### DashboardStats Component
```typescript
// components/admin/DashboardStats.tsx
interface DashboardStatsProps {
  stats: AdminDashboardStats;
  loading?: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  // Metric cards with icons
  // Trend indicators
  // Loading states
  // Responsive grid layout
}
```

## Testing Strategy

### Unit Tests
- Review submission and validation
- Admin approval workflows
- Dashboard metrics calculations
- Component rendering and interactions

### Integration Tests
- Review CRUD operations
- Tool approval process
- Admin authentication flows
- Database operations with RLS

### Test Files Structure
```
__tests__/
├── admin/
│   ├── components/
│   │   ├── AdminLayout.test.tsx
│   │   ├── DashboardStats.test.tsx
│   │   └── ToolApprovalCard.test.tsx
│   ├── api/
│   │   ├── dashboard.test.ts
│   │   ├── tools.test.ts
│   │   └── reviews.test.ts
│   └── hooks/
│       └── useAdminDashboard.test.ts
└── reviews/
    ├── components/
    │   ├── ReviewForm.test.tsx
    │   ├── ReviewCard.test.tsx
    │   └── RatingStars.test.tsx
    ├── api/
    │   ├── reviews.test.ts
    │   └── voting.test.ts
    └── hooks/
        └── useReviews.test.ts
```

## Environment Variables

```bash
# .env.local (inherited from previous modules)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional for enhanced features
RESEND_API_KEY=your_resend_key # For review notification emails
```

## Deployment Considerations

### Database Setup
1. Run migration scripts for reviews, review_votes, admin_actions tables
2. Set up RLS policies for data security
3. Create indexes for query performance
4. Set up triggers for automatic stats updates

### Admin Access
1. Configure initial admin user in profiles table
2. Set up admin role verification
3. Create admin-only route protection
4. Configure audit logging for admin actions

### Content Moderation
1. Set up automated flagging rules
2. Configure review approval workflows
3. Create moderation queues
4. Set up notification systems

## Development Checklist

### Week 5
- [ ] Set up database schema for reviews and admin actions
- [ ] Create admin dashboard with basic metrics
- [ ] Implement tool approval workflow
- [ ] Build review submission form
- [ ] Add basic content moderation

### Week 6
- [ ] Implement review voting system
- [ ] Create admin user management
- [ ] Add analytics and reporting
- [ ] Build review moderation interface
- [ ] Add comprehensive testing
- [ ] Performance optimization and deployment

### Success Metrics
- Admin can approve/reject tools successfully
- Users can submit and view reviews
- Review voting system functional
- Dashboard metrics accurate
- Content moderation working
- All admin operations logged correctly

This module completes the MVP by providing essential administrative capabilities and user engagement features through reviews and ratings. 