-- Picxie Web - RLS Policy Setup
-- Run this in your Supabase SQL Editor to allow read access for the web app

-- ============================================
-- STEP 1: Check current RLS status
-- ============================================

-- Check if RLS is enabled on tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('sites', 'projects', 'photos', 'user_profiles')
  AND schemaname = 'public';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('sites', 'projects', 'photos', 'user_profiles')
  AND schemaname = 'public';

-- ============================================
-- STEP 2: Enable read access for anon users
-- ============================================

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access" ON sites;
DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow public read access" ON photos;
DROP POLICY IF EXISTS "Allow public read access" ON user_profiles;

-- Create permissive read policies for all tables
-- These allow anyone (including anon users) to SELECT data

-- Sites table
CREATE POLICY "Allow public read access" ON sites
  FOR SELECT
  USING (true);

-- Projects table
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT
  USING (true);

-- Photos table
CREATE POLICY "Allow public read access" ON photos
  FOR SELECT
  USING (true);

-- User profiles table
CREATE POLICY "Allow public read access" ON user_profiles
  FOR SELECT
  USING (true);

-- ============================================
-- STEP 3: Optional - Enable write access for development
-- ============================================
-- Uncomment these if you want the debug page to work

/*
-- Sites table
CREATE POLICY "Allow public insert" ON sites
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON sites
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Projects table
CREATE POLICY "Allow public insert" ON projects
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON projects
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Photos table
CREATE POLICY "Allow public insert" ON photos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON photos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
*/

-- ============================================
-- STEP 4: Verify policies are created
-- ============================================

SELECT
  tablename,
  policyname,
  cmd as command,
  CASE
    WHEN cmd = 'SELECT' THEN 'Read'
    WHEN cmd = 'INSERT' THEN 'Create'
    WHEN cmd = 'UPDATE' THEN 'Update'
    WHEN cmd = 'DELETE' THEN 'Delete'
    ELSE cmd
  END as operation
FROM pg_policies
WHERE tablename IN ('sites', 'projects', 'photos', 'user_profiles')
  AND schemaname = 'public'
ORDER BY tablename, cmd;
