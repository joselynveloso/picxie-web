import { supabase } from '@/lib/supabase';
import { Photo, Site } from '@/types/database';
import MainLayout from '@/components/MainLayout';
import PhotoGrid from '@/components/PhotoGrid';
import { Briefcase, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getProjectData(id: string) {
  const [
    { data: project },
    { data: photos }
  ] = await Promise.all([
    supabase.from('projects').select('*, sites(*)').eq('id', id).single(),
    supabase.from('photos').select('*').eq('project_id', id).order('captured_at', { ascending: false }),
  ]);

  return {
    project,
    site: project?.sites as unknown as Site,
    photos: (photos || []) as Photo[]
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { project, site, photos } = await getProjectData(id);

  if (!project) {
    notFound();
  }

  return (
    <MainLayout title={project.name}>
      {/* Project Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Status</p>
              <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                project.status === 'Active'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {project.status}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Site</p>
              <Link href={`/sites/${site?.id}`} className="text-sm text-gray-600 hover:text-gray-900">
                {site?.name}
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Created</p>
              <p className="text-sm text-gray-600">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {project.completed_at && (
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Completed</p>
                <p className="text-sm text-gray-600">
                  {new Date(project.completed_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Photos ({photos.length})
        </h3>
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} columns={4} />
        ) : (
          <p className="text-gray-500 text-sm">No photos for this project</p>
        )}
      </div>
    </MainLayout>
  );
}
