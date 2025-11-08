import { Project, Site } from '@/types/database';
import { Briefcase, Image, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  site: Site;
  photoCount: number;
}

export default function ProjectCard({ project, site, photoCount }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <Briefcase className="h-6 w-6 text-gray-900" />
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            project.status === 'Active'
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {project.status}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {project.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium">{site.name}</p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1">
              <Image className="h-4 w-4" />
              <span>{photoCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
