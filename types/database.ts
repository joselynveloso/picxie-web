export interface Site {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  folder_name: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  site_id: string;
  status: 'Active' | 'Completed';
  created_at: string;
  completed_at: string | null;
}

export interface Photo {
  id: string;
  file_name: string;
  site_id: string;
  project_id: string | null;
  latitude: number;
  longitude: number;
  address: string;
  captured_at: string;
  uploaded_at: string;
  local_uri: string | null;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

// Supabase Database Type
export interface Database {
  public: {
    Tables: {
      sites: {
        Row: Site;
        Insert: Omit<Site, 'id' | 'created_at'>;
        Update: Partial<Omit<Site, 'id' | 'created_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at'>>;
      };
      photos: {
        Row: Photo;
        Insert: Omit<Photo, 'id' | 'uploaded_at'>;
        Update: Partial<Omit<Photo, 'id' | 'uploaded_at'>>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at'>;
        Update: Partial<Omit<UserProfile, 'created_at'>>;
      };
    };
  };
}

// Extended types with relations
export interface ProjectWithSite extends Project {
  sites: Site;
}

export interface PhotoWithRelations extends Photo {
  sites: Site;
  projects: Project | null;
}
