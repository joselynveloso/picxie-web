'use client';

import { Photo } from '@/types/database';
import { X, MapPin, Calendar, Navigation } from 'lucide-react';
import { useEffect } from 'react';
import PhotoImage from './PhotoImage';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full transition-slow"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <X className="h-5 w-5 text-white/80" />
      </button>

      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-6">
        {/* Photo */}
        <div className="flex-1 relative aspect-video lg:aspect-auto lg:h-[80vh] rounded-2xl overflow-hidden"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <PhotoImage
            fileName={photo.file_name}
            alt={photo.address || 'Photo'}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 75vw"
            priority
          />
        </div>

        {/* Metadata */}
        <div className="lg:w-80 glass-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Photo Details</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-white/40 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1">Location</p>
                <p className="text-sm text-white">{photo.address || 'No address'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Navigation className="h-4 w-4 text-white/40 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1">Coordinates</p>
                <p className="text-sm text-white font-mono">
                  {photo.latitude.toFixed(6)}, {photo.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-white/40 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1">Captured</p>
                <p className="text-sm text-white">
                  {new Date(photo.captured_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <p className="text-xs text-[#666]">
              {photo.file_name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
