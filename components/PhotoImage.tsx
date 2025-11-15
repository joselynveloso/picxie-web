'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getPhotoUrl } from '@/lib/supabase';
import { ImageOff } from 'lucide-react';

interface PhotoImageProps {
  fileName: string;
  localUri?: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export default function PhotoImage({
  fileName,
  localUri,
  alt,
  fill = true,
  className = '',
  sizes = '100vw',
  style,
  priority = false,
}: PhotoImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = getPhotoUrl(fileName, localUri);

  // Check if this is a mobile-only photo (no cloud storage URL)
  const isMobileOnly = !imageUrl || (localUri && localUri.startsWith('file://'));

  if (hasError || isMobileOnly) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <ImageOff className="h-8 w-8 text-white/20" />
          <p className="text-xs text-white/40">
            {isMobileOnly ? 'Mobile photo - not synced' : 'Image unavailable'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 photo-skeleton"
          style={{
            background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}

      {/* Actual image */}
      <Image
        src={imageUrl}
        alt={alt}
        fill={fill}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        sizes={sizes}
        style={style}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </>
  );
}
