# Changelog

All notable changes to the Picxie Web application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### To Do
- Implement CRUD operations for sites, projects, and users
- Add authentication and user management
- Implement photo upload functionality
- Add advanced filtering and search capabilities
- Create admin management interfaces

## [0.2.1] - 2025-11-08

### Diagnosed
- **CRITICAL RLS Issue Identified**
  - Root cause: Row Level Security policies blocking SELECT queries on sites and projects tables
  - Symptom: App shows 0 sites and 0 projects when 6+ records exist in database
  - Evidence: Photos table accessible, but sites/projects queries return empty arrays
  - Impact: All pages showing incorrect data (Dashboard, Sites, Projects)

### Added
- **Diagnostic Scripts**
  - `scripts/detailed-check.ts` - In-depth RLS and query diagnostics
  - Shows exact queries being run and their results
  - Identifies RLS blocking vs actual empty tables
  - Tests both count queries and data queries

- **SQL Utilities**
  - `scripts/setup-rls-policies.sql` - Complete RLS policy setup for all tables
  - Creates read policies for sites, projects, photos, user_profiles
  - Optional write policies (commented) for development
  - Includes verification queries to confirm policy creation

  - `scripts/cleanup-duplicates.sql` - Remove duplicate sites and projects
  - Merges duplicate sites (same coordinates)
  - Merges duplicate projects (same site + status)
  - Updates foreign keys before deletion
  - Links photos to projects if NULL
  - Shows before/after state for verification

- **Documentation**
  - `scripts/README.md` - Comprehensive guide for all utility scripts
  - Common workflow documentation
  - Troubleshooting guide for RLS issues
  - Script execution requirements

### Changed
- **SUPABASE_RLS_SETUP.md** - Complete rewrite
  - Added clear diagnosis of current issue
  - Step-by-step instructions to apply fix (5 minutes)
  - Evidence section explaining what's happening
  - Impact section showing affected pages
  - Alternative quick fix (disable RLS)

- **README.md** - Enhanced setup instructions
  - Added CRITICAL warning about RLS configuration
  - Moved RLS setup to step 5 (before running app)
  - Added quick fix steps directly in README
  - Reorganized "Available Scripts" section
  - Updated "Known Issues" with RLS diagnosis
  - Added scripts/README.md to documentation links

### Technical Details
- RLS policies silently filter results instead of throwing errors
- Queries return `[]` (empty array) with `error: null`
- Photos have valid `site_id` foreign keys proving sites exist
- Querying sites by specific IDs still returns empty (confirms RLS blocking)
- Anon key used by web app vs service/postgres role used in SQL Editor

### User Actions Required
1. **Immediate:** Run `scripts/setup-rls-policies.sql` in Supabase SQL Editor
2. **If duplicates exist:** Run `scripts/cleanup-duplicates.sql` in SQL Editor
3. **Verify fix:** Refresh web app - should show 6 sites and 6 projects
4. **Link photos:** Run `npx tsx scripts/fix-data.ts` (after RLS configured)

## [0.2.0] - 2025-11-08

### Added
- **Debug Page** (`/debug`)
  - Database inspection interface showing all sites, projects, and photos
  - "Fix Missing Data" function to auto-create missing site and project relationships
  - Detailed table views with complete data for troubleshooting
  - Data integrity validation and warnings

- **Error Handling**
  - `ErrorBoundary` - React error boundary component for graceful error handling
  - `ErrorMessage` - Reusable error display component with retry functionality
  - Dashboard error handling with fallback states
  - Data integrity warnings when photos exist without sites

- **Utility Scripts**
  - `scripts/check-db.ts` - Check database state and verify counts
  - `scripts/fix-data.ts` - Automated data fix script to create missing sites/projects
  - Auto-linking photos to sites based on GPS coordinates
  - Auto-creation of default projects for sites

- **Documentation**
  - `SUPABASE_RLS_SETUP.md` - Comprehensive guide for configuring Row Level Security
  - RLS policy examples (development and production)
  - Service role setup instructions
  - Mobile app compatibility notes

### Changed
- **Dashboard Improvements**
  - Added error handling with try/catch and fallback data
  - Added data integrity warning banner when photos exist without sites
  - Link to debug page from integrity warning
  - Improved error messages with actionable information

- **README Updates**
  - Added RLS setup step to installation instructions
  - Added utility scripts to available commands
  - Updated Known Issues section with RLS and data relationship issues
  - Added SUPABASE_RLS_SETUP.md to documentation list

### Fixed
- **TypeScript Build Errors**
  - Fixed type inference issues with Supabase queries in server components
  - Added explicit type casts for `sites`, `projects`, and `photos` data
  - Fixed "Property does not exist on type 'never'" errors across all pages
  - Added proper type imports (Site, Project, Photo) to all pages

- **Type Safety**
  - Fixed `app/sites/page.tsx` - Cast sites array to `Site[]`
  - Fixed `app/sites/[id]/page.tsx` - Added Site import and type casting
  - Fixed `app/projects/page.tsx` - Cast projectsData to `any[]` for joined queries
  - Fixed `app/projects/[id]/page.tsx` - Cast project data to Project type
  - Fixed `app/debug/page.tsx` - Added @ts-ignore for Supabase insert operations

