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
        <div className="mb-12 glass-card p-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-[#e9d5ff] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">Data Integrity Issue</h3>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">
                Photos exist but no sites found. This may indicate missing or orphaned data.
              </p>
              <a
                href="/debug"
                className="inline-flex items-center px-6 py-3 glass-card text-white text-sm font-medium hover:text-[#e9d5ff] transition-slow"
              >
                Go to Debug Page →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Stats - Staggered Layout */}
      <div className="mb-24">
        {/* Hero Stat */}
        <div className="mb-16 animate-fade-in">
          <StatCard
            title="Photos"
            value={data.totalPhotos}
            icon={ImageIcon}
          />
        </div>

        {/* Secondary Stats - 2x2 Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
          <div className="animate-fade-in-delay-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-white/40" />
                <p className="text-xs font-medium text-[#666] uppercase tracking-[0.2em]">Sites</p>
              </div>
              <p className="text-5xl font-bold text-white">{data.totalSites}</p>
            </div>
          </div>
          <div className="animate-fade-in-delay-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-3 w-3 text-white/40" />
                <p className="text-xs font-medium text-[#666] uppercase tracking-[0.2em]">Projects</p>
              </div>
              <p className="text-5xl font-bold text-white">{data.totalProjects}</p>
              <p className="text-xs text-[#666]">{data.activeProjects} active</p>
            </div>
          </div>
          <div className="animate-fade-in-delay-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-white/40" />
                <p className="text-xs font-medium text-[#666] uppercase tracking-[0.2em]">Active</p>
              </div>
              <p className="text-5xl font-bold text-white">{data.activeProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Photos Section */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-white">Recent</h2>
          {data.recentPhotos.length > 0 && (
            <a
              href="/photos"
              className="text-sm text-white/40 hover:text-[#e9d5ff] transition-slow"
            >
              View all →
            </a>
          )}
        </div>

        {data.recentPhotos.length > 0 ? (
          <PhotoGrid photos={data.recentPhotos} columns={3} />
        ) : (
          <div className="glass-card p-20 text-center">
            <ImageIcon className="h-12 w-12 text-white/20 mx-auto mb-6" />
            <p className="text-white/40 text-lg">No photos yet</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
