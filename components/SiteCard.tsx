import { Site } from '@/types/database';
import { MapPin, Image } from 'lucide-react';
import Link from 'next/link';

interface SiteCardProps {
  site: Site;
  photoCount: number;
}

export default function SiteCard({ site, photoCount }: SiteCardProps) {
  return (
    <Link href={`/sites/${site.id}`}>
      <div className="glass-card rounded-2xl p-6 cursor-pointer group">
        <div className="flex items-start justify-between mb-5">
          <div className="glass-medium rounded-xl p-3 transition-smooth group-hover:bg-[#06b6d4]/10 group-hover:border-[#06b6d4]/30">
            <MapPin className="h-6 w-6 text-[#06b6d4] transition-smooth group-hover:scale-110" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg transition-smooth">
            <Image className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">{photoCount}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-100 mb-3 group-hover:text-[#06b6d4] transition-smooth">
          {site.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-400">
          <p className="font-mono">
            {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 glass rounded-md">
              Radius: {site.radius_meters}m
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
