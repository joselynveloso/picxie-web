# Picxie Web - Codebase Structure

## Overview
Picxie Web is a construction photo management system built with Next.js 16 (App Router) and Supabase, designed to work alongside an existing React Native mobile application.

## Tech Stack

### Core Framework
- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- Custom monochrome theme (white, grays, black only)

### Backend & Data
- **Supabase** - PostgreSQL database + Storage
  - URL: `https://ampxyzotiiqmwcwsdfut.supabase.co`
  - Shares database with mobile React Native app
  - Tables: sites, projects, photos, user_profiles

### Maps & Icons
- **Leaflet** + **react-leaflet** - Interactive maps
- **lucide-react** - Icon library

### Fonts
- **Geist Sans** - Primary font
- **Geist Mono** - Monospace font

## Project Structure

```
picxie-web/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with fonts & metadata
│   ├── page.tsx                 # Dashboard (/)
│   ├── globals.css              # Global styles & theme
│   ├── photos/
│   │   └── page.tsx            # Photo library (/photos)
│   ├── sites/
│   │   ├── page.tsx            # Sites list (/sites)
│   │   └── [id]/
│   │       └── page.tsx        # Site detail (/sites/:id)
│   ├── projects/
│   │   ├── page.tsx            # Projects list (/projects)
│   │   └── [id]/
│   │       └── page.tsx        # Project detail (/projects/:id)
│   └── admin/
│       └── page.tsx            # Admin panel (/admin)
│
├── components/                   # Reusable React components
│   ├── Sidebar.tsx              # Navigation sidebar (client)
│   ├── MainLayout.tsx           # Page layout wrapper
│   ├── PhotoGrid.tsx            # Photo grid display (client)
│   ├── PhotoModal.tsx           # Full-screen photo viewer (client)
│   ├── StatCard.tsx             # Statistics card
│   ├── SiteCard.tsx             # Site display card
│   ├── ProjectCard.tsx          # Project display card
│   ├── MapView.tsx              # Leaflet map component (client)
│   ├── LoadingSpinner.tsx       # Loading indicator
│   └── EmptyState.tsx           # Empty state placeholder
│
├── lib/
│   └── supabase.ts              # Supabase client singleton
│
├── types/
│   └── database.ts              # TypeScript type definitions
│
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration (v4 inline)
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies & scripts
└── CHANGELOG.md                 # Version history
```

## Data Flow Architecture

### Server Components (Default)
Most pages are Server Components that fetch data directly from Supabase:
- `app/page.tsx` - Dashboard stats
- `app/sites/page.tsx` - Sites list
- `app/sites/[id]/page.tsx` - Site details
- `app/projects/[id]/page.tsx` - Project details
- `app/admin/page.tsx` - Admin stats

**Advantages:**
- Faster initial page load
- SEO-friendly
- Reduced client-side JavaScript

### Client Components ('use client')
Components requiring interactivity are Client Components:
- `components/Sidebar.tsx` - Mobile menu state
- `components/PhotoGrid.tsx` - Photo modal state
- `components/PhotoModal.tsx` - Keyboard events, overlay
- `components/MapView.tsx` - Leaflet (browser-only)
- `app/photos/page.tsx` - Filter dropdowns state
- `app/projects/page.tsx` - Tab switching state

## Database Schema

### Sites Table
```typescript
{
  id: string (uuid)
  name: string
  latitude: number
  longitude: number
  radius_meters: number
  folder_name: string (unique)
  created_at: timestamp
}
```

### Projects Table
```typescript
{
  id: string (uuid)
  name: string
  site_id: string (FK → sites)
  status: 'Active' | 'Completed'
  created_at: timestamp
  completed_at: timestamp | null
}
```

### Photos Table
```typescript
{
  id: string (uuid)
  file_name: string
  site_id: string (FK → sites)
  project_id: string | null (FK → projects)
  latitude: number
  longitude: number
  address: string
  captured_at: timestamp
  uploaded_at: timestamp
  local_uri: string | null
}
```

### User Profiles Table
```typescript
{
  id: string (uuid, FK → auth.users)
  display_name: string
  email: string
  is_admin: boolean
  created_at: timestamp
}
```

## Routing Structure

### Public Routes (No Auth - Currently)
- `/` - Dashboard
- `/photos` - Photo library
- `/sites` - Sites list
- `/sites/[id]` - Site detail
- `/projects` - Projects list
- `/projects/[id]` - Project detail
- `/admin` - Admin panel

