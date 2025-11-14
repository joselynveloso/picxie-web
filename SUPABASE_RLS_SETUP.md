# Supabase Row Level Security (RLS) Setup

## ⚠️ CRITICAL ISSUE - RLS Blocking Read Access

**Diagnosis Complete:** RLS policies are blocking the web app from reading sites and projects data.

**Current Situation:**
- ✅ **Photos table**: RLS allows reads - app can see 2 photos
- ❌ **Sites table**: RLS blocks reads - app shows 0 sites (but 6+ exist in DB)
- ❌ **Projects table**: RLS blocks reads - app shows 0 projects (but 6+ exist in DB)
- ❌ **WRITE operations**: All blocked on all tables

**Evidence:**
- Database contains 6 sites and 6 projects (confirmed via SQL Editor)
- Photos have valid `site_id` foreign keys
- Web app queries return `[]` (empty array) with no error
- This is RLS silently filtering results, not a query problem

**Impact:**
- Dashboard shows 0 sites, 0 projects (incorrect)
- Sites page shows "No sites yet" (incorrect)
- Projects page shows "No projects" (incorrect)
- Photos page works but can't show site names
- Debug page shows 0 sites, 0 projects (incorrect)

## ✅ SOLUTION - Apply RLS Policies (5 minutes)

**Recommended Fix:** Run the provided SQL script to create proper read policies.

### Step-by-Step Instructions:

1. **Open Supabase SQL Editor**
   - Go to: https://app.supabase.com/project/ampxyzotiiqmwcwsdfut
   - Click **SQL Editor** in the left sidebar

2. **Run the RLS Setup Script**
   - Click **New Query**
   - Copy the contents of `scripts/setup-rls-policies.sql`
   - Paste into the SQL editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

3. **Verify It Worked**
   - You should see output showing the created policies
   - Run the verification query at the end to confirm

4. **Test the Web App**
   - Refresh your web app
   - Dashboard should now show 6 sites and 6 projects
   - Sites and Projects pages should list data

### Alternative: Disable RLS (Quick but less secure)

If you want to completely disable RLS for development:

1. Go to your Supabase Dashboard: https://app.supabase.com/project/ampxyzotiiqmwcwsdfut
2. Navigate to **Table Editor**
3. For each table (sites, projects, photos):
   - Click on the table
   - Go to the **RLS** tab (shield icon)
   - Click **Disable RLS**

⚠️ **Warning**: This makes your database publicly writable. Only do this for development/testing.

## Recommended Production Setup

For a production-ready setup, configure RLS policies that allow appropriate access:

### Option 1: Allow All for Development

```sql
-- Sites table
CREATE POLICY "Allow all operations" ON sites
FOR ALL USING (true);

-- Projects table
CREATE POLICY "Allow all operations" ON projects
FOR ALL USING (true);

-- Photos table
CREATE POLICY "Allow all operations" ON photos
FOR ALL USING (true);
```

### Option 2: Authenticated Users Only

If you plan to add authentication:

```sql
-- Sites table
CREATE POLICY "Authenticated users can read sites" ON sites
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert sites" ON sites
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sites" ON sites
FOR UPDATE USING (auth.role() = 'authenticated');

-- Repeat for projects and photos tables
```

### Option 3: Service Role for Admin

For admin operations (like the fix script), use the service role key:

1. Get your service role key from Supabase Dashboard → Settings → API
2. Create a separate admin Supabase client:

```typescript
// lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Server-side only!

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey
);
```

3. Update `.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

4. Use `supabaseAdmin` for admin operations in server components and API routes

## How to Apply SQL Policies

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Paste the SQL policy statements
4. Click **Run**

## Current Database State

As of this documentation:
- **Sites**: 0 records
- **Projects**: 0 records
- **Photos**: 2 records (both with NULL site_id and project_id)

Once RLS is configured, run the fix script to populate missing data:

```bash
npx tsx scripts/fix-data.ts
```

This will:
- Create sites for each unique photo address
- Create a default project for each site
- Link all photos to their respective sites and projects

## Testing the Fix

After configuring RLS:

1. Run the fix script: `npx tsx scripts/fix-data.ts`
2. Check database state: `npx tsx scripts/check-db.ts`
3. Visit the dashboard to verify counts are correct
4. Visit the debug page to inspect data details

## Mobile App Compatibility

The React Native mobile app shares this database. Ensure any RLS policies you create don't break the mobile app's functionality. Test both apps after making RLS changes.
