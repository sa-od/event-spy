'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useProjects, useCreateProject, useDeleteProject } from '@/hooks/useApi';

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    await createProject.mutateAsync({ name, domain });
    setName('');
    setDomain('');
    setShowModal(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this project and all its events?')) {
      await deleteProject.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Create Project
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : projects?.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500">No projects yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects?.map((project) => (
              <div
                key={project._id}
                onClick={() => router.push(`/dashboard/${project._id}`)}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-sm dark:hover:shadow-lg dark:hover:shadow-indigo-500/5 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{project.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{project.domain}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(project._id, e)}
                    className="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {project.eventCount?.toLocaleString() || 0} events
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-600">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Project</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                  <input
                    id="project-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="My Website"
                  />
                </div>
                <div>
                  <label htmlFor="project-domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domain</label>
                  <input
                    id="project-domain"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="example.com"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createProject.isPending}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {createProject.isPending ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
