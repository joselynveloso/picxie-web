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
        <div className="mb-6 animate-fade-in">
          <ErrorMessage
            title="Failed to load dashboard data"
            message={data.error}
          />
        </div>
      )}

      {/* Data Integrity Warning */}
      {!data.error && data.totalPhotos > 0 && data.totalSites === 0 && (
        <div className="mb-6 glass-card rounded-2xl p-5 border-[#f59e0b]/20 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="glass-medium rounded-xl p-2">
              <AlertCircle className="h-5 w-5 text-[#f59e0b]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-100 mb-2">Data Integrity Issue</h3>
              <p className="text-sm text-gray-400 mb-4">
                Photos exist but no sites found. This may indicate missing or orphaned data.
              </p>
              <a
                href="/debug"
                className="inline-flex items-center px-4 py-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] text-sm font-semibold rounded-xl hover:bg-[#f59e0b]/20 transition-smooth"
              >
                Go to Debug Page →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="animate-fade-in">
          <StatCard
            title="Total Sites"
            value={data.totalSites}
            icon={MapPin}
          />
        </div>
        <div className="animate-fade-in-delay-1">
          <StatCard
            title="Total Projects"
            value={data.totalProjects}
            icon={Briefcase}
            subtitle={`${data.activeProjects} active, ${data.completedProjects} completed`}
          />
        </div>
        <div className="animate-fade-in-delay-2">
          <StatCard
            title="Active Projects"
            value={data.activeProjects}
            icon={CheckCircle}
          />
        </div>
        <div className="animate-fade-in-delay-3">
          <StatCard
            title="Total Photos"
            value={data.totalPhotos}
            icon={ImageIcon}
          />
        </div>
      </div>

      {/* Recent Photos Section */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-100">Recent Photos</h3>
          {data.recentPhotos.length > 0 && (
            <a
              href="/photos"
              className="text-sm font-medium text-[#06b6d4] hover:text-[#0891b2] transition-smooth"
            >
              View all →
            </a>
          )}
        </div>

        {data.recentPhotos.length > 0 ? (
          <PhotoGrid photos={data.recentPhotos} columns={3} />
        ) : (
          <div className="glass-card rounded-2xl p-16 text-center">
            <div className="glass-medium rounded-full p-6 inline-block mb-4">
              <ImageIcon className="h-16 w-16 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No photos yet</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