### Known Issues
- **Row Level Security (RLS)** - Supabase RLS policies block write operations
  - Read operations work correctly (dashboard, photo viewing, etc.)
  - Write operations (insert, update, delete) fail with RLS policy violations
  - Debug page "Fix Missing Data" requires RLS configuration
  - See `SUPABASE_RLS_SETUP.md` for solutions

### Technical Details
- Build now completes successfully with no TypeScript errors
- All pages properly typed with Supabase database schema
- Error boundaries catch and display runtime errors gracefully
- Utility scripts use tsx for TypeScript execution

## [0.1.2] - 2025-11-08

### Added
- **Version Control Setup**
  - Git repository initialization
  - `.gitmessage` - Commit message template with conventional commits format
  - `.github/workflows/ci.yml` - GitHub Actions CI/CD pipeline
  - Automated linting and build checks on push/PR

### Changed
- **Git Configuration**
  - Updated `.gitignore` with comprehensive exclusions
  - Configured commit template for standardized commit messages
  - Added exceptions for `.env.example` files to be committed

### Infrastructure
- **CI/CD Pipeline**
  - Automated ESLint checks on push to main/develop
  - Automated build verification
  - Environment variable support for builds
  - Placeholder for future test automation

### Documentation
- Added `PROJECT_GOALS.md` - Master reference guide (read at start of every session)
- Enhanced `.gitignore` with detailed comments
- Created commit message template with examples

## [0.1.1] - 2025-11-08

### Added
- **Documentation**
  - `README.md` - Comprehensive project overview and setup guide
  - `CHANGELOG.md` - Version history following Keep a Changelog format
  - `CODEBASE_STRUCTURE.md` - Detailed architecture documentation
  - `DATA_ANALYSIS.md` - Data integrity issue analysis and troubleshooting
  - `DEVELOPMENT_PRIORITIES.md` - Phased development roadmap
  - `.env.example` - Environment variable template
  - `.env.local.example` - Local development environment template

### Changed
- **Environment Configuration**
  - Updated `lib/supabase.ts` to use environment variables
  - Added fallback to hardcoded values for development
  - Added validation for required Supabase configuration

### Fixed
- Next.js image configuration for Supabase storage hostname

### Documentation Highlights
- Analyzed data discrepancies (sites/projects showing 0 counts)
- Documented complete tech stack and project structure
- Created 9-phase development roadmap with time estimates
- Identified 5 potential root causes for data integrity issues
- Provided diagnostic steps and resolution strategies

## [0.1.0] - 2025-11-08

### Added
- **Initial Project Setup**
  - Next.js 16 with App Router and TypeScript
  - Tailwind CSS 4 with custom monochrome theme
  - Supabase integration for backend database
  - Responsive layout with sidebar navigation

- **Database Integration**
  - TypeScript types for all database tables (sites, projects, photos, user_profiles)
  - Supabase client configuration
  - Connection to existing mobile app database

- **Core Components**
  - `Sidebar`: Responsive navigation with mobile menu
  - `MainLayout`: Page wrapper with consistent header
  - `PhotoGrid`: Responsive photo grid (2-4 columns)
  - `PhotoModal`: Full-screen photo viewer with metadata
  - `StatCard`: Dashboard statistics cards
  - `LoadingSpinner`: Loading state indicator
  - `EmptyState`: Empty data state component
  - `SiteCard`: Site display card
  - `ProjectCard`: Project display card with status badge
  - `MapView`: Interactive map with Leaflet integration

- **Pages Implemented**
  - `/` - Dashboard with stats and recent photos
  - `/photos` - Photo library with site/project filters
  - `/sites` - Sites list view
  - `/sites/[id]` - Site detail with map and photos
  - `/projects` - Projects list with Active/Completed tabs
  - `/projects/[id]` - Project detail with photos
  - `/admin` - Admin panel with database stats (placeholders for CRUD)

- **Design System**
  - Monochrome color palette (white, grays, black)
  - Green accent for active status
  - Red accent for delete actions
  - Flat design (no shadows, no gradients)
  - Apple-like minimal aesthetic
  - Responsive breakpoints for mobile, tablet, desktop

- **Features**
  - Photo viewing with full metadata (GPS, address, timestamp)
  - Site/project filtering in photo library
  - Interactive maps showing site locations and radius
  - Project status management (Active/Completed)
  - Real-time data fetching from Supabase
  - Photo count aggregations per site/project

### Technical Stack
- **Framework**: Next.js 16.0.1 (App Router, Server Components)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Storage)
- **Maps**: Leaflet with react-leaflet
- **Icons**: lucide-react
- **Fonts**: Geist Sans, Geist Mono

### Known Issues
- Sites count showing 0 despite existing site data
- Projects count showing 0 despite potential project associations
- No authentication/authorization implemented yet
- Admin CRUD operations not yet functional (UI only)
- No error handling or validation
- No photo upload capability from web interface

### Dependencies
```json
{
  "@supabase/supabase-js": "^2.80.0",
  "next": "16.0.1",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "lucide-react": "latest",
  "react-leaflet": "latest",
  "leaflet": "latest"
}
```

[unreleased]: https://github.com/yourusername/picxie-web/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/yourusername/picxie-web/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/yourusername/picxie-web/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/yourusername/picxie-web/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/yourusername/picxie-web/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/yourusername/picxie-web/releases/tag/v0.1.0
