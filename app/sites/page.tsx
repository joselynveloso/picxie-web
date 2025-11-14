import { supabase } from '@/lib/supabase';
import { Site } from '@/types/database';
import MainLayout from '@/components/MainLayout';
import SiteCard from '@/components/SiteCard';
import EmptyState from '@/components/EmptyState';
import { MapPin } from 'lucide-react';

async function getSitesWithPhotoCounts() {
  const { data: sites } = await supabase
    .from('sites')
    .select('*')
    .order('name');

  if (!sites) return [];

  // Get photo counts for each site
  const sitesWithCounts = await Promise.all(
    (sites as Site[]).map(async (site) => {
      const { count } = await supabase
        .from('photos')
        .select('*', { count: 'exact', head: true })
        .eq('site_id', site.id);

      return {
        site,
        photoCount: count || 0,
      };
    })
  );

  return sitesWithCounts;
}

export default async function SitesPage() {
  const sitesWithCounts = await getSitesWithPhotoCounts();

  return (
    <MainLayout title="Sites">
      {sitesWithCounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sitesWithCounts.map(({ site, photoCount }) => (
            <SiteCard key={site.id} site={site} photoCount={photoCount} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No sites yet"
          description="Sites will appear here once they are added to the system."
        />
      )}
    </MainLayout>
  );
}
