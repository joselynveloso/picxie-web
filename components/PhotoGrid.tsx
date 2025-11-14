'use client';

import { Photo } from '@/types/database';
import { useState } from 'react';
import PhotoModal from './PhotoModal';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  columns?: 2 | 3 | 4;
}

export default function PhotoGrid({ photos, columns = 3 }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return null;
  }

  // Masonry layout using CSS columns
  const columnCount = {
    2: 'sm:columns-2',
    3: 'sm:columns-2 lg:columns-3',
    4: 'sm:columns-2 lg:columns-3 xl:columns-4',
  };

  return (
    <>
      <div className={`columns-1 ${columnCount[columns]} gap-4`}>
        {photos.map((photo, index) => {
          // Vary heights for visual interest
          const heights = ['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[5/4]'];
          const heightClass = heights[index % heights.length];

          return (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`relative ${heightClass} w-full mb-4 overflow-hidden rounded-2xl group break-inside-avoid`}
              style={{
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Image
                src={`https://ampxyzotiiqmwcwsdfut.supabase.co/storage/v1/object/public/photos/${photo.file_name}`}
                alt={photo.address || 'Photo'}
                fill
                className="object-cover transition-all duration-600"
                style={{
                  transform: 'scale(1)',
                  filter: 'brightness(1)',
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity" />

              {/* Location text overlay */}
              {photo.address && (
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3 w-3 text-white/60 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/90 font-medium leading-relaxed">
                      {photo.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Hover effect styles applied via inline style */}
              <style jsx>{`
                button:hover img {
                  transform: scale(1.02) !important;
                  filter: brightness(1.1) !important;
                }
              `}</style>
            </button>
          );
        })}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
