'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import UploadModal from './UploadModal';

export default function FloatingUploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-8 z-40 p-4 rounded-full transition-slow group"
        style={{
          background: 'rgba(233, 213, 255, 0.15)',
          border: '1px solid rgba(233, 213, 255, 0.3)',
          boxShadow: '0 0 30px rgba(233, 213, 255, 0.2)',
        }}
        aria-label="Upload photos"
      >
        <Plus className="h-6 w-6 text-[#e9d5ff] group-hover:scale-110 transition-transform" />
      </button>

      {isModalOpen && (
        <UploadModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
