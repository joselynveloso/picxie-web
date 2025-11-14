# Changelog

All notable changes to the Picxie Web application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### To Do
- Implement CRUD operations for sites, projects, and users
- Add advanced filtering and search capabilities
- Create admin management interfaces
- Add reverse geocoding for addresses from GPS coordinates
- Add count-up animations for Dashboard stats
- Add email verification flow
- Add password reset functionality

## [0.7.3] - 2025-11-13

### Fixed - Auth Redirect with Hard Redirect and Session Verification 🔧

Fixed authentication redirect issues with hard redirect and comprehensive session verification.

**Login Page:**
- Removed dev bypass button completely
- **Session Verification**: Explicitly checks session was created before redirecting
- **Hard Redirect**: Uses `window.location.href` with 100ms delay for reliable redirect
- **Comprehensive Logging**:
  - 🚀 Form submission with email
  - ✅ Login successful with user email
  - 🔍 Verifying session was created
  - ✅ Session confirmed
  - 📍 Redirecting to home
  - 🔄 Executing redirect
- Login calls Supabase directly for better control
- Better error handling with specific error messages for each failure point
- Session verification prevents redirect if session creation fails

**Middleware:**
- Removed all dev bypass code (env var and cookie checks)
- **Comprehensive Path and Session Logging**:
  - 🔍 Logs every path being checked
  - 🔍 Logs session check result with user email or "No session"
  - ℹ️ Logs when allowing access to auth pages
  - 🔒 Logs when redirecting to login with source path
  - ✅ Logs when allowing access to protected pages
  - 🔄 Logs all redirect decisions
- Better visibility into middleware decisions
- Helps diagnose redirect loops and auth issues

**AuthContext:**
- Added comprehensive session debugging
- Logs active session on load with user email
- Logs auth state changes with event type
- Error logging for session check failures
- Better visibility into auth flow

**Environment Variables:**
- Removed `DISABLE_AUTH` option from `.env.local.example`
- Cleaner configuration without dev bypass options

**Technical Changes:**
- Direct Supabase auth calls from login page
- Router-based redirects instead of window.location
- Refresh router to update auth state immediately
- Better session debugging throughout the flow

## [0.7.2] - 2025-11-13

### Added - Dev Bypass for Testing ⚠️

Added development bypass button to skip authentication during local testing.

**Login Page:**
- Added "Continue without Login (Dev Mode)" button
- Only visible in development environment (`NODE_ENV=development`)
- Yellow warning styling to indicate it's a dev-only feature
- Sets `dev-bypass` cookie for 24 hours
- Console logging when bypass is used

**Middleware:**
- Added cookie-based dev bypass check
- Only works when `NODE_ENV=development` for safety
- Checks for `dev-bypass=true` cookie
- Console logs when auth is bypassed via cookie
- Separate from environment variable bypass option

**Security:**
- Dev bypass only works in development mode
- Cannot be used in production (NODE_ENV check)
- Clear warning emoji and styling
- Console logs for transparency

**Use Cases:**
- Testing app features without authentication
- Debugging non-auth related issues
- Quick development iteration
- Email confirmation not configured yet

## [0.7.1] - 2025-11-13

### Fixed - Authentication Login Issues 🔧

Fixed authentication stuck on "Signing in..." and improved error handling with comprehensive debugging.

**AuthContext Improvements:**
- Added comprehensive console logging with emojis for debugging (🔐 login, ✅ success, ❌ error, 📍 redirect)
- Changed from `router.push()` to `window.location.href` for hard redirects to ensure middleware runs
- Added detailed error logging for debugging authentication issues
- Improved error return structure with explicit null returns

**Login Page Enhancements:**
- Added 10-second safety timeout to reset loading state if redirect doesn't happen
- Added comprehensive console logging for form submission and auth flow
- Added try-catch error handling for unexpected errors
- Better error messages displayed to users
- Timeout warning if login takes longer than expected
- Added mounting state to prevent client-side hydration issues
- Loading state while component mounts

**Signup Page Enhancements:**
- Added same 10-second safety timeout mechanism
- Added comprehensive console logging matching login page
- Added try-catch error handling
- Improved error messaging and user feedback

**Middleware Improvements:**
- Added dev mode bypass option (`DISABLE_AUTH=true` in .env.local for testing)
- Added comprehensive error handling with try-catch
- Added detailed console logging for all auth checks (✅ valid session, 🔒 no session, 🔴 errors)
- Better error recovery to prevent infinite redirect loops
- Logs user email on successful session validation

