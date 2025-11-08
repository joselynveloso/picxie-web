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
- Implement data validation and error handling
- Add loading states and error boundaries
- Create admin management interfaces
- Fix data integrity issues (sites/projects showing 0)

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

[unreleased]: https://github.com/yourusername/picxie-web/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/picxie-web/releases/tag/v0.1.0
