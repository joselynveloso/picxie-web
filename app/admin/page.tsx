import { supabase } from '@/lib/supabase';
import MainLayout from '@/components/MainLayout';
import StatCard from '@/components/StatCard';
import { Database, MapPin, Briefcase, Image, Users } from 'lucide-react';

async function getAdminStats() {
  const [
    { count: totalSites },
    { count: totalProjects },
    { count: totalPhotos },
    { count: totalUsers }
  ] = await Promise.all([
    supabase.from('sites').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('photos').select('*', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalSites: totalSites ?? 0,
    totalProjects: totalProjects ?? 0,
    totalPhotos: totalPhotos ?? 0,
    totalUsers: totalUsers ?? 0,
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <MainLayout title="Admin">
      {/* Database Stats */}
      <div className="mb-16">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-[0.2em] mb-8">Database Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Sites"
            value={stats.totalSites}
            icon={MapPin}
          />
          <StatCard
            title="Projects"
            value={stats.totalProjects}
            icon={Briefcase}
          />
          <StatCard
            title="Photos"
            value={stats.totalPhotos}
            icon={Image}
          />
          <StatCard
            title="Users"
            value={stats.totalUsers}
            icon={Users}
          />
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Management */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Site Management</h3>
            <button className="px-4 py-2 glass-card text-white text-sm font-medium hover:text-[#e9d5ff] transition-slow">
              Add Site
            </button>
          </div>
          <p className="text-sm text-[#666]">
            Manage sites, locations, and geofencing settings.
          </p>
        </div>

        {/* Project Management */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Project Management</h3>
            <button className="px-4 py-2 glass-card text-white text-sm font-medium hover:text-[#e9d5ff] transition-slow">
              Add Project
            </button>
          </div>
          <p className="text-sm text-[#666]">
            Create and manage projects, toggle status, and organize photo collections.
          </p>
        </div>

        {/* User Management */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">User Management</h3>
            <button className="px-4 py-2 glass-card text-white text-sm font-medium hover:text-[#e9d5ff] transition-slow">
              Manage Users
            </button>
          </div>
          <p className="text-sm text-[#666]">
            Control user access, permissions, and admin privileges.
          </p>
        </div>

        {/* Database Tools */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Database Tools</h3>
            <Database className="h-6 w-6 text-white/40" />
          </div>
          <p className="text-sm text-[#666]">
            View database health, run maintenance tasks, and export data.
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 glass-card p-6">
        <p className="text-sm text-[#666]">
          <strong className="text-white/80">Note:</strong> CRUD operations (Create, Read, Update, Delete) for sites, projects, and users will be implemented in the next phase. The buttons above are placeholders for future functionality.
        </p>
      </div>
    </MainLayout>
  );
}
