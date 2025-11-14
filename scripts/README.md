# Picxie Web - Utility Scripts

This directory contains utility scripts for database management, diagnostics, and maintenance.

## TypeScript Scripts

### `check-db.ts`
**Purpose:** Quick database health check
**Usage:** `npx tsx scripts/check-db.ts`

Displays:
- Count of sites, projects, and photos
- Details of all photos with their site/project associations

**When to use:**
- After making database changes
- To verify data integrity
- To check if RLS is working correctly

---

### `detailed-check.ts`
**Purpose:** In-depth RLS and query diagnostics
**Usage:** `npx tsx scripts/detailed-check.ts`

Performs detailed checks:
- Tests both `select *` and `count` queries
- Checks for RLS errors vs. empty results
- Attempts to fetch sites by IDs from photos
- Shows detailed error messages

**When to use:**
- Debugging why data doesn't appear in the app
- Investigating RLS policy issues
- Troubleshooting Supabase query problems

---

### `fix-data.ts`
**Purpose:** Automatically fix missing site/project relationships
**Usage:** `npx tsx scripts/fix-data.ts`

**⚠️ Requires:** RLS policies must allow INSERT/UPDATE operations

What it does:
1. Groups photos by address
2. Creates sites for each unique location
3. Creates a "Default Project" for each site
4. Links all photos to their sites and projects

**When to use:**
- After photos are uploaded without site associations
- When setting up the database for the first time
- When migrating data from another system

**Note:** If this fails with RLS errors, configure RLS first (see `SUPABASE_RLS_SETUP.md`)

---

## SQL Scripts

### `setup-rls-policies.sql`
**Purpose:** Configure Row Level Security policies for the web app
**Usage:** Run in Supabase SQL Editor

**CRITICAL:** Run this first if the app shows 0 sites/projects but data exists!

What it does:
1. Checks current RLS status
2. Creates read policies for all tables (sites, projects, photos, user_profiles)
3. Optionally creates write policies (commented out)
4. Verifies policies were created successfully

**Steps:**
1. Copy the file contents
2. Go to Supabase Dashboard → SQL Editor
3. Create new query
4. Paste and run
5. Verify output shows policies created

---

### `cleanup-duplicates.sql`
**Purpose:** Remove duplicate sites and projects
**Usage:** Run in Supabase SQL Editor

**When to use:**
- After accidentally running insert scripts multiple times
- When you have duplicate sites at the same coordinates
- When you have multiple projects for the same site

What it does:
1. Shows before state (sites, projects, photos)
2. Identifies duplicates by coordinates (sites) and site_id (projects)
3. Keeps the OLDEST record (by created_at)
4. Updates photos to reference the kept records
5. Deletes duplicate records
6. Links photos to projects if project_id is NULL
7. Shows after state and final counts

**Safety:**
- Shows before/after data for verification
- Uses proper foreign key updates before deletions
- Keeps oldest records (most likely to be referenced)

---

## Common Workflows

### Problem: App shows 0 sites/projects but data exists

```bash
# 1. Check database state
npx tsx scripts/check-db.ts

# 2. Run detailed diagnostics
npx tsx scripts/detailed-check.ts

# 3. If detailed-check shows empty arrays but no errors:
#    → RLS is blocking queries
#    → Run setup-rls-policies.sql in Supabase SQL Editor

# 4. Verify fix
npx tsx scripts/check-db.ts
```

### Problem: Duplicate sites and projects

```bash
# 1. Check current state
npx tsx scripts/check-db.ts

# 2. Run cleanup in Supabase SQL Editor
#    → Copy cleanup-duplicates.sql
#    → Paste in SQL Editor
#    → Run query

# 3. Verify cleanup worked
npx tsx scripts/check-db.ts
```

### Problem: Photos not linked to sites/projects

```bash
# 1. Ensure RLS allows writes (run setup-rls-policies.sql with write policies enabled)

# 2. Run fix script
npx tsx scripts/fix-data.ts

# 3. Verify photos are linked
npx tsx scripts/check-db.ts
```

---

## Script Execution Requirements

### TypeScript Scripts (`*.ts`)
- Require `tsx` package (automatically installed as dev dependency)
- Use the Supabase anon key (subject to RLS policies)
- Run from project root: `npx tsx scripts/script-name.ts`

### SQL Scripts (`*.sql`)
- Must be run in Supabase SQL Editor (not locally)
- Use the postgres role (full access, bypasses RLS)
- Located at: `https://app.supabase.com/project/YOUR_PROJECT/sql/new`

---

## Troubleshooting

### Error: "new row violates row-level security policy"
**Solution:** RLS is blocking write operations. Either:
- Run `setup-rls-policies.sql` with write policies enabled
- Temporarily disable RLS on the table
- Use Supabase service role key instead of anon key

### TypeScript scripts show 0 counts but SQL Editor shows data
**Solution:** RLS is blocking read operations. Run `setup-rls-policies.sql`

### "Cannot find module" errors
**Solution:** Install dependencies:
```bash
npm install
```

---

## Adding New Scripts

When creating new utility scripts:

1. **TypeScript scripts:**
   - Add to this directory
   - Import from `../lib/supabase`
   - Document purpose and usage here
   - Test with `npx tsx scripts/your-script.ts`

2. **SQL scripts:**
   - Add comments explaining what it does
   - Include before/after verification queries
   - Test in Supabase SQL Editor first
   - Document here with usage instructions

---

**Last Updated:** 2025-11-08 (v0.2.1)
