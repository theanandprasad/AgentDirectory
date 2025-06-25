# Module 3: Admin Panel & Reviews

## 🎯 Module Focus
This Cursor instance is dedicated to building the **Admin Panel & Reviews** module for AgentDirectory.

## 📋 Module Responsibilities
- Admin dashboard with key metrics
- Tool approval/rejection workflow
- User review and rating system (1-5 stars)
- Content moderation tools
- Basic analytics and reporting
- Implementation story collection

## 📄 Complete Specification
See [`PRD-Module3-Admin.md`](./PRD-Module3-Admin.md) for the complete technical specification.

## 🏗️ Development Focus Areas

### Files to Create in Main Project
```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── tools/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── reviews/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── analytics/page.tsx
│   ├── tools/[slug]/reviews/page.tsx
│   ├── submit-review/[toolId]/page.tsx
│   └── api/
│       ├── admin/
│       │   ├── dashboard/route.ts
│       │   ├── tools/route.ts
│       │   ├── reviews/route.ts
│       │   └── users/route.ts
│       └── reviews/
│           ├── route.ts
│           ├── [id]/route.ts
│           └── tool/[toolId]/route.ts
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── ToolApprovalCard.tsx
│   │   ├── ReviewModerationCard.tsx
│   │   ├── UserManagementTable.tsx
│   │   └── AnalyticsChart.tsx
│   └── reviews/
│       ├── ReviewCard.tsx
│       ├── ReviewForm.tsx
│       ├── ReviewList.tsx
│       ├── RatingStars.tsx
│       └── ReviewVoting.tsx
├── lib/
│   ├── admin/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── validation.ts
│   └── reviews/
│       ├── api.ts
│       ├── types.ts
│       ├── validation.ts
│       └── constants.ts
└── hooks/
    ├── admin/
    │   ├── useAdminDashboard.ts
    │   ├── useToolApproval.ts
    │   └── useReviewModeration.ts
    └── reviews/
        ├── useReviews.ts
        ├── useReviewSubmission.ts
        └── useReviewVoting.ts
```

## 🔌 Module Dependencies

### Consumes from Module 1 (Authentication)
```typescript
// Admin authentication and role checking
GET /api/auth/validate-session

// User profile data for reviews
GET /api/auth/profile
```

### Consumes from Module 2 (Tool Directory)
```typescript
// Tool data for reviews and approval
GET /api/tools
GET /api/tools/[id]

// Tool approval operations
PUT /api/tools/[id]
```

**Development Mode**: Use mock responses provided in the PRD until other modules are complete.

## 📤 APIs This Module Provides
This module provides review and admin data for the complete system:

### Review APIs
```typescript
GET /api/reviews?toolId=123
POST /api/reviews
PUT /api/reviews/[id]
POST /api/reviews/[id]/vote
```

### Admin APIs
```typescript
GET /api/admin/dashboard
GET /api/admin/tools?status=pending
PUT /api/admin/tools/[id] (approve/reject)
```

## 🧪 Testing Strategy
Focus on testing:
- Admin authentication and authorization
- Tool approval workflows
- Review submission and moderation
- Dashboard metrics accuracy
- Role-based access control

## ⚡ Development Timeline
**Weeks 5-6**
- Week 5: Admin dashboard, tool approval, basic reviews
- Week 6: Review voting, moderation, analytics, final integration

## 🚀 Getting Started
1. Open this directory in Cursor
2. Read the complete PRD specification
3. Set up database schema for reviews and admin actions
4. Start with admin dashboard and work through the structure

## 🔧 Database Setup
```sql
-- Run these migrations (provided in PRD)
CREATE TABLE reviews (...);
CREATE TABLE review_votes (...);
CREATE TABLE admin_actions (...);
-- Plus indexes and RLS policies
```

## 📊 Mock Data for Development
```typescript
// Module 1 (Auth) mocks
const mockAdminAuth = {
  success: true,
  data: {
    user: { id: "admin-123", role: "admin" },
    isValid: true
  }
};

// Module 2 (Tools) mocks
const mockToolData = {
  success: true,
  data: {
    id: "tool-789",
    name: "AI Sales Assistant",
    approved: false,
    vendor: { fullName: "Jane Smith" }
  }
};
```

## 🎨 UI Libraries
- **Charts**: Recharts for dashboard analytics
- **Rich Text**: Tiptap for review editing
- **Icons**: Lucide React for admin interface

## ✅ Success Criteria
- [ ] Admin dashboard functional with metrics
- [ ] Tool approval workflow working
- [ ] Review submission and display complete
- [ ] Review voting system operational
- [ ] Content moderation tools working
- [ ] Admin action logging functional
- [ ] All APIs ready for final integration 