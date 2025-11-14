# Quick Fix Guide - App Showing 0 Sites/Projects

## Problem Diagnosed ✅

Your web app shows **0 sites** and **0 projects** even though 6+ records exist in the database.

**Root Cause:** Supabase Row Level Security (RLS) policies are blocking the web app from reading the `sites` and `projects` tables.

---

## Solution (5 minutes)

### Step 1: Apply RLS Policies

1. Open Supabase SQL Editor:
   - Go to: https://app.supabase.com/project/ampxyzotiiqmwcwsdfut
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

2. Copy the SQL script:
   - Open `scripts/setup-rls-policies.sql` in your code editor
   - Copy the **entire file** (Cmd/Ctrl + A, Cmd/Ctrl + C)

3. Paste and run:
   - Paste into Supabase SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

4. Verify policies created:
   - Scroll to bottom of results
   - You should see a table showing policies for sites, projects, photos, user_profiles

### Step 2: Clean Up Duplicate Data (Optional)

If you ran SQL scripts multiple times and have duplicates:

1. In Supabase SQL Editor, click **New Query**

2. Copy and run `scripts/cleanup-duplicates.sql`:
   - This will merge duplicates and keep only unique sites/projects
   - Shows before/after data for verification

### Step 3: Test the Fix

1. Go back to your web app: http://localhost:3000

2. **Refresh the page** (Cmd/Ctrl + R)

3. You should now see:
   - Dashboard: 6 sites, 6 projects (or 2 each after cleanup)
   - Sites page: List of all sites
   - Projects page: List of all projects
   - Photos properly linked to their sites

### Step 4: Link Photos to Projects (If Needed)

If photos show NULL project_id:

```bash
npx tsx scripts/fix-data.ts
```

This will automatically link photos to their site's active project.

---

## Quick Verification

Run this to check current state:

```bash
npx tsx scripts/check-db.ts
```

**Before RLS fix:** Shows 0 sites, 0 projects
**After RLS fix:** Shows 6 sites, 6 projects (or 2 each if cleaned up)

---

## What Changed in v0.2.1

**Files Created:**
- `scripts/setup-rls-policies.sql` - RLS policy setup
- `scripts/cleanup-duplicates.sql` - Duplicate data cleanup
- `scripts/detailed-check.ts` - Diagnostic tool
- `scripts/README.md` - Scripts documentation
- `QUICK_FIX_GUIDE.md` - This file

**Files Updated:**
- `SUPABASE_RLS_SETUP.md` - Added diagnosis and clear fix steps
- `README.md` - Added CRITICAL warning about RLS setup
- `CHANGELOG.md` - Added v0.2.1 entry with full diagnosis

---

## Still Having Issues?

1. **Check RLS is actually applied:**
   ```bash
   npx tsx scripts/detailed-check.ts
   ```
   - Should show data in `Sites data:` and `Projects data:`
   - If still showing `[]`, RLS policies didn't apply

2. **Check you ran the correct SQL:**
   - Make sure you copied `setup-rls-policies.sql` (not another script)
   - Verify no errors in SQL Editor output

3. **Try disabling RLS entirely (development only):**
   - Supabase Dashboard → Table Editor
   - Click on `sites` table → RLS tab → Disable RLS
   - Repeat for `projects` table
   - Refresh web app

4. **Review diagnostics:**
   - See [SUPABASE_RLS_SETUP.md](./SUPABASE_RLS_SETUP.md) for detailed troubleshooting
   - See [scripts/README.md](./scripts/README.md) for script usage

---

## Next Steps After Fix

1. **Commit the changes:**
   ```bash
   git add .
   git commit -m "docs: add RLS diagnosis and fix scripts (v0.2.1)"
   git push origin main
   ```

2. **Continue development:**
   - App should now display data correctly
   - All diagnostic tools are available in `scripts/`
   - Refer to `DEVELOPMENT_PRIORITIES.md` for next features

---

**Need Help?** Review:
- [SUPABASE_RLS_SETUP.md](./SUPABASE_RLS_SETUP.md) - Full RLS documentation
- [scripts/README.md](./scripts/README.md) - All available scripts
- [CHANGELOG.md](./CHANGELOG.md) - What changed in v0.2.1
