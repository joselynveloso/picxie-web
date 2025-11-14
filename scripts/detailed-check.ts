import { supabase } from '../lib/supabase';

async function detailedCheck() {
  console.log('=== DETAILED DATABASE CHECK ===\n');

  // Try to get actual data, not just counts
  console.log('1. Fetching Sites (with select *)...');
  const { data: sites, error: sitesError } = await supabase
    .from('sites')
    .select('*');

  console.log('Sites data:', sites);
  console.log('Sites error:', sitesError);
  console.log('Sites count:', sites?.length ?? 0);
  console.log('');

  // Try count query
  console.log('2. Fetching Sites (with count)...');
  const { count: sitesCount, error: sitesCountError } = await supabase
    .from('sites')
    .select('*', { count: 'exact', head: true });

  console.log('Sites count result:', sitesCount);
  console.log('Sites count error:', sitesCountError);
  console.log('');

  // Projects
  console.log('3. Fetching Projects (with select *)...');
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*');

  console.log('Projects data:', projects);
  console.log('Projects error:', projectsError);
  console.log('Projects count:', projects?.length ?? 0);
  console.log('');

  // Projects count
  console.log('4. Fetching Projects (with count)...');
  const { count: projectsCount, error: projectsCountError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  console.log('Projects count result:', projectsCount);
  console.log('Projects count error:', projectsCountError);
  console.log('');

  // Photos
  console.log('5. Fetching Photos...');
  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select('*');

  console.log('Photos count:', photos?.length ?? 0);
  console.log('Photos error:', photosError);

  if (photos && photos.length > 0) {
    console.log('\nPhoto site_ids:');
    photos.forEach((photo: any) => {
      console.log(`  - Photo ${photo.id}: site_id = ${photo.site_id}, project_id = ${photo.project_id}`);
    });

    // Try to fetch sites by the IDs we see in photos
    const siteIds = photos.map((p: any) => p.site_id).filter(Boolean);
    if (siteIds.length > 0) {
      console.log('\n6. Trying to fetch sites by IDs from photos...');
      const { data: sitesByIds, error: sitesByIdsError } = await supabase
        .from('sites')
        .select('*')
        .in('id', siteIds);

      console.log('Sites by IDs data:', sitesByIds);
      console.log('Sites by IDs error:', sitesByIdsError);
    }
  }

  console.log('\n=== RLS STATUS CHECK ===');
  console.log('If you see errors with code "42501" or "PGRST116", RLS is blocking queries.');
  console.log('If data is null but no errors, RLS policies might be too restrictive.');
}

detailedCheck();
