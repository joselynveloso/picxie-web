# Picxie Web

> Construction photo management system - Web interface

Picxie Web is a professional construction photo management platform built with Next.js and Supabase. It works alongside the existing React Native mobile app, sharing the same database for seamless photo documentation across devices.

## Features

- 📊 **Dashboard** - Real-time statistics and recent photos overview
- 📸 **Photo Library** - Browse, filter, and view photos with full metadata
- 📍 **Site Management** - Track construction sites with GPS and geofencing
- 📁 **Project Organization** - Manage active and completed projects
- 🗺️ **Interactive Maps** - Visualize site locations with Leaflet
- 👥 **Admin Panel** - Database statistics and management tools (coming soon)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Storage)
- **Maps**: [Leaflet](https://leafletjs.com/) with [react-leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase project (shared with mobile app)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd picxie-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the development server:
```bash
npm run dev
```

5. **⚠️ CRITICAL: Configure Supabase Row Level Security (RLS)**

Without this step, the app will show 0 sites and 0 projects even if data exists!

**Quick Fix (5 minutes):**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `scripts/setup-rls-policies.sql`
3. Paste and run the query
4. Verify policies are created

See [SUPABASE_RLS_SETUP.md](./SUPABASE_RLS_SETUP.md) for detailed instructions.

6. (Optional) Clean up duplicate data if needed:
```bash
# Run in Supabase SQL Editor
# See scripts/cleanup-duplicates.sql
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
picxie-web/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── photos/            # Photo library
│   ├── sites/             # Sites list & detail
│   ├── projects/          # Projects list & detail
│   └── admin/             # Admin panel
├── components/            # Reusable React components
├── lib/                   # Utilities (Supabase client)
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Database Schema

### Tables

- **sites** - Construction site locations with GPS and radius
- **projects** - Projects linked to sites (Active/Completed)
- **photos** - Photo metadata with GPS, address, timestamps
- **user_profiles** - User information and admin flags

For detailed schema, see [CODEBASE_STRUCTURE.md](./CODEBASE_STRUCTURE.md).

## Development

### Available Scripts

**Development:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Database Diagnostics:**
- `npx tsx scripts/check-db.ts` - Quick database health check (counts and photo details)
- `npx tsx scripts/detailed-check.ts` - In-depth RLS diagnostics (identifies blocking issues)
- `npx tsx scripts/fix-data.ts` - Auto-fix missing site/project relationships (requires RLS)

**SQL Scripts (run in Supabase SQL Editor):**
- `scripts/setup-rls-policies.sql` - Configure RLS policies to allow app access ⚠️ **RUN THIS FIRST**
- `scripts/cleanup-duplicates.sql` - Remove duplicate sites and projects

See [scripts/README.md](./scripts/README.md) for detailed usage instructions.

### Documentation

- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [CODEBASE_STRUCTURE.md](./CODEBASE_STRUCTURE.md) - Detailed architecture
- [DATA_ANALYSIS.md](./DATA_ANALYSIS.md) - Data integrity analysis
- [DEVELOPMENT_PRIORITIES.md](./DEVELOPMENT_PRIORITIES.md) - Roadmap
- [SUPABASE_RLS_SETUP.md](./SUPABASE_RLS_SETUP.md) - **⚠️ Database security configuration (READ THIS FIRST)**
- [scripts/README.md](./scripts/README.md) - Utility scripts documentation

## Design System

Picxie Web uses a **monochrome design** inspired by Apple's aesthetic:

- **Colors**: White, grays (50-900), black only
- **Accents**: Green (active status), Red (delete actions)
- **Style**: Flat design, no shadows, no gradients
- **Layout**: Clean, minimal, with generous whitespace

## Current Status (v0.1.0)

### ✅ Working
- Dashboard with stats and recent photos
- Photo library with filtering
- Sites list and detail pages with maps
- Projects list with Active/Completed tabs
- Responsive mobile/tablet/desktop layout

### ⚠️ Known Issues

**CRITICAL - RLS Not Configured (v0.2.1 diagnosed)**
- **Symptom:** App shows 0 sites and 0 projects even when data exists in database
- **Root Cause:** Supabase Row Level Security blocks reads on sites/projects tables
- **Fix:** Run `scripts/setup-rls-policies.sql` in Supabase SQL Editor
- **Details:** See [SUPABASE_RLS_SETUP.md](./SUPABASE_RLS_SETUP.md)

**Data Issues:**
- **Duplicate data** - Running SQL scripts multiple times creates duplicates
  - Use `scripts/cleanup-duplicates.sql` to merge duplicates
- **Missing relationships** - Photos may lack site/project associations
  - Use debug page (`/debug`) to inspect
  - Run `scripts/fix-data.ts` after RLS is configured

**Not Implemented:**
- Authentication and authorization
- CRUD operations (create/edit/delete UI)

### ❌ Not Implemented Yet
- Authentication & authorization
- Create/edit/delete sites, projects, photos
- Photo upload from web
- User management
- Search functionality
- Data export

See [DEVELOPMENT_PRIORITIES.md](./DEVELOPMENT_PRIORITIES.md) for roadmap.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

Vercel automatically detects Next.js and configures everything.

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- Railway
- Fly.io
- Self-hosted (Node.js server)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test thoroughly
3. Commit with descriptive message
4. Push and create a Pull Request

## License

[Your License Here]

## Related Projects

- **Picxie Mobile** - React Native mobile app (iOS/Android)

## Support

For issues or questions:
- Check [CODEBASE_STRUCTURE.md](./CODEBASE_STRUCTURE.md) for architecture details
- Review [DATA_ANALYSIS.md](./DATA_ANALYSIS.md) for troubleshooting
- Open an issue on GitHub

---

Built with ❤️ for construction teams
