# AgentDirectory - Multi-Instance Development Guide

## 🎯 Workspace Structure

Your AgentDirectory project is now organized for **multi-instance Cursor development**. Each module can be developed independently with its own Cursor instance.

```
AgentDirectory/
├── README.md                    # Project overview
├── PRD.md                      # Main PRD (updated for modular approach)
├── Backlog.md                  # Future features (post-MVP)
├── WORKSPACE-GUIDE.md          # This file
├── docs/                       # Architecture documentation
│   ├── PRD-Overview.md         # High-level architecture
│   ├── PRD-Module1-Auth.md     # Complete auth specification
│   ├── PRD-Module2-Directory.md # Complete directory specification
│   └── PRD-Module3-Admin.md    # Complete admin specification
├── module-1-auth/              # 🔴 CURSOR INSTANCE 1
│   ├── README.md               # Module overview
│   ├── quick-start.md          # Immediate next steps
│   └── PRD-Module1-Auth.md     # Complete specification
├── module-2-directory/         # 🟡 CURSOR INSTANCE 2
│   ├── README.md               # Module overview
│   ├── quick-start.md          # Immediate next steps
│   └── PRD-Module2-Directory.md # Complete specification
└── module-3-admin/             # 🟢 CURSOR INSTANCE 3
    ├── README.md               # Module overview
    ├── quick-start.md          # Immediate next steps
    └── PRD-Module3-Admin.md    # Complete specification
```

## 🚀 How to Start Development

### Step 1: Choose Your Starting Module
**Recommended: Start with Module 1 (Authentication)**

```bash
# Open Module 1 in first Cursor instance
cd /path/to/AgentDirectory
cursor module-1-auth/
```

### Step 2: Use the Quick Start Guide
Each module has a `quick-start.md` with:
- ✅ Immediate next steps
- ✅ First Cursor prompt to use
- ✅ Development order
- ✅ Success criteria

### Step 3: Follow the Complete PRD
Each module has its own complete PRD with:
- ✅ Full technical specification
- ✅ Database schema and migrations
- ✅ API definitions with examples
- ✅ Component specifications
- ✅ Mock APIs for dependencies
- ✅ Testing strategy

## 🔄 Development Workflow

### Sequential Development (Recommended)
```bash
# Week 1-2: Authentication Foundation
cursor module-1-auth/
# Build: User auth, profiles, role management

# Week 3-4: Tool Directory Core  
cursor module-2-directory/
# Build: Tool listings, search, submission

# Week 5-6: Admin Panel & Reviews
cursor module-3-admin/
# Build: Admin dashboard, reviews, approval workflow
```

### Parallel Development (Advanced)
```bash
# Terminal 1: Authentication specialist
cursor module-1-auth/

# Terminal 2: Frontend/Directory specialist
cursor module-2-directory/

# Terminal 3: Admin/Backend specialist  
cursor module-3-admin/
```

## 🔗 Module Integration

### Module Dependencies
- **Module 1**: No dependencies (foundation)
- **Module 2**: Depends on Module 1 APIs (with mocks provided)
- **Module 3**: Depends on Modules 1 & 2 APIs (with mocks provided)

### Integration Phases
1. **Independent Development** (Use mocks)
2. **API Integration** (Replace mocks with real APIs)
3. **End-to-End Testing** (Full system integration)

## 📁 Where Files Get Created

### All modules create files in the main project structure:
```
AgentDirectory/
├── src/                        # Main application code
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/            # Module 1 files
│   │   ├── tools/             # Module 2 files
│   │   ├── admin/             # Module 3 files
│   │   └── api/               # API routes from all modules
│   ├── components/
│   │   ├── auth/              # Module 1 components
│   │   ├── tools/             # Module 2 components
│   │   ├── admin/             # Module 3 components
│   │   └── reviews/           # Module 3 components
│   ├── lib/
│   │   ├── auth/              # Module 1 utilities
│   │   ├── tools/             # Module 2 utilities
│   │   ├── admin/             # Module 3 utilities
│   │   └── reviews/           # Module 3 utilities
│   └── hooks/
│       ├── auth/              # Module 1 hooks
│       ├── tools/             # Module 2 hooks
│       ├── admin/             # Module 3 hooks
│       └── reviews/           # Module 3 hooks
├── package.json               # Shared dependencies
├── next.config.js             # Shared configuration
├── tailwind.config.js         # Shared styling
└── .env.local                 # Shared environment variables
```

## 🎯 Success Criteria by Module

### Module 1 Success ✅
- [ ] User registration and login working
- [ ] Role-based access control implemented
- [ ] Session persistence across refreshes
- [ ] Profile management functional
- [ ] APIs ready for other modules

### Module 2 Success ✅
- [ ] Public tool browsing operational
- [ ] Tool submission workflow complete
- [ ] Search and filtering functional
- [ ] Vendor tool management working
- [ ] APIs ready for Module 3

### Module 3 Success ✅
- [ ] Admin dashboard with metrics
- [ ] Tool approval workflow operational
- [ ] Review system functional
- [ ] Content moderation working
- [ ] End-to-end system complete

## 🛠 Git Workflow

### Branch Strategy
```bash
# Create feature branches per module
git checkout -b feature/module-1-auth
git checkout -b feature/module-2-directory
git checkout -b feature/module-3-admin

# Integration branch
git checkout -b integration/all-modules
```

### Merge Order
1. Module 1 (auth) → main
2. Module 2 (directory) → main  
3. Module 3 (admin) → main
4. Integration testing → main

## 🔧 Shared Configuration

### Environment Variables
All modules share `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
```

### Package Dependencies
All modules add to the same `package.json` in the root directory.

### Database Migrations
Run migrations sequentially:
1. Module 1: `profiles` table
2. Module 2: `tools`, `categories`, `use_cases` tables
3. Module 3: `reviews`, `review_votes`, `admin_actions` tables

## 📞 Need Help?

### Module-Specific Help
- **Module 1**: See `module-1-auth/README.md` and `module-1-auth/quick-start.md`
- **Module 2**: See `module-2-directory/README.md` and `module-2-directory/quick-start.md`
- **Module 3**: See `module-3-admin/README.md` and `module-3-admin/quick-start.md`

### Architecture Help
- **Overall architecture**: See `docs/PRD-Overview.md`
- **Integration patterns**: See "Mock APIs" sections in each module PRD
- **API contracts**: See "API Specifications" sections in each module PRD

### Future Features
- **Advanced features**: See `Backlog.md` for post-MVP development

## ⚡ Quick Commands

```bash
# Start Module 1 development
cursor module-1-auth/

# Start Module 2 development
cursor module-2-directory/

# Start Module 3 development
cursor module-3-admin/

# View all documentation
cursor docs/

# Full project overview
cursor .
```

This modular structure enables maximum efficiency for Cursor AI development while maintaining system coherence and enabling true parallel development! 🚀 