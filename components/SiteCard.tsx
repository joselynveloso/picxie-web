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
      <div className="glass-card cursor-pointer group overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white group-hover:text-[#e9d5ff] transition-slow mb-2">
              {site.name}
            </h3>
            <p className="font-mono text-xs text-[#666] mb-1">
              {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
            </p>
            <p className="text-xs text-[#666] uppercase tracking-widest">
              {site.radius_meters}m
            </p>
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
