-- Picxie Web - Cleanup Duplicate Sites and Projects
-- This script removes duplicate sites and projects, keeping only unique entries

-- ============================================
-- STEP 1: View current data before cleanup
-- ============================================

SELECT 'BEFORE CLEANUP - Sites:' as status;
SELECT id, name, latitude, longitude, folder_name, created_at FROM sites ORDER BY created_at;

SELECT 'BEFORE CLEANUP - Projects:' as status;
SELECT id, name, site_id, status, created_at FROM projects ORDER BY created_at;

SELECT 'BEFORE CLEANUP - Photos:' as status;
SELECT id, address, site_id, project_id FROM photos;

-- ============================================
-- STEP 2: Identify duplicates
-- ============================================

-- Find duplicate sites (same latitude/longitude)
SELECT 'Duplicate Sites (by coordinates):' as status;
SELECT latitude, longitude, COUNT(*) as count, array_agg(id) as site_ids
FROM sites
GROUP BY latitude, longitude
HAVING COUNT(*) > 1;

-- Find duplicate projects (multiple active projects per site)
SELECT 'Duplicate Projects (by site):' as status;
SELECT site_id, status, COUNT(*) as count, array_agg(id) as project_ids
FROM projects
GROUP BY site_id, status
HAVING COUNT(*) > 1;

-- ============================================
-- STEP 3: Cleanup Strategy
-- ============================================

-- For each duplicate set, we'll:
-- 1. Keep the OLDEST record (earliest created_at)
-- 2. Update photos to reference the kept record
-- 3. Delete the duplicate records

-- ============================================
-- STEP 4: Clean up duplicate sites
-- ============================================

-- Update photos to point to the oldest site for each location
WITH ranked_sites AS (
  SELECT
    id,
    latitude,
    longitude,
    ROW_NUMBER() OVER (PARTITION BY latitude, longitude ORDER BY created_at ASC) as rn
  FROM sites
),
sites_to_keep AS (
  SELECT id, latitude, longitude
  FROM ranked_sites
  WHERE rn = 1
),
sites_to_delete AS (
  SELECT id
  FROM ranked_sites
  WHERE rn > 1
)
-- First, update photos to use the kept site
UPDATE photos p
SET site_id = (
  SELECT stk.id
  FROM sites_to_keep stk
  INNER JOIN sites s ON s.latitude = stk.latitude AND s.longitude = stk.longitude
  WHERE s.id = p.site_id
  LIMIT 1
)
WHERE site_id IN (SELECT id FROM sites_to_delete);

-- Delete duplicate sites
WITH ranked_sites AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY latitude, longitude ORDER BY created_at ASC) as rn
  FROM sites
)
DELETE FROM sites
WHERE id IN (
  SELECT id FROM ranked_sites WHERE rn > 1
);

-- ============================================
-- STEP 5: Clean up duplicate projects
-- ============================================

-- Update photos to point to the oldest project for each site
WITH ranked_projects AS (
  SELECT
    id,
    site_id,
    status,
    ROW_NUMBER() OVER (PARTITION BY site_id, status ORDER BY created_at ASC) as rn
  FROM projects
),
projects_to_keep AS (
  SELECT id, site_id, status
  FROM ranked_projects
  WHERE rn = 1
),
projects_to_delete AS (
  SELECT id
  FROM ranked_projects
  WHERE rn > 1
)
-- Update photos to use the kept project
UPDATE photos p
SET project_id = (
  SELECT ptk.id
  FROM projects_to_keep ptk
  INNER JOIN projects pr ON pr.site_id = ptk.site_id AND pr.status = ptk.status
  WHERE pr.id = p.project_id
  LIMIT 1
)
WHERE project_id IN (SELECT id FROM projects_to_delete);

-- Delete duplicate projects
WITH ranked_projects AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY site_id, status ORDER BY created_at ASC) as rn
  FROM projects
)
DELETE FROM projects
WHERE id IN (
  SELECT id FROM ranked_projects WHERE rn > 1
);

-- ============================================
-- STEP 6: Link photos to projects if NULL
-- ============================================

-- Update photos without project_id to link to their site's active project
UPDATE photos
SET project_id = (
  SELECT id FROM projects
  WHERE site_id = photos.site_id
    AND status = 'Active'
  LIMIT 1
)
WHERE project_id IS NULL AND site_id IS NOT NULL;

-- ============================================
-- STEP 7: View results after cleanup
-- ============================================

SELECT 'AFTER CLEANUP - Sites:' as status;
SELECT id, name, latitude, longitude, folder_name, created_at FROM sites ORDER BY created_at;

SELECT 'AFTER CLEANUP - Projects:' as status;
SELECT id, name, site_id, status, created_at FROM projects ORDER BY created_at;

SELECT 'AFTER CLEANUP - Photos:' as status;
SELECT id, address, site_id, project_id FROM photos;

-- ============================================
-- STEP 8: Final verification
-- ============================================

SELECT 'FINAL COUNTS:' as status;
SELECT
  (SELECT COUNT(*) FROM sites) as sites_count,
  (SELECT COUNT(*) FROM projects) as projects_count,
  (SELECT COUNT(*) FROM photos) as photos_count,
  (SELECT COUNT(*) FROM photos WHERE site_id IS NOT NULL) as photos_with_site,
  (SELECT COUNT(*) FROM photos WHERE project_id IS NOT NULL) as photos_with_project;
