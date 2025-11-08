# Data Discrepancy Analysis

## Issue Summary

The Picxie web application is showing inconsistent data between the dashboard statistics and the actual photo records:

### Observed Behavior
- ✅ **Photos**: 1 photo found (displaying correctly)
- ❌ **Sites**: 0 total sites (should be at least 1)
- ❌ **Projects**: 0 total projects (status unclear)
- ✅ **Photo Address**: "17950, SW 143rd Ct, Miami, FL, 33177" (visible in photo data)

### Expected Behavior
Since there is 1 photo with:
- A valid address in Miami, FL
- GPS coordinates (latitude/longitude)
- A `site_id` foreign key reference
- Possibly a `project_id` foreign key reference

We should see:
- At least 1 site in the sites table
- Possibly 1 project in the projects table

## Root Cause Analysis

### Hypothesis 1: Missing Site Records (Most Likely)
**Cause**: The `sites` table is empty or the photo's `site_id` points to a non-existent site.

**Evidence**:
- Dashboard shows "0" sites
- Sites page shows "No sites yet"
- Photo has `site_id` but no matching record in `sites` table

**Database Query Check**:
```sql
-- Check if sites table is empty
SELECT COUNT(*) FROM sites;

-- Check photo's site_id reference
SELECT site_id FROM photos WHERE id = '<photo-id>';

-- Check if the site exists
SELECT * FROM sites WHERE id = '<site_id-from-photo>';
```

**Resolution**:
1. Query the actual photo record to get its `site_id`
2. Check if that site exists in the `sites` table
3. If missing, create the site record
4. If orphaned reference, either create site or update photo

### Hypothesis 2: Missing Project Records
**Cause**: The `projects` table is empty or the photo's `project_id` is null/invalid.

**Evidence**:
- Dashboard shows "0 active, 0 completed" projects
- Projects page shows "No active projects" and "No completed projects"

**Database Query Check**:
```sql
-- Check if projects table is empty
SELECT COUNT(*) FROM projects;

-- Check photo's project_id reference
SELECT project_id FROM photos WHERE id = '<photo-id>';

-- If project_id is not null, check if project exists
SELECT * FROM projects WHERE id = '<project_id-from-photo>';
```

**Resolution**:
1. Determine if photo should belong to a project
2. If yes, create project record linked to site
3. Update photo's `project_id` if needed
4. If no project needed, `project_id` can remain null

### Hypothesis 3: Data Migration Issue
**Cause**: Photos were uploaded from mobile app before sites/projects were created in the database.

**Evidence**:
- Mobile app created photo record first
- Site/project creation workflow not completed
- Orphaned photo references

**Resolution**:
1. Implement data integrity checks
2. Add foreign key constraints with proper handling
3. Create missing parent records (sites/projects)
4. Add validation in mobile app upload flow

### Hypothesis 4: Row Level Security (RLS) Policies
**Cause**: Supabase RLS policies preventing web app from reading sites/projects.

**Evidence**:
- Photos visible (no RLS on photos table)
- Sites/projects not visible (RLS blocking reads)

**Database Query Check**:
```sql
-- Check RLS policies on sites table
SELECT * FROM pg_policies WHERE tablename = 'sites';

-- Check RLS policies on projects table
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Check if RLS is enabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname IN ('sites', 'projects', 'photos');
```

**Resolution**:
1. Review RLS policies in Supabase dashboard
2. Add policies to allow reads for anonymous/authenticated users
3. Test queries with web app credentials

### Hypothesis 5: Foreign Key References Not Set
**Cause**: Photo record has `site_id = null` instead of valid UUID.

**Database Query Check**:
```sql
-- Check photo's foreign key values
SELECT
  id,
  file_name,
  site_id,
  project_id,
  address,
  captured_at
FROM photos
WHERE file_name = 'E2404EE0-2B21-4CE1-8879-93B80EF1FF45.jpg';
```

**Resolution**:
1. If `site_id` is null, create site from photo's GPS/address data
2. Update photo record with new `site_id`
3. Consider creating project and linking photo

## Recommended Diagnostic Steps

### Step 1: Query Photo Data
```typescript
const { data: photos } = await supabase
  .from('photos')
  .select('*')
  .limit(10);

console.log('Photos:', photos);
```

### Step 2: Query Sites Data
```typescript
const { data: sites } = await supabase
  .from('sites')
  .select('*');

console.log('Sites count:', sites?.length || 0);
console.log('Sites:', sites);
```

### Step 3: Query Projects Data
```typescript
const { data: projects } = await supabase
  .from('projects')
  .select('*');

console.log('Projects count:', projects?.length || 0);
console.log('Projects:', projects);
```

### Step 4: Check Foreign Key Integrity
```typescript
// Get photo's site_id
const { data: photo } = await supabase
  .from('photos')
  .select('site_id, project_id')
  .limit(1)
  .single();

if (photo?.site_id) {
  // Check if site exists
  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('id', photo.site_id)
    .single();

  console.log('Site exists:', !!site);
}
```

### Step 5: Verify RLS Policies
```sql
-- In Supabase SQL Editor
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('sites', 'projects', 'photos');
```

## Immediate Action Items

### For Development
1. **Add Debug Logging**
   - Log all Supabase query responses
   - Check for errors in query results
   - Verify data structure matches schema

2. **Create Debug Page**
   - Add `/debug` route to inspect raw data
   - Display all photos, sites, projects
   - Show foreign key relationships
   - Display any query errors

3. **Add Error Handling**
   - Wrap all Supabase queries in try-catch
   - Display error messages to user
   - Log errors to console

### For Data Integrity
1. **Create Missing Site**
   ```sql
   -- If site doesn't exist, create it from photo data
   INSERT INTO sites (name, latitude, longitude, radius_meters, folder_name)
   VALUES (
     'Miami Construction Site',
     25.6166,  -- from photo latitude
     -80.4352, -- from photo longitude
     100,      -- default radius
     'miami_site_001'
   )
   RETURNING id;
   ```

2. **Update Photo Reference**
   ```sql
   -- Link photo to newly created site
   UPDATE photos
   SET site_id = '<new-site-id>'
   WHERE id = '<photo-id>';
   ```

3. **Create Project (Optional)**
   ```sql
   -- Create project for the site
   INSERT INTO projects (name, site_id, status)
   VALUES (
     'Miami Project - Nov 2025',
     '<site-id>',
     'Active'
   )
   RETURNING id;
   ```

## Long-term Solutions

### 1. Data Validation
- Add database constraints (NOT NULL for required FKs)
- Implement server-side validation
- Add client-side validation in forms

### 2. Migration Scripts
- Create script to find orphaned photos
- Auto-generate sites from photo GPS data
- Link photos to appropriate sites/projects

### 3. Mobile App Coordination
- Ensure mobile app creates sites before photos
- Implement proper upload workflow
- Add offline sync reconciliation

### 4. Monitoring
- Set up Supabase realtime subscriptions
- Add data integrity checks
- Alert on missing foreign key references

## Expected Resolution

Once the data integrity is fixed:
- **Dashboard**: Should show accurate counts
- **Sites Page**: Should display at least 1 site (Miami location)
- **Projects Page**: Should show projects if any exist
- **Photo Library**: Should allow filtering by site/project
- **Site Detail**: Should display the Miami site with map and photos

## Testing After Fix

1. Navigate to Dashboard - verify counts are accurate
2. Click "Sites" - should see Miami site
3. Click on site - should see map with marker
4. View photos under site - should see the uploaded photo
5. Test filtering in photo library - should work correctly
