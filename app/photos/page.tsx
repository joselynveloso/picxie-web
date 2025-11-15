'use client';

import { supabase } from '@/lib/supabase';
import { Photo, Site, Project } from '@/types/database';
import MainLayout from '@/components/MainLayout';
import PhotoGrid from '@/components/PhotoGrid';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, [selectedSite, selectedProject]);

  // Real-time subscription for instant sync with mobile app
  useEffect(() => {
    console.log('📡 Setting up real-time subscription for photos');

    const subscription = supabase
      .channel('photos-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'photos'
      }, (payload) => {
        console.log('📸 Photo change detected:', payload);
        // Refresh photos when mobile app adds/updates/deletes photos
        fetchData();
      })
      .subscribe();

    return () => {
      console.log('📡 Unsubscribing from photos changes');
      subscription.unsubscribe();
    };
  }, [selectedSite, selectedProject]);

  async function fetchData() {
    setLoading(true);

    try {
      // Fetch filter options
      const [sitesResult, projectsResult] = await Promise.all([
        supabase.from('sites').select('*').order('name'),
        supabase.from('projects').select('*').order('name'),
      ]);

      setSites(sitesResult.data || []);
      setProjects(projectsResult.data || []);

      // Build query with filters
      let query = supabase
        .from('photos')
        .select('*')
        .order('captured_at', { ascending: false });

      if (selectedSite !== 'all') {
        query = query.eq('site_id', selectedSite);
      }

      if (selectedProject !== 'all') {
        query = query.eq('project_id', selectedProject);
      }

      const { data } = await query;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout title="Photo Library">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Site
          </label>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">All Sites</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${photos.length} photo${photos.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading photos..." />
        </div>
      ) : photos.length > 0 ? (
        <PhotoGrid photos={photos} columns={4} />
      ) : (
        <EmptyState
          icon={ImageIcon}
          title="No photos found"
          description="Try adjusting your filters or check back later."
        />
      )}
    </MainLayout>
  );
}
