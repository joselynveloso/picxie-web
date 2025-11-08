import { supabase } from '@/lib/supabase';
import { Photo, Project } from '@/types/database';
import MainLayout from '@/components/MainLayout';
import PhotoGrid from '@/components/PhotoGrid';
import MapView from '@/components/MapView';
import { MapPin, Navigation, Ruler } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getSiteData(id: string) {
  const [
    { data: site },
    { data: projects },
    { data: photos }
  ] = await Promise.all([
    supabase.from('sites').select('*').eq('id', id).single(),
    supabase.from('projects').select('*').eq('site_id', id).order('created_at', { ascending: false }),
    supabase.from('photos').select('*').eq('site_id', id).order('captured_at', { ascending: false }),
  ]);

  return { site, projects: projects || [], photos: (photos || []) as Photo[] };
}

export default async function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site, projects, photos } = await getSiteData(id);

  if (!site) {
    notFound();
  }

  return (
    <MainLayout title={site.name}>
      {/* Site Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Location</p>
              <p className="text-sm text-gray-600">{site.folder_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Navigation className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Coordinates</p>
              <p className="text-sm text-gray-600">
                {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Ruler className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Radius</p>
              <p className="text-sm text-gray-600">{site.radius_meters} meters</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <MapView
          latitude={site.latitude}
          longitude={site.longitude}
          radius={site.radius_meters}
          markerLabel={site.name}
        />
      </div>

      {/* Projects */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Projects ({projects.length})
        </h3>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      project.status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No projects for this site</p>
        )}
      </div>

      {/* Photos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Photos ({photos.length})
        </h3>
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} columns={4} />
        ) : (
          <p className="text-gray-500 text-sm">No photos for this site</p>
        )}
      </div>
    </MainLayout>
  );
}
