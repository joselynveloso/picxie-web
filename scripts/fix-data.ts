import { supabase } from '../lib/supabase';

async function fixMissingData() {
  console.log('Starting data fix...\n');

  // Get all photos
  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select('*');

  if (photosError) {
    console.error('Error fetching photos:', photosError);
    return;
  }

  if (!photos || photos.length === 0) {
    console.log('No photos found. Nothing to fix.');
    return;
  }

  console.log(`Found ${photos.length} photos\n`);

  // Group photos by address to create sites
  const addressMap = new Map();
  for (const photo of photos as any[]) {
    if (!addressMap.has(photo.address)) {
      addressMap.set(photo.address, []);
    }
    addressMap.get(photo.address).push(photo);
  }

  console.log(`Found ${addressMap.size} unique addresses\n`);

  // Create sites for each unique address
  for (const [address, addressPhotos] of addressMap.entries()) {
    const firstPhoto = addressPhotos[0] as any;

    // Check if site already exists for this location
    const { data: existingSite } = await supabase
      .from('sites')
      .select('*')
      .eq('latitude', firstPhoto.latitude)
      .eq('longitude', firstPhoto.longitude)
      .single();

    let siteId: string;

    if (existingSite) {
      console.log(`Site already exists for ${address}`);
      siteId = (existingSite as any).id;
    } else {
      // Create new site
      const siteName = address.split(',')[0].trim(); // Use first part of address as site name
      const { data: newSite, error: siteError } = await supabase
        .from('sites')
        .insert({
          name: siteName,
          latitude: firstPhoto.latitude,
          longitude: firstPhoto.longitude,
          radius_meters: 100,
          folder_name: address
        })
        .select()
        .single();

      if (siteError) {
        console.error(`Error creating site for ${address}:`, siteError);
        continue;
      }

      siteId = (newSite as any)!.id;
      console.log(`Created site: ${siteName} (ID: ${siteId})`);
    }

    // Create a default project for this site
    const { data: existingProject } = await supabase
      .from('projects')
      .select('*')
      .eq('site_id', siteId)
      .eq('status', 'Active')
      .single();

    let projectId: string;

    if (existingProject) {
      console.log(`Active project already exists for site ${siteId}`);
      projectId = (existingProject as any).id;
    } else {
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: `Default Project`,
          site_id: siteId,
          status: 'Active'
        })
        .select()
        .single();

      if (projectError) {
        console.error(`Error creating project for site ${siteId}:`, projectError);
        continue;
      }

      projectId = (newProject as any)!.id;
      console.log(`Created project: Default Project (ID: ${projectId})`);
    }

    // Link all photos at this address to the site and project
    for (const photo of addressPhotos as any[]) {
      const { error: updateError } = await supabase
        .from('photos')
        .update({
          site_id: siteId,
          project_id: projectId
        })
        .eq('id', photo.id);

      if (updateError) {
        console.error(`Error updating photo ${photo.id}:`, updateError);
      } else {
        console.log(`Linked photo ${photo.id} to site ${siteId} and project ${projectId}`);
      }
    }

    console.log('');
  }

  console.log('Data fix complete!\n');

  // Verify the fix
  const [sitesResult, projectsResult, photosResult] = await Promise.all([
    supabase.from('sites').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('photos').select('*', { count: 'exact', head: true })
  ]);

  console.log('Final Database Counts:');
  console.log('Sites:', sitesResult.count ?? 0);
  console.log('Projects:', projectsResult.count ?? 0);
  console.log('Photos:', photosResult.count ?? 0);
}

fixMissingData();
