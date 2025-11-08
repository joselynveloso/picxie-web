import { supabase } from '@/lib/supabase';
import { Photo } from '@/types/database';
import MainLayout from '@/components/MainLayout';
import StatCard from '@/components/StatCard';
import PhotoGrid from '@/components/PhotoGrid';
import { MapPin, Briefcase, Image as ImageIcon, CheckCircle } from 'lucide-react';

async function getDashboardData() {
  // Fetch stats
  const [
    { count: totalSites },
    { count: totalProjects },
    { count: activeProjects },
    { count: completedProjects },
    { count: totalPhotos },
    { data: recentPhotos }
  ] = await Promise.all([
    supabase.from('sites').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'Completed'),
    supabase.from('photos').select('*', { count: 'exact', head: true }),
    supabase
      .from('photos')
      .select('*')
      .order('captured_at', { ascending: false })
      .limit(6)
  ]);

  return {
    totalSites: totalSites ?? 0,
    totalProjects: totalProjects ?? 0,
    activeProjects: activeProjects ?? 0,
    completedProjects: completedProjects ?? 0,
    totalPhotos: totalPhotos ?? 0,
    recentPhotos: (recentPhotos ?? []) as Photo[],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <MainLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Sites"
          value={data.totalSites}
          icon={MapPin}
        />
        <StatCard
          title="Total Projects"
          value={data.totalProjects}
          icon={Briefcase}
          subtitle={`${data.activeProjects} active, ${data.completedProjects} completed`}
        />
        <StatCard
          title="Active Projects"
          value={data.activeProjects}
          icon={CheckCircle}
        />
        <StatCard
          title="Total Photos"
          value={data.totalPhotos}
          icon={ImageIcon}
        />
      </div>

      {/* Recent Photos Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Photos</h3>
          {data.recentPhotos.length > 0 && (
            <a
              href="/photos"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View all →
            </a>
          )}
        </div>

        {data.recentPhotos.length > 0 ? (
          <PhotoGrid photos={data.recentPhotos} columns={3} />
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No photos yet</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