**Development Options:**
- Added `DISABLE_AUTH` environment variable for local testing
- Updated `.env.local.example` with dev mode documentation
- Warning comments to never use DISABLE_AUTH in production

**Technical Changes:**
- Hard redirects using `window.location.href` instead of Next.js router
- Prevents "stuck" loading states with automatic timeout
- Better debugging with emoji-prefixed console logs
- Graceful error handling for all edge cases
- Client-side hydration issue prevention

## [0.7.0] - 2025-11-13

### Added - Authentication with Supabase Auth 🔐

Complete authentication system with minimal glass aesthetic, protected routes, and user session management.

**Auth Context & Provider:**
- **AuthProvider component** (`contexts/AuthContext.tsx`)
  - User session state management
  - Sign in, sign up, sign out functions
  - Automatic session persistence
  - Auth state change listener
  - Redirects on auth actions

- **ClientLayout wrapper** (`components/ClientLayout.tsx`)
  - Wraps entire app with AuthProvider
  - Enables auth across all pages

**Auth Pages:**
- **Login page** (`/auth/login`)
  - Minimal glass card design
  - Email and password inputs with icons
  - Error handling with messages
  - Loading states
  - Link to signup page
  - Lavender accent on focus
  - Logo and title at top

- **Signup page** (`/auth/signup`)
  - Clean registration form
  - Email, password, confirm password
  - Password validation (min 6 characters)
  - Match validation for passwords
  - Success message with email verification notice
  - Error handling
  - Link to login page

