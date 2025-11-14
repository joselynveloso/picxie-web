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
      <div className="glass-card cursor-pointer group overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-white group-hover:text-[#e9d5ff] transition-slow">
                {project.name}
              </h3>
              <span className={`px-2.5 py-0.5 text-[10px] font-medium rounded-full uppercase tracking-widest ${
                project.status === 'Active'
                  ? 'bg-[#e9d5ff]/10 text-[#e9d5ff]'
                  : 'bg-white/5 text-white/40'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-[#666] mb-1">{site.name}</p>
            <div className="flex items-center gap-1 text-xs text-[#666]">
              <Calendar className="h-3 w-3" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <Image className="h-3 w-3 text-white/40" />
              <span className="text-xs font-medium text-white/60">{photoCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
