# Picxie Web - Project Goals & Context

> **READ THIS FILE AT THE START OF EVERY DEVELOPMENT SESSION**

## Project Overview

**Picxie Web** is a construction photo management web application that connects to the **same Supabase database** as the existing React Native mobile app. This ensures seamless synchronization between mobile and web platforms.

## Core Mission

Build a professional, monochrome, Apple-inspired web interface for:
1. Viewing and managing construction photos
2. Organizing sites with GPS geofencing
3. Managing projects (Active/Completed status)
4. Providing admin tools for data management

## Key Principles

### Design Philosophy
- **Monochrome Only**: White, grays (50-900), black
- **Minimal Accents**: Green (active status), Red (delete actions)
- **Flat Design**: NO shadows, NO gradients, NO blue
- **Apple-like**: Clean, minimal, generous whitespace
- **Responsive**: Mobile, tablet, desktop support

### Technical Philosophy
- **Database Compatibility**: NEVER break mobile app compatibility
- **Type Safety**: TypeScript everywhere
- **Server Components**: Use Next.js Server Components by default
- **Client Only When Needed**: Use 'use client' only for interactivity
- **Clean Code**: Minimal, readable, well-documented

## Current State (v0.1.1)

### ✅ What's Working
- Dashboard with stats (but showing incorrect counts)
- Photo library with filters
- Sites and Projects pages (structure in place)
- Interactive maps with Leaflet
- Responsive layout with sidebar navigation

### ⚠️ Critical Issues
1. **Data Integrity Problem**: Sites showing 0, Projects showing 0, but 1 photo exists
   - Photo address: "17950, SW 143rd Ct, Miami, FL, 33177"
   - Likely cause: Missing site/project records OR orphaned foreign keys
   - **Priority**: Fix ASAP before building more features

2. **No Authentication**: App is wide open (security risk)

3. **No CRUD**: Can't create, edit, or delete anything

### ❌ Not Implemented
- Authentication & authorization
- Row Level Security (RLS) on Supabase
- Create/Edit/Delete operations
- Photo upload from web
- Search functionality
- Data export tools
- Error handling
- Loading states (partial)

## Immediate Priorities (Next Session)

### Priority 1: Fix Data Integrity (URGENT)
**Why**: Can't test features properly with broken data
**What**:
1. Create `/debug` page to inspect database state
2. Query photos, sites, projects tables
3. Identify missing records or broken foreign keys
4. Create SQL migration to fix data
5. Verify dashboard shows correct counts

**Success Criteria**: Dashboard shows accurate site/project counts

### Priority 2: Environment Variables
**Why**: Security best practice, deployment readiness
**What**:
1. Already done: Updated `lib/supabase.ts` to use env vars
2. Create `.env.local` file (not committed)
3. Test app works with env vars

**Success Criteria**: App runs with environment variables

### Priority 3: Error Handling
**Why**: Better developer and user experience
**What**:
1. Wrap all Supabase queries in try-catch
2. Create ErrorBoundary component
3. Display user-friendly error messages
4. Log errors to console

**Success Criteria**: App gracefully handles Supabase errors

## Development Workflow

### Before Starting Work
1. ✅ Read this file (PROJECT_GOALS.md)
2. ✅ Check CHANGELOG.md for latest changes
3. ✅ Review DEVELOPMENT_PRIORITIES.md for current phase
4. ✅ Understand the data model (types/database.ts)

### During Development
1. **Test with Real Data**: Use actual Supabase database
2. **Maintain Mobile Compatibility**: Don't break mobile app
3. **Follow Design System**: Monochrome, flat, minimal
4. **Document Changes**: Update CHANGELOG.md after each session
5. **Write Clean Code**: TypeScript types, clear naming

### After Completing Work
1. Update CHANGELOG.md with changes (semantic versioning)
2. Test all affected pages
3. Build and verify no errors (`npm run build`)
4. Document any new issues or TODOs

## Database Schema (Reference)

### Sites
```typescript
{
  id: uuid
  name: string
  latitude: number
  longitude: number
  radius_meters: number
  folder_name: string (unique)
  created_at: timestamp
}
```

### Projects
```typescript
{
  id: uuid
  name: string
  site_id: uuid (FK → sites)
  status: 'Active' | 'Completed'
  created_at: timestamp
  completed_at: timestamp | null
}
```

