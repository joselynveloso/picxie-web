'use client';

import { supabase } from '@/lib/supabase';
import { Project, Site } from '@/types/database';
import MainLayout from '@/components/MainLayout';
import ProjectCard from '@/components/ProjectCard';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';

type ProjectWithSiteAndCount = {
  project: Project;
  site: Site;
  photoCount: number;
};

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');
  const [projects, setProjects] = useState<ProjectWithSiteAndCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [activeTab]);

  async function fetchProjects() {
    setLoading(true);

    try {
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*, sites(*)')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (!projectsData) {
        setProjects([]);
        return;
      }

      // Get photo counts
      const projectsWithCounts = await Promise.all(
        (projectsData as any[]).map(async (project) => {
          const { count } = await supabase
            .from('photos')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id);

          return {
            project: {
              id: project.id,
              name: project.name,
              site_id: project.site_id,
              status: project.status,
              created_at: project.created_at,
              completed_at: project.completed_at,
            } as Project,
            site: project.sites as unknown as Site,
            photoCount: count || 0,
          };
        })
      );

      setProjects(projectsWithCounts);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout title="Projects">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('Active')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'Active'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab('Completed')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'Completed'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading projects..." />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(({ project, site, photoCount }) => (
            <ProjectCard
              key={project.id}
              project={project}
              site={site}
              photoCount={photoCount}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title={`No ${activeTab.toLowerCase()} projects`}
          description={`${activeTab} projects will appear here.`}
        />
      )}
    </MainLayout>
  );
}
