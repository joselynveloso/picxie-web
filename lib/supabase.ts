import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Use environment variables with fallback to hardcoded values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ampxyzotiiqmwcwsdfut.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHh5em90aWlxbXdjd3NkZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzcwNTEsImV4cCI6MjA3ODA1MzA1MX0.sicapw4FxmgfVWK0GnfJS2KIZKUB8gkVAxHL4yRxtK8';

// Validate that we have the required configuration
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Get the public URL for a photo from Supabase Storage
 * @param fileName - The file name stored in the photos table
 * @param localUri - Optional local_uri field (for mobile photos)
 * @returns The public URL to access the image, or empty string if not available
 */
export function getPhotoUrl(fileName: string, localUri?: string | null): string {
  console.log('=== PHOTO DEBUG ===');
  console.log('Filename from DB:', fileName);
  console.log('Local URI from DB:', localUri);
  console.log('Filename type:', typeof fileName);
  console.log('Filename length:', fileName?.length);

  if (!fileName) {
    console.warn('⚠️ getPhotoUrl called with empty fileName');
    return '';
  }

  // Check if this is a mobile-only photo (has local_uri starting with file://)
  if (localUri && localUri.startsWith('file://')) {
    console.warn('⚠️ Mobile-only photo detected - file not available in cloud storage');
    console.log('   Local URI:', localUri);
    console.log('   ℹ️ This photo was captured on mobile and not uploaded to Supabase Storage');
    return ''; // Return empty - PhotoImage component will show placeholder
  }

  // Check if it's a full URL already
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    console.log('✅ Already a full URL:', fileName);
    return fileName;
  }

  // Check if it's base64 data
  if (fileName.startsWith('data:image')) {
    console.log('✅ Base64 image detected, length:', fileName.length);
    return fileName;
  }

  // Check if it's a file:// URL (legacy mobile format)
  if (fileName.startsWith('file://')) {
    console.warn('⚠️ File URL detected in fileName (mobile local path), cannot display:', fileName);
    return '';
  }

  // Otherwise build storage URL (for web-uploaded photos)
  const { data } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  console.log('🔗 Built storage URL:', data.publicUrl);
  console.log('   - Bucket: photos');
  console.log('   - Path used:', fileName);
  console.log('   - ℹ️ This should be a web-uploaded photo');

  return data.publicUrl;
}

/**
 * Check if a photo exists in storage
 * @param fileName - The file name to check
 * @returns Promise<boolean> - true if the file exists
 */
export async function checkPhotoExists(fileName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from('photos')
      .list('', {
        search: fileName
      });

    if (error) {
      console.error('Error checking photo existence:', error);
      return false;
    }

    return data.length > 0;
  } catch (error) {
    console.error('Error in checkPhotoExists:', error);
    return false;
  }
}

/**
 * Try to find the correct path for a photo by testing common patterns
 * @param fileName - The base file name
 * @param userId - Optional user ID to try user-specific paths
 * @returns Promise<string | null> - The working path or null if not found
 */
export async function findPhotoPath(fileName: string, userId?: string): Promise<string | null> {
  console.log('🔍 Searching for photo path:', fileName);

  // List of possible path patterns to try
  const pathsToTry = [
    fileName,                          // Just the filename
    `${fileName}`,                     // Filename with leading slash
    `photos/${fileName}`,              // In photos subfolder
    `public/${fileName}`,              // In public subfolder
  ];

  // Add user-specific paths if userId provided
  if (userId) {
    pathsToTry.push(
      `${userId}/${fileName}`,
      `users/${userId}/${fileName}`,
      `${userId}/photos/${fileName}`
    );
  }

  console.log('   Trying paths:', pathsToTry);

  for (const path of pathsToTry) {
    try {
      // Try to get file metadata to check if it exists
      const { data, error } = await supabase.storage
        .from('photos')
        .list(path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '', {
          search: path.includes('/') ? path.substring(path.lastIndexOf('/') + 1) : path
        });

      if (!error && data && data.length > 0) {
        console.log('✅ Found photo at path:', path);
        return path;
      }
    } catch (err) {
      // Continue to next path
      continue;
    }
  }

  console.warn('❌ Photo not found in any path pattern');
  return null;
}
