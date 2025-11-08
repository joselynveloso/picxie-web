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
    <MainLayout title="Admin Panel">
      {/* Database Stats */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sites"
            value={stats.totalSites}
            icon={MapPin}
          />
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={Briefcase}
          />
          <StatCard
            title="Total Photos"
            value={stats.totalPhotos}
            icon={Image}
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
          />
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Management */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Site Management</h3>
            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Add Site
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Manage construction sites, locations, and geofencing settings.
          </p>
        </div>

        {/* Project Management */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Project Management</h3>
            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Add Project
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Create and manage projects, toggle status, and organize photo collections.
          </p>
        </div>

        {/* User Management */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Manage Users
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Control user access, permissions, and admin privileges.
          </p>
        </div>

        {/* Database Tools */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Database Tools</h3>
            <Database className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            View database health, run maintenance tasks, and export data.
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 bg-gray-100 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> CRUD operations (Create, Read, Update, Delete) for sites, projects, and users will be implemented in the next phase. The buttons above are placeholders for future functionality.
        </p>
      </div>
    </MainLayout>
  );
}