### Photos
```typescript
{
  id: uuid
  file_name: string
  site_id: uuid (FK → sites)
  project_id: uuid | null (FK → projects)
  latitude: number
  longitude: number
  address: string
  captured_at: timestamp
  uploaded_at: timestamp
  local_uri: string | null
}
```

### User Profiles
```typescript
{
  id: uuid (FK → auth.users)
  display_name: string
  email: string
  is_admin: boolean
  created_at: timestamp
}
```

## Success Metrics

### v0.2.0 Goals (Next Major Version)
- ✅ Data integrity fixed (sites/projects showing correct counts)
- ✅ Authentication working (Supabase Auth)
- ✅ Row Level Security enabled
- ✅ CRUD operations for sites and projects
- ✅ Error handling implemented
- ✅ Environment variables in use

### v1.0.0 Goals (Production Ready)
- ✅ All CRUD operations complete
- ✅ Photo upload from web
- ✅ Search and filtering
- ✅ Data export (CSV, PDF, ZIP)
- ✅ User management
- ✅ Real-time updates
- ✅ 70%+ test coverage
- ✅ Deployed to production
- ✅ Full mobile app compatibility

## Common Pitfalls to Avoid

### 1. Breaking Mobile App Compatibility
❌ DON'T change database schema without coordinating
❌ DON'T add required fields to existing tables
✅ DO maintain backward compatibility
✅ DO test with mobile app after changes

### 2. Violating Design System
❌ DON'T use blue or colorful accents
❌ DON'T add shadows or gradients
❌ DON'T use complex animations
✅ DO use monochrome palette
✅ DO keep it flat and minimal
✅ DO follow Apple-like aesthetic

### 3. Overcomplicating Architecture
❌ DON'T add unnecessary state management libraries
❌ DON'T create API routes when Supabase client works
❌ DON'T over-engineer simple features
✅ DO use Server Components by default
✅ DO keep it simple and maintainable
✅ DO follow Next.js conventions

### 4. Ignoring Type Safety
❌ DON'T use `any` types
❌ DON'T skip TypeScript errors
✅ DO define proper interfaces
✅ DO use Supabase-generated types
✅ DO leverage TypeScript fully

## Tech Stack Quick Reference

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (inline @theme)
- **Backend**: Supabase (PostgreSQL + Storage)
- **Maps**: Leaflet + react-leaflet
- **Icons**: lucide-react
- **Fonts**: Geist Sans, Geist Mono
- **Deployment**: Vercel (recommended)

## File Structure Quick Reference

```
picxie-web/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx           # Dashboard
│   ├── photos/page.tsx    # Photo library
│   ├── sites/...          # Sites pages
│   ├── projects/...       # Projects pages
│   └── admin/page.tsx     # Admin panel
├── components/            # Reusable UI components
├── lib/supabase.ts        # Supabase client
├── types/database.ts      # TypeScript types
└── [docs]                 # README, CHANGELOG, etc.
```

## Documentation Files

1. **README.md** - Project overview and setup
2. **CHANGELOG.md** - Version history (Keep a Changelog format)
3. **CODEBASE_STRUCTURE.md** - Detailed architecture
4. **DATA_ANALYSIS.md** - Data integrity troubleshooting
5. **DEVELOPMENT_PRIORITIES.md** - 9-phase roadmap
6. **PROJECT_GOALS.md** - This file (read every session!)

## Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Test production build
npm run lint             # Check code quality

# Database
# Use Supabase Dashboard SQL Editor for queries
# Tables: sites, projects, photos, user_profiles

# Deployment
# Push to GitHub → Vercel auto-deploys
```

## Contact & Coordination

- **Mobile App**: React Native (shares Supabase database)
- **Database**: Supabase (single source of truth)
- **Storage**: Supabase Storage (`photos/` bucket)
- **URL**: https://ampxyzotiiqmwcwsdfut.supabase.co

## Remember

1. 📖 Read this file at the start of every session
2. 🔍 Check DATA_ANALYSIS.md before debugging data issues
3. 📝 Update CHANGELOG.md after completing work
4. 🎨 Maintain monochrome design (white/gray/black only)
5. 🔐 Never commit `.env.local` with real credentials
6. 📱 Test changes don't break mobile app compatibility
7. 🧪 Run `npm run build` before marking work complete

---

**Last Updated**: 2025-11-08 (v0.1.1)
**Next Focus**: Fix data integrity issues, add authentication
