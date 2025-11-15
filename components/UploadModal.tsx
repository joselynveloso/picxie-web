'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, MapPin, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Site, Project } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import exifr from 'exifr';

interface UploadModalProps {
  onClose: () => void;
}

interface FileWithPreview {
  file: File;
  preview: string;
  exif?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch sites and projects on mount
  useEffect(() => {
    const fetchData = async () => {
      const [sitesResult, projectsResult] = await Promise.all([
        supabase.from('sites').select('*').order('name'),
        supabase.from('projects').select('*').eq('status', 'Active').order('name'),
      ]);

      if (sitesResult.data) setSites(sitesResult.data as Site[]);
      if (projectsResult.data) setProjects(projectsResult.data as Project[]);
    };

    fetchData();

    // Escape key to close
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

  // Extract EXIF data from image
  const extractExifData = async (file: File) => {
    try {
      const exifData = await exifr.parse(file, {
        gps: true,
        pick: ['latitude', 'longitude', 'DateTimeOriginal'],
      });

      if (exifData?.latitude && exifData?.longitude) {
        // You could add reverse geocoding here to get address
        return {
          latitude: exifData.latitude,
          longitude: exifData.longitude,
        };
      }
    } catch (error) {
      console.error('EXIF extraction error:', error);
    }
    return undefined;
  };

  // Handle file selection
  const handleFiles = async (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter(file =>
      file.type.startsWith('image/')
    );

    const filesWithPreviews = await Promise.all(
      newFiles.map(async (file) => {
        const preview = URL.createObjectURL(file);
        const exif = await extractExifData(file);

        return {
          file,
          preview,
          exif,
        };
      })
    );

    setFiles(prev => [...prev, ...filesWithPreviews]);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  // File input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Remove file from list
  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) return;
    if (!selectedSite && !selectedProject) {
      setErrorMessage('Please select a site or project');
      return;
    }

    setUploading(true);
    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const totalFiles = files.length;
      let uploadedCount = 0;

      for (const fileWithPreview of files) {
        const { file, exif } = fileWithPreview;
        const fileName = `${Date.now()}-${file.name}`;

        // Upload to Supabase Storage
        const { error: storageError } = await supabase.storage
          .from('photos')
          .upload(fileName, file);

        if (storageError) {
          throw new Error(`Storage upload failed: ${storageError.message}`);
        }

        // Create database record
        const { error: dbError } = await supabase.from('photos').insert({
          file_name: fileName,
          site_id: selectedSite || null,
          project_id: selectedProject || null,
          user_id: user?.id || null,
          latitude: exif?.latitude || 0,
          longitude: exif?.longitude || 0,
          address: exif?.address || null,
          captured_at: new Date().toISOString(),
        } as any);

        if (dbError) {
          throw new Error(`Database insert failed: ${dbError.message}`);
        }

        uploadedCount++;
        setUploadProgress((uploadedCount / totalFiles) * 100);
      }

      setUploadStatus('success');
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to show new photos
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="w-full max-w-4xl glass-card p-8 animate-fade-in"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Upload Photos</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-slow"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <X className="h-5 w-5 text-white/80" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-6 p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragging ? 'border-[#e9d5ff] bg-[#e9d5ff]/5' : 'border-white/20'
          }`}
          style={{
            background: isDragging ? 'rgba(233, 213, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <Upload className={`h-12 w-12 ${isDragging ? 'text-[#e9d5ff]' : 'text-white/40'}`} />
            <div className="text-center">
              <p className="text-white text-lg mb-2">
                {isDragging ? 'Drop files here' : 'Drag & drop photos here'}
              </p>
              <p className="text-[#666] text-sm">or click to browse</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* File previews */}
        {files.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-white/60 uppercase tracking-widest mb-4">
              {files.length} {files.length === 1 ? 'Photo' : 'Photos'} Selected
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((fileWithPreview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <img
                    src={fileWithPreview.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                  {fileWithPreview.exif && (
                    <div className="absolute bottom-2 left-2">
                      <MapPin className="h-3 w-3 text-[#e9d5ff]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Site and Project selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-white/60 uppercase tracking-widest mb-2">
              Site (Optional)
            </label>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#e9d5ff] focus:outline-none transition-colors"
            >
              <option value="">Select a site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id} className="bg-[#0a0a0a]">
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 uppercase tracking-widest mb-2">
              Project (Optional)
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#e9d5ff] focus:outline-none transition-colors"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id} className="bg-[#0a0a0a]">
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Uploading...</span>
              <span className="text-sm text-white/60">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, #e9d5ff, #c4b5fd)',
                }}
              />
            </div>
          </div>
        )}

        {/* Status messages */}
        {uploadStatus === 'success' && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ background: 'rgba(233, 213, 255, 0.1)', border: '1px solid rgba(233, 213, 255, 0.2)' }}>
            <Check className="h-5 w-5 text-[#e9d5ff]" />
            <span className="text-white">Upload successful!</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ background: 'rgba(255, 100, 100, 0.1)', border: '1px solid rgba(255, 100, 100, 0.2)' }}>
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-white">{errorMessage}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg text-white font-medium transition-slow"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading || (!selectedSite && !selectedProject)}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-slow disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: files.length > 0 && (selectedSite || selectedProject) && !uploading
                ? 'rgba(233, 213, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(233, 213, 255, 0.3)',
              color: files.length > 0 && (selectedSite || selectedProject) && !uploading ? '#e9d5ff' : '#666',
            }}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length > 0 ? files.length : ''} ${files.length === 1 ? 'Photo' : 'Photos'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
