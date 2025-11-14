import { Site } from '@/types/database';
import { Image } from 'lucide-react';
import Link from 'next/link';

interface SiteCardProps {
  site: Site;
  photoCount: number;
}

export default function SiteCard({ site, photoCount }: SiteCardProps) {
  return (
    <Link href={`/sites/${site.id}`}>
      <div className="glass-card cursor-pointer group">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white group-hover:text-[#e9d5ff] transition-slow">
              {site.name}
            </h3>
            <div className="flex items-center gap-2 text-white/40">
              <Image className="h-4 w-4" />
              <span className="text-sm font-medium">{photoCount}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-mono text-white/40">
              {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
            </p>
            <p className="text-white/30 text-xs uppercase tracking-widest">
              {site.radius_meters}m radius
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
