import { supabase } from '@/lib/supabase';
import { Photo } from '@/types/database';
import MainLayout from '@/components/MainLayout';
import StatCard from '@/components/StatCard';
import PhotoGrid from '@/components/PhotoGrid';
import ErrorMessage from '@/components/ErrorMessage';
import { MapPin, Briefcase, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

async function getDashboardData() {
  try {
    // Fetch stats with error handling
    const [
      sitesResult,
      projectsResult,
      activeProjectsResult,
      completedProjectsResult,
      photosResult,
      recentPhotosResult
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

    // Check for errors
    if (sitesResult.error) {
      console.error('Error fetching sites:', sitesResult.error);
    }
    if (projectsResult.error) {
      console.error('Error fetching projects:', projectsResult.error);
    }
    if (photosResult.error) {
      console.error('Error fetching photos:', photosResult.error);
    }

    return {
      error: null,
      totalSites: sitesResult.count ?? 0,
      totalProjects: projectsResult.count ?? 0,
      activeProjects: activeProjectsResult.count ?? 0,
      completedProjects: completedProjectsResult.count ?? 0,
      totalPhotos: photosResult.count ?? 0,
      recentPhotos: (recentPhotosResult.data ?? []) as Photo[],
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to load dashboard data',
      totalSites: 0,
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalPhotos: 0,
      recentPhotos: [],
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <MainLayout title="Dashboard">
      {/* Error Message */}
      {data.error && (
        <div className="mb-6">
          <ErrorMessage
            title="Failed to load dashboard data"
            message={data.error}
          />
        </div>
      )}

      {/* Data Integrity Warning */}
      {!data.error && data.totalPhotos > 0 && data.totalSites === 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-1">Data Integrity Issue</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Photos exist but no sites found. This may indicate missing or orphaned data.
              </p>
              <a
                href="/debug"
                className="inline-flex items-center px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition-colors"
              >
                Go to Debug Page →
              </a>
            </div>
          </div>
        </div>
      )}

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
