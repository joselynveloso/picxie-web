'use client';

import { Photo } from '@/types/database';
import { X, MapPin, Calendar, Navigation } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
      >
        <X className="h-6 w-6 text-gray-900" />
      </button>

      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-6">
        {/* Photo */}
        <div className="flex-1 relative aspect-video lg:aspect-auto lg:h-[80vh] bg-gray-900 rounded-lg overflow-hidden">
          <Image
            src={`https://ampxyzotiiqmwcwsdfut.supabase.co/storage/v1/object/public/photos/${photo.file_name}`}
            alt={photo.address || 'Photo'}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 75vw"
            priority
          />
        </div>

        {/* Metadata */}
        <div className="lg:w-80 bg-white rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Photo Details</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">{photo.address || 'No address'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Navigation className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Coordinates</p>
                <p className="text-sm text-gray-600">
                  {photo.latitude.toFixed(6)}, {photo.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Captured</p>
                <p className="text-sm text-gray-600">
                  {new Date(photo.captured_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              File: {photo.file_name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
