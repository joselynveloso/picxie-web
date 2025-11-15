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
 * @returns The public URL to access the image
 */
export function getPhotoUrl(fileName: string): string {
  if (!fileName) {
    console.warn('getPhotoUrl called with empty fileName');
    return '';
  }

  const { data } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  console.log('Photo URL generated:', {
    fileName,
    url: data.publicUrl,
    bucket: 'photos'
  });

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
