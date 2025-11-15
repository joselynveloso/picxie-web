'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MainLayout from '@/components/MainLayout';

interface PhotoDebugData {
  id: string;
  file_name: string;
  user_id: string | null;
  site_id: string | null;
  project_id: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  captured_at: string;
  created_at: string;
}

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: any;
}

export default function DebugPhotosPage() {
  const [photos, setPhotos] = useState<PhotoDebugData[]>([]);
  const [storageFiles, setStorageFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDebugData() {
      try {
        // Fetch photo records from database
        const { data: photoData, error: photoError } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (photoError) throw photoError;
        setPhotos(photoData as PhotoDebugData[] || []);

        // Fetch files from storage bucket
        const { data: storageData, error: storageError } = await supabase.storage
          .from('photos')
          .list('', {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (storageError) {
          console.error('Storage list error:', storageError);
          setError(`Storage error: ${storageError.message}`);
        } else {
          setStorageFiles(storageData || []);
        }
      } catch (err) {
        console.error('Debug fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchDebugData();
  }, []);

  if (loading) {
    return (
      <MainLayout title="Photo Debug">
        <div className="text-white/60">Loading debug data...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Photo Debug">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">Error: {error}</p>
        </div>
      )}

      {/* Database Records */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Database Records ({photos.length})
        </h2>
        <div className="space-y-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="glass-card p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/40 mb-1">ID</p>
                  <p className="text-white font-mono text-xs">{photo.id}</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">File Name</p>
                  <p className="text-[#e9d5ff] font-mono break-all">{photo.file_name}</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">User ID</p>
                  <p className="text-white font-mono text-xs">{photo.user_id || 'null'}</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Site ID</p>
                  <p className="text-white font-mono text-xs">{photo.site_id || 'null'}</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Location</p>
                  <p className="text-white text-xs">
                    {photo.latitude}, {photo.longitude}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Address</p>
                  <p className="text-white text-xs">{photo.address || 'null'}</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Captured At</p>
                  <p className="text-white text-xs">
                    {new Date(photo.captured_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Created At</p>
                  <p className="text-white text-xs">
                    {new Date(photo.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-white/40 mb-1">File Name Analysis</p>
                  <div className="text-xs space-y-1">
                    <p className="text-white">
                      Type: {typeof photo.file_name}
                    </p>
                    <p className="text-white">
                      Length: {photo.file_name?.length || 0} chars
                    </p>
                    <p className="text-white">
                      Starts with http: {photo.file_name?.startsWith('http') ? '✅ Yes' : '❌ No'}
                    </p>
                    <p className="text-white">
                      Starts with data:image: {photo.file_name?.startsWith('data:image') ? '✅ Yes' : '❌ No'}
                    </p>
                    <p className="text-white">
                      Starts with file://: {photo.file_name?.startsWith('file://') ? '✅ Yes' : '❌ No'}
                    </p>
                    <p className="text-white">
                      Contains '/': {photo.file_name?.includes('/') ? '✅ Yes' : '❌ No'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Files */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Storage Bucket Files ({storageFiles.length})
        </h2>
        <div className="space-y-4">
          {storageFiles.length === 0 ? (
            <div className="glass-card p-6">
              <p className="text-white/60">No files found in storage bucket</p>
            </div>
          ) : (
            storageFiles.map((file) => (
              <div
                key={file.id}
                className="glass-card p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/40 mb-1">Name</p>
                    <p className="text-[#e9d5ff] font-mono break-all">{file.name}</p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-1">ID</p>
                    <p className="text-white font-mono text-xs">{file.id}</p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-1">Created At</p>
                    <p className="text-white text-xs">
                      {new Date(file.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-1">Updated At</p>
                    <p className="text-white text-xs">
                      {new Date(file.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-white/40 mb-1">Metadata</p>
                    <pre className="text-white text-xs font-mono overflow-x-auto">
                      {JSON.stringify(file.metadata, null, 2)}
                    </pre>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-white/40 mb-1">Public URL</p>
                    <p className="text-[#e9d5ff] font-mono text-xs break-all">
                      {supabase.storage.from('photos').getPublicUrl(file.name).data.publicUrl}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comparison */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Database vs Storage Comparison
        </h2>
        <div className="glass-card p-6">
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-white/40 mb-2">Database file_name values:</p>
              <ul className="space-y-1">
                {photos.slice(0, 5).map((photo) => (
                  <li key={photo.id} className="text-[#e9d5ff] font-mono text-xs">
                    {photo.file_name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white/40 mb-2">Storage bucket file names:</p>
              <ul className="space-y-1">
                {storageFiles.slice(0, 5).map((file) => (
                  <li key={file.id} className="text-[#e9d5ff] font-mono text-xs">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white/40 mb-2">Match Analysis:</p>
              <p className="text-white">
                Database records: {photos.length}
              </p>
              <p className="text-white">
                Storage files: {storageFiles.length}
              </p>
              <p className="text-white">
                Matches: {photos.filter(p =>
                  storageFiles.some(f => f.name === p.file_name)
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