### API Routes
**None currently** - All data fetching is done via Supabase client directly in components

## Data Management Approach

### Current Implementation
- **Direct Supabase Queries** in Server/Client Components
- No intermediate API layer
- No caching strategy (relies on Next.js built-in caching)
- No state management library (React state only)

### Photo Storage
- Photos stored in Supabase Storage bucket: `photos/`
- URL pattern: `https://ampxyzotiiqmwcwsdfut.supabase.co/storage/v1/object/public/photos/{file_name}`
- Image optimization via Next.js `<Image>` component

### Data Fetching Patterns

**Server Component (Async/Await):**
```typescript
async function getData() {
  const { data } = await supabase.from('table').select('*');
  return data;
}

export default async function Page() {
  const data = await getData();
  return <div>{/* render */}</div>;
}
```

**Client Component (useEffect):**
```typescript
'use client';

export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('table').select('*');
      setData(data);
    }
    fetchData();
  }, []);

  return <div>{/* render */}</div>;
}
```

## Current Limitations & Issues

### Known Data Discrepancies
1. **Sites count showing 0** - Despite photos having `site_id` references
2. **Projects count showing 0** - Despite `project_id` associations potentially existing
3. **Photo shows but related entities don't** - Suggests data integrity issues or missing records

### Missing Features
- ❌ Authentication (no login/logout)
- ❌ Authorization (no role-based access)
- ❌ CRUD operations (create, update, delete)
- ❌ Photo upload from web
- ❌ Form validation
- ❌ Error handling & boundaries
- ❌ Loading states (partial)
- ❌ Optimistic UI updates
- ❌ Real-time subscriptions
- ❌ Search functionality
- ❌ Pagination
- ❌ Export/import features

### Security Concerns
- Supabase credentials hardcoded in `lib/supabase.ts` (should use env vars)
- No Row Level Security (RLS) policies mentioned
- No authentication checks
- Admin panel accessible to anyone

## Configuration Files

### `next.config.ts`
- Remote image patterns for Supabase storage
- No custom webpack config
- No environment variable configuration

### `tailwind.config.ts`
- Tailwind CSS v4 uses inline `@theme` in `globals.css`
- No separate config file needed

### `tsconfig.json`
- Standard Next.js TypeScript configuration
- Path aliases: `@/*` → project root

### `package.json` - Key Scripts
```json
{
  "dev": "next dev",      // Development server
  "build": "next build",  // Production build
  "start": "next start",  // Production server
  "lint": "eslint"        // Linting
}
```

## Design System

### Color Palette (Monochrome)
```css
--color-white: #ffffff
--color-gray-50: #fafafa
--color-gray-100: #f5f5f5
--color-gray-200: #e5e5e5
--color-gray-300: #d4d4d4
--color-gray-400: #a3a3a3
--color-gray-500: #737373
--color-gray-600: #525252
--color-gray-700: #404040
--color-gray-800: #262626
--color-gray-900: #171717
--color-black: #000000

/* Accent colors (minimal use) */
--color-green-500: #22c55e  // Active status
--color-green-600: #16a34a
--color-red-500: #ef4444    // Delete actions
--color-red-600: #dc2626
```

### Component Patterns
- Flat design (no shadows)
- No gradients
- Border-based separation (`border-gray-200`)
- Hover states: border color change or background
- Transitions: `transition-colors duration-150/200`

## Development Workflow

### Local Development
```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Test production build
npm run lint       # Check code quality
```

### Build Process
- Next.js Turbopack for fast builds
- Server/Client component automatic code splitting
- Image optimization enabled
- Static generation where possible

## Deployment Considerations

### Environment Variables Needed
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ampxyzotiiqmwcwsdfut.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### Recommended Platform
- **Vercel** (recommended for Next.js)
- Auto-deploy from Git
- Edge network CDN
- Serverless functions for API routes

### Pre-deployment Checklist
- [ ] Move Supabase credentials to environment variables
- [ ] Enable Row Level Security on Supabase tables
- [ ] Implement authentication
- [ ] Add error boundaries
- [ ] Test all routes in production build
- [ ] Configure custom domain
- [ ] Set up monitoring/analytics

## Next Steps & Priorities

See `DEVELOPMENT_PRIORITIES.md` for detailed roadmap.
