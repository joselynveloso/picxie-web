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
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <MapPin className="h-6 w-6 text-gray-900" />
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Image className="h-4 w-4" />
            <span>{photoCount}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {site.name}
        </h3>

        <div className="space-y-1 text-sm text-gray-600">
          <p>
            {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
          </p>
          <p>Radius: {site.radius_meters}m</p>
        </div>
      </div>
    </Link>
  );
}
