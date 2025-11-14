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
      <div className="glass-card rounded-2xl p-6 cursor-pointer group">
        <div className="flex items-start justify-between mb-5">
          <div className="glass-medium rounded-xl p-3 transition-smooth group-hover:bg-[#06b6d4]/10 group-hover:border-[#06b6d4]/30">
            <Briefcase className="h-6 w-6 text-[#06b6d4] transition-smooth group-hover:scale-110" />
          </div>
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-smooth ${
            project.status === 'Active'
              ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20'
              : 'glass text-gray-400'
          }`}>
            {project.status}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-[#06b6d4] transition-smooth">
          {project.name}
        </h3>

        <div className="space-y-3 text-sm">
          <p className="font-medium text-gray-300">{site.name}</p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 px-2.5 py-1 glass rounded-lg">
              <Image className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">{photoCount}</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 glass rounded-lg">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300 text-xs">{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
