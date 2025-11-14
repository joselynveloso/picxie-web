'use client';

import { supabase } from '@/lib/supabase';
import { Site, Project, Photo } from '@/types/database';
import MainLayout from '@/components/MainLayout';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Database, RefreshCw } from 'lucide-react';

interface DebugData {
  sites: Site[];
  projects: Project[];
  photos: Photo[];
  counts: {
    sites: number;
    projects: number;
    photos: number;
  };
  orphanedPhotos: Photo[];
  errors: string[];
}

export default function DebugPage() {
  const [data, setData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState(false);
  const [fixResult, setFixResult] = useState<string | null>(null);

  useEffect(() => {
    fetchDebugData();
  }, []);

  async function fetchDebugData() {
    setLoading(true);
    const errors: string[] = [];

    try {
      // Fetch all data
      const [sitesRes, projectsRes, photosRes] = await Promise.all([
        supabase.from('sites').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('photos').select('*').order('captured_at', { ascending: false }),
      ]);

      if (sitesRes.error) errors.push(`Sites error: ${sitesRes.error.message}`);
      if (projectsRes.error) errors.push(`Projects error: ${projectsRes.error.message}`);
      if (photosRes.error) errors.push(`Photos error: ${photosRes.error.message}`);

      const sites = (sitesRes.data || []) as Site[];
      const projects = (projectsRes.data || []) as Project[];
      const photos = (photosRes.data || []) as Photo[];

      // Find orphaned photos (photos with site_id that doesn't exist)
      const siteIds = new Set(sites.map(s => s.id));
      const orphanedPhotos = photos.filter(p => p.site_id && !siteIds.has(p.site_id));

      setData({
        sites,
        projects,
        photos,
        counts: {
          sites: sites.length,
          projects: projects.length,
          photos: photos.length,
        },
        orphanedPhotos,
        errors,
      });
    } catch (error) {
      errors.push(`Unexpected error: ${error}`);
      setData({
        sites: [],
        projects: [],
        photos: [],
        counts: { sites: 0, projects: 0, photos: 0 },
        orphanedPhotos: [],
        errors,
      });
    } finally {
      setLoading(false);
    }
  }

  async function fixMissingData() {
    setFixing(true);
    setFixResult(null);

    try {
      const results: string[] = [];

      // Check if we have photos
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .limit(1);

      if (photosError) throw new Error(`Failed to fetch photos: ${photosError.message}`);

      const photos = (photosData || []) as Photo[];
      if (photos.length === 0) {
        setFixResult('No photos found to fix');
        return;
      }

      const photo = photos[0];
      results.push(`Found photo: ${photo.file_name} at ${photo.address}`);

      // Check if site exists
      let siteId: string | null = photo.site_id;
      if (siteId) {
        const { data: existingSite } = await supabase
          .from('sites')
          .select('*')
          .eq('id', siteId)
          .single();

        if (!existingSite) {
          results.push(`Site ID ${siteId} not found - creating new site`);
          siteId = null; // Force creation of new site
        }
      }

      // Create site if doesn't exist
      if (!siteId) {
        const newSiteData = {
          name: 'Miami Test Site',
          latitude: photo.latitude,
          longitude: photo.longitude,
          radius_meters: 100,
          folder_name: 'miami_test_site',
        };

        // @ts-ignore - Supabase type inference issue in client components
        const { data: newSite, error: siteError } = await supabase.from('sites').insert(newSiteData).select().single();

        if (siteError) throw new Error(`Failed to create site: ${siteError.message}`);
        if (!newSite) throw new Error('Site created but no data returned');

        siteId = (newSite as Site).id;
        results.push(`✅ Created site: ${(newSite as Site).name} (ID: ${siteId})`);

        // Update photo to link to new site
        // @ts-ignore - Supabase type inference issue in client components
        const { error: updatePhotoError } = await supabase.from('photos').update({ site_id: siteId }).eq('id', photo.id);

        if (updatePhotoError) throw new Error(`Failed to link photo to site: ${updatePhotoError.message}`);
        results.push(`✅ Linked photo to site`);
      } else {
        results.push(`Site already exists (ID: ${siteId})`);
      }

      // Check if project exists for this site
      const { data: existingProjects } = await supabase
        .from('projects')
        .select('*')
        .eq('site_id', siteId);

      let projectId: string | null = null;
      if (!existingProjects || existingProjects.length === 0) {
        // Create project
        const newProjectData = {
          name: 'Initial Project',
          site_id: siteId,
          status: 'Active' as const,
        };

        // @ts-ignore - Supabase type inference issue in client components
        const { data: newProject, error: projectError } = await supabase.from('projects').insert(newProjectData).select().single();

        if (projectError) throw new Error(`Failed to create project: ${projectError.message}`);
        if (!newProject) throw new Error('Project created but no data returned');

        projectId = (newProject as Project).id;
        results.push(`✅ Created project: ${(newProject as Project).name} (ID: ${projectId})`);

        // Link photo to project
        // @ts-ignore - Supabase type inference issue in client components
        const { error: updatePhotoError } = await supabase.from('photos').update({ project_id: projectId }).eq('id', photo.id);

        if (updatePhotoError) {
          results.push(`⚠️ Warning: Failed to link photo to project: ${updatePhotoError.message}`);
        } else {
          results.push(`✅ Linked photo to project`);
        }
      } else {
        projectId = (existingProjects[0] as Project).id;
        results.push(`Project already exists (ID: ${projectId})`);
      }

      setFixResult(results.join('\n'));

      // Refresh data
      await fetchDebugData();
    } catch (error) {
      setFixResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setFixing(false);
    }
  }

  if (loading) {
    return (
      <MainLayout title="Database Debug">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin">
            <Database className="h-12 w-12 text-gray-400" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Database Debug">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sites</span>
            <span className="text-2xl font-semibold text-gray-900">{data?.counts.sites || 0}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Projects</span>
            <span className="text-2xl font-semibold text-gray-900">{data?.counts.projects || 0}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Photos</span>
            <span className="text-2xl font-semibold text-gray-900">{data?.counts.photos || 0}</span>
          </div>
        </div>
      </div>

      {/* Errors */}
      {data?.errors && data.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Errors</h3>
              {data.errors.map((error, idx) => (
                <p key={idx} className="text-sm text-red-700">{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orphaned Photos */}
      {data?.orphanedPhotos && data.orphanedPhotos.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">
                Orphaned Photos ({data.orphanedPhotos.length})
              </h3>
              <p className="text-sm text-yellow-700 mb-2">
                These photos reference site IDs that don't exist:
              </p>
              {data.orphanedPhotos.map(photo => (
                <p key={photo.id} className="text-sm text-yellow-700">
                  • {photo.file_name} → site_id: {photo.site_id}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fix Data Button */}
      <div className="mb-6">
        <button
          onClick={fixMissingData}
          disabled={fixing}
          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {fixing ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Fixing...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              Fix Missing Data
            </>
          )}
        </button>
      </div>

      {/* Fix Result */}
      {fixResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <pre className="text-sm text-green-800 whitespace-pre-wrap font-mono">{fixResult}</pre>
        </div>
      )}

      {/* Photos Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Photos ({data?.photos.length || 0})</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Captured At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.photos.map(photo => (
                  <tr key={photo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{photo.file_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{photo.address || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{photo.site_id || 'null'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{photo.project_id || 'null'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(photo.captured_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sites Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sites ({data?.sites.length || 0})</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordinates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Radius</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folder</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.sites.map(site => (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{site.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{site.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{site.radius_meters}m</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{site.folder_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Projects Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects ({data?.projects.length || 0})</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.projects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{project.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{project.id}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{project.site_id}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        project.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(project.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchDebugData}
          className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
      </div>
    </MainLayout>
  );
}
