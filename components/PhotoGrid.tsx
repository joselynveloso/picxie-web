'use client';

import { Photo } from '@/types/database';
import { useState } from 'react';
import PhotoModal from './PhotoModal';
import Image from 'next/image';

interface PhotoGridProps {
  photos: Photo[];
  columns?: 2 | 3 | 4;
}

export default function PhotoGrid({ photos, columns = 4 }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors group"
          >
            <Image
              src={`https://ampxyzotiiqmwcwsdfut.supabase.co/storage/v1/object/public/photos/${photo.file_name}`}
              alt={photo.address || 'Photo'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        ))}
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
