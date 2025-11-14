import { supabase } from '../lib/supabase';

async function checkDatabaseState() {
  console.log('Checking database state...\n');

  const [sitesResult, projectsResult, photosResult] = await Promise.all([
    supabase.from('sites').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('photos').select('*', { count: 'exact', head: true })
  ]);

  console.log('Database Counts:');
  console.log('Sites:', sitesResult.count ?? 0);
  console.log('Projects:', projectsResult.count ?? 0);
  console.log('Photos:', photosResult.count ?? 0);
  console.log('');

  // Get the actual photo data to see details
  const { data: photos } = await supabase.from('photos').select('*');
  if (photos && photos.length > 0) {
    console.log('Photo Details:');
    photos.forEach((photo: any, i: number) => {
      console.log(`Photo ${i + 1}:`);
      console.log(`  ID: ${photo.id}`);
      console.log(`  Address: ${photo.address}`);
      console.log(`  Site ID: ${photo.site_id || 'NULL'}`);
      console.log(`  Project ID: ${photo.project_id || 'NULL'}`);
      console.log('');
    });
  }
}

checkDatabaseState();
