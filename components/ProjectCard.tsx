import { Project, Site } from '@/types/database';
import { Image, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  site: Site;
  photoCount: number;
}

export default function ProjectCard({ project, site, photoCount }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="glass-card cursor-pointer group">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-white group-hover:text-[#e9d5ff] transition-slow mb-2">
                {project.name}
              </h3>
              <p className="text-sm text-white/50">{site.name}</p>
            </div>
            <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
              project.status === 'Active'
                ? 'bg-[#e9d5ff]/10 text-[#e9d5ff]'
                : 'bg-white/5 text-white/40'
            }`}>
              {project.status}
            </span>
          </div>

          <div className="flex items-center gap-6 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>{photoCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