**Protected Routes:**
- **Middleware** (`middleware.ts`)
  - Uses @supabase/ssr for session management
  - Protects all pages except /auth/*
  - Redirects to /auth/login if not authenticated
  - Redirects to / if already logged in and accessing auth pages
  - Cookie-based session handling

**Navigation Updates:**
- **User menu in BottomNav**
  - User icon with email tooltip on hover
  - Dropdown menu with user info
  - "Signed in as" section showing email
  - Sign out button with icon
  - Separator between nav items and user menu
  - Glass aesthetic matching nav design

**Row Level Security:**
- **SQL script** (`scripts/setup-auth-rls.sql`)
  - Enables RLS on all tables (sites, projects, photos, user_profiles)
  - Adds user_id column to all tables
  - Creates policies for SELECT, INSERT, UPDATE, DELETE
  - Users can only access their own data
  - Automatic user profile creation on signup
  - Trigger function for new user profiles

**Upload Integration:**
- UploadModal now includes user_id
  - Automatically sets user_id from auth context
  - Photos belong to authenticated user

**Styling:**
- Dark background (#000)
  - Glass cards with 3% white opacity
  - Minimal design throughout
  - Lavender accents (#e9d5ff)
  - Smooth transitions
  - Consistent with app aesthetic

### Changed
- Root layout now wraps app with ClientLayout
- Added user menu to BottomNav
- UploadModal includes user_id in photo records

### Added Dependencies
- @supabase/ssr for session management in middleware
- @supabase/auth-helpers-nextjs (deprecated, replaced with @supabase/ssr)

### Technical
- Cookie-based session management
- Server-side session validation in middleware
- Client-side auth state with React Context
- Automatic redirects based on auth state
- Email/password authentication
- Session persistence across page loads

### Known Issues
- Email verification not yet enforced (users can sign in immediately)
- Password reset flow not implemented
- No social auth providers yet
- RLS policies need to be applied in Supabase Dashboard
- Existing data needs user_id migration (see SQL script comments)

### User Actions Required
1. **Run RLS SQL script** in Supabase SQL Editor:
   - Execute `scripts/setup-auth-rls.sql`
   - This enables RLS and creates policies
2. **Migrate existing data**:
   - Update existing records with user_id
   - See SQL script comments for instructions
3. **Test authentication**:
   - Create a new user account
   - Verify login/logout works
   - Check protected routes redirect

## [0.6.0] - 2025-11-13

### Added - Photo Upload Functionality 📤

Complete photo upload system with drag & drop, EXIF extraction, and Supabase Storage integration.

**Floating Upload Button:**
- **FloatingUploadButton component** (`components/FloatingUploadButton.tsx`)
  - Fixed position: bottom-right (bottom-24 right-8)
  - Lavender glow effect with accent color
  - Plus icon with hover scale animation
  - Opens upload modal on click
  - Appears on all pages via MainLayout

**Upload Modal:**
- **UploadModal component** (`components/UploadModal.tsx`)
  - Drag & drop zone with visual feedback
  - Click to browse file selection
  - Multiple file selection support
  - Image preview grid before upload
  - Site/Project selection dropdowns
  - Upload progress indicator with percentage
  - Success/error states with messages

**Drag & Drop Features:**
- Visual feedback when dragging (border color change)
- Only accepts image files
  - Preview thumbnails in 2-4 column grid
  - Remove individual files before upload
  - GPS indicator badge on photos with EXIF data

**EXIF Data Extraction:**
- Installed `exifr` library for EXIF parsing
  - Extracts GPS coordinates (latitude/longitude)
  - Extracts DateTimeOriginal
  - Shows MapPin icon on photos with GPS data
  - Automatically includes coordinates in upload

**Upload Logic:**
- Uploads to Supabase Storage 'photos' bucket
  - Generates unique filename: `${timestamp}-${original-name}`
  - Creates database record with file_name, site_id, project_id
  - Includes GPS coordinates from EXIF if available
  - Progress tracking for multiple uploads
  - Automatic page refresh on success

**Glass Aesthetic Styling:**
- Dark modal background: rgba(0, 0, 0, 0.95) with blur
  - Glass-card container
  - Lavender accent for active states
  - Smooth animations and transitions
  - Minimal borders and hover effects
  - Upload progress bar with gradient

**Validation:**
- Requires either site or project selection
- Error message if neither selected
- Graceful error handling with user feedback
- Disabled upload button when invalid

### Changed
- MainLayout now includes FloatingUploadButton
- Added exifr dependency to package.json

### Technical
- Multi-file upload with Promise.all
- URL.createObjectURL for image previews
- Cleanup of preview URLs on unmount
- Escape key to close modal
- Body scroll lock when modal open
- TypeScript typed for Site and Project

### Known Issues
- Reverse geocoding not yet implemented (addresses from GPS)
- Page reloads after upload (will add optimistic updates later)
- Supabase Storage bucket needs public access configuration

## [0.5.0] - 2025-11-13

### Added - Fixed Photo Display and Image Loading 📸

Complete photo loading system with proper Supabase Storage integration, loading states, and error handling.

**Photo Loading Infrastructure:**
- **`getPhotoUrl()` utility function** in `lib/supabase.ts`
  - Uses Supabase Storage API to get public URLs
  - Centralized image URL generation
  - Properly configured for 'photos' bucket

- **PhotoImage component** (`components/PhotoImage.tsx`)
  - Reusable component for all photo displays
  - Loading state with shimmer animation
  - Graceful error handling with fallback UI
  - Smooth fade-in on load
  - Supports all Next.js Image props

**Loading States:**
- Shimmer animation while images load
  - Smooth gradient animation (1.5s infinite)
  - Dark gray shimmer effect (#1a1a1a to #2a2a2a)
  - Applied to all photo displays

- Error state fallback
  - Shows "Image unavailable" with icon
  - Clean minimal design
  - No broken images displayed

**Component Updates:**
- **PhotoGrid**: Now uses PhotoImage component
  - All photos have loading states
  - Graceful error handling in grid
  - Masonry layout preserved

- **PhotoModal**: Updated to use PhotoImage
  - Loading shimmer for large photos
  - Updated to minimal glass aesthetic
  - Dark modal background with blur
  - Glass-card metadata panel
  - All text in white/gray with proper hierarchy

**Styling Improvements:**
- Added `@keyframes shimmer` animation to globals.css
- `.photo-skeleton` utility class
- PhotoModal now matches minimal glass design
- Consistent typography across modal

### Changed
- PhotoModal styling updated to match v0.4.x aesthetic
  - Dark background: rgba(0, 0, 0, 0.95) with blur
  - Glass-card for metadata panel
  - White text with proper hierarchy
  - Minimal close button with glass effect

### Fixed
- Photo loading from Supabase Storage (previously hardcoded URLs)
- Missing loading states for images
- No error handling for failed image loads
- PhotoModal white background (now dark glass)

### Technical
- Created reusable PhotoImage component pattern
- Centralized URL generation via getPhotoUrl()
- Next.js Image optimization preserved
- Smooth transitions and animations
- Error boundaries for image loading

### Known Issues
- Supabase Storage bucket may need public access configuration
- Photos currently showing 400 errors (storage bucket config needed)
- Error state UI displays gracefully while storage is configured

## [0.4.2] - 2025-11-13

### Changed - Enhanced Navigation Bar Visibility 🎯

Improved bottom navigation bar to be more substantial and premium while maintaining modern aesthetic.

**Bottom Navigation Enhancements:**
- **Much more opaque background**: Changed from 2% white to `rgba(20, 20, 20, 0.85)` for better visibility
- **Pill-shaped design**: Border-radius of 30px with fit-content width for premium look
- **Better depth**: Added top border highlight and shadow (`0 -10px 40px rgba(0, 0, 0, 0.5)`)
- **Improved padding**: Increased to `px-10 py-3` for more substantial presence
- **Better spacing**: Increased gap between items from `gap-1` to `gap-2`

**Active State Improvements:**
- Active icons now bright white (`text-white`) instead of lavender-tinted
- Inactive icons at 50% opacity (`text-white/50`)
- Hover state at 75% opacity (`text-white/75`)
- Added small lavender dot indicator under active item
- Enhanced glow effect for active icon (more visible at 60% opacity)

**Tooltip Updates:**
- Tooltips now match nav background: `rgba(20, 20, 20, 0.9)`
- Stronger border: `rgba(255, 255, 255, 0.1)`
- Active tooltips show in white instead of lavender

### Fixed
- Bottom nav no longer feels disconnected or too transparent
- Navigation bar is clearly visible while still floating above content
- Active states are more obvious and premium-feeling

## [0.4.1] - 2025-11-13

### Changed - Design Refinements ✨

Refined the minimal glass aesthetic with improved layouts, micro-interactions, and visual polish.

**Bottom Navigation Refinements:**
- Made ultra-thin and minimal (60px max height)
- Reduced glass opacity to barely visible (2% white)
- Smaller icons (h-4 w-4)
- Labels only show on hover (not always visible)
- Changed to fully rounded (rounded-full)
- Positioned 20px from bottom with proper spacing
- Improved active state glow

**Photo Grid Redesign:**
- Implemented masonry layout using CSS columns for visual interest
- Added gradient overlay at bottom of each photo (black/80 to transparent)
- Location text now overlays ON the image (not below)
- Varying aspect ratios for photos (square, 4:5, 3:4, 5:4)
- Hover effects: scale(1.02) + brightness(1.1)
- Minimal glass border (rgba 5%)
- Break-inside-avoid for proper masonry flow

**Typography Hierarchy:**
- Fixed secondary text brightness - changed to #666 (darker gray)
- Headers have more breathing room
- Better contrast between primary and secondary text
- Improved readability across all components

**Sites/Projects Cards:**
- Redesigned with horizontal layout (not vertical)
- Minimal text-only approach with inline badges
- Photo count in subtle rounded badge
- Status badges inline with project name
- All secondary text uses #666 for consistency
- Cleaner hover states

**Dashboard Personality:**
- Changed from boring row to dynamic layout
- Hero stat: Photos displayed large (text-7xl via StatCard)
- Secondary stats in 2x3 grid (text-5xl)
- Staggered fade-in animations (delay-1, delay-2, delay-3)
- More visual hierarchy and breathing room
- Stats feel less generic, more unique

**Micro-interactions:**
- All links/buttons: subtle hover translateY(-1px)
- Page transitions with fadeIn animation
- Image hover: scale(1.02) + brightness(1.1)
- Glass cards: hover translateY(-4px) scale(1.01)
- Smooth transitions: 0.4-0.6s cubic-bezier
- Everything feels responsive and fluid

**Admin Panel:**
- Removed "construction" references (changed to "sites, locations")
- Updated styling to match minimal glass aesthetic
- Changed from white cards to glass-card components
- Updated text colors (#666 for secondary)
- Title shortened to "Admin" (from "Admin Panel")
- Buttons use glass-card with lavender hover

### Technical
- CSS columns for masonry layout (no libraries needed)
- Gradient overlays with Tailwind utilities
- Inline styles for ultra-minimal glass (2% white)
- Varying aspect ratios for visual interest
- Staggered animation delays for personality
- All hover states use consistent timing functions

## [0.4.0] - 2025-11-08

### Changed - Complete Rebrand with Minimal Glass Aesthetic 🎨

Complete rebrand moving away from traditional dashboard design to a unique, minimal aesthetic.

**Design Philosophy:**
- Minimal glass effects (3-7% white opacity)
- Monochromatic base (pure black #000 to charcoal #171717)
- ONE accent color only (Lavender #e9d5ff)
- Extreme typography hierarchy (64px+ headers)
- Lots of white space
- No traditional sidebar

**Navigation Reimagined:**
- **Removed traditional sidebar** - Replaced with floating bottom navigation bar
- Modern app-style navigation with icon + label
- Active states with subtle lavender glow
- Centered, floating glass bar at bottom
- Clean, unobstructed content area

**Design System Updates:**
- Pure black background (#000) with vignette
- Minimal glass: `rgba(255, 255, 255, 0.03)` with 20px blur
- Large border radius: 24px
- Soft, deep shadows instead of borders
- Lavender accent (#e9d5ff) for all interactive states
- Removed all cyan/teal/blue - single accent only

**Component Redesigns:**
- **StatCard**: No containers - just large numbers (text-7xl), minimal labels
- **SiteCard**: Minimal glass cards, text-2xl headers, subtle hover
- **ProjectCard**: Clean layout, lavender accent badges
- **EmptyState**: Centered, minimal icons, large text
- **MainLayout**: No sidebar, full-width content, 64px headers

**Typography:**
- Headers: 64px+ bold, pure white
- Body: 14px, white/40 opacity
- Labels: 12px uppercase, wide tracking
- System font: -apple-system, SF Pro Display
- Huge size contrasts for hierarchy

**Branding:**
- Title changed from "Picxie Web - Construction Photo Management" to "Picxie - Photo Management"
- Removed construction-specific language
- Clean, modern positioning

**Interaction:**
- Slower transitions: 0.4-0.6s
- Deeper hover lifts: -4px translateY
- Subtle color shifts to lavender on hover
- No harsh state changes

### Removed
- Traditional sidebar navigation
- Cyan/teal accent colors
- Glass-medium component variant
- Gradient backgrounds
- Status color variety (now minimal)

### Technical
- Bottom navigation component with active state tracking
- Updated CSS variables for minimal palette
- Vignette effect instead of gradient
- All icons now white with opacity
- Maintained responsive design

**Design Inspiration:** Figma × Are.na × Cosmos - Minimal, sophisticated, unique.

## [0.3.0] - 2025-11-08

### Changed - Liquid Glass UI Redesign 🎨

Complete visual overhaul with premium glassmorphism design system.

**Design System:**
- Implemented liquid glass aesthetic with frosted glass effects
- Added backdrop-filter blur effects throughout
- New dark theme: background (#0a0a0a), elevated (#111111)
- Accent color: Cyan/Teal (#06b6d4) with subtle glows
- Custom CSS utilities for glass effects (.glass, .glass-medium, .glass-card)
- Smooth animations with cubic-bezier easing
- Fade-in animations for page elements

**Component Redesigns:**
- **Sidebar**: Frosted glass background, smooth hover states, active indicator with cyan glow
- **StatCard**: Glass-morphism cards with icon hover animations and scale effects
- **SiteCard**: Glass cards with smooth lift animation, cyan accent on hover
- **ProjectCard**: Glass effects with status badges, icon animations
- **EmptyState**: Glass circular icons, updated typography
- **MainLayout**: Dark background with subtle radial gradient overlay

**Page Updates:**
- **Dashboard**: Staggered fade-in animations for stat cards, updated warning styles
- **Typography**: Improved spacing, better contrast, tracking adjustments
- **Colors**: Status colors with glass backgrounds (success, warning, danger)

**CSS Additions:**
- `.transition-smooth` - 0.3s cubic-bezier transitions
- `.active-state` - Active navigation state with glow
- `.accent-glow` / `.accent-glow-sm` - Cyan glow effects
- Animation keyframes for fade-in with delays
- Body gradient overlay for depth

**Visual Improvements:**
- Consistent 2xl border radius (rounded-2xl) for modern look
- Icon hover animations (scale, color transitions)
- Status badges with glass backgrounds
- Improved readability with better text colors
- Subtle depth with layered glass effects

### Technical Details
- All transitions use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth motion
- Backdrop-filter with -webkit prefix for Safari support
- CSS variables for consistent glass effects across components
- Maintained responsive design across all breakpoints

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

[unreleased]: https://github.com/yourusername/picxie-web/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/yourusername/picxie-web/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/yourusername/picxie-web/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/yourusername/picxie-web/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/yourusername/picxie-web/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/yourusername/picxie-web/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/yourusername/picxie-web/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/yourusername/picxie-web/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/yourusername/picxie-web/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/yourusername/picxie-web/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/yourusername/picxie-web/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/yourusername/picxie-web/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/yourusername/picxie-web/releases/tag/v0.1.0
