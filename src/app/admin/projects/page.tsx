'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { formatDate } from '@/lib/utils'

interface Project {
  id: string
  title: string
  description: string
  status: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
}

export default function AdminProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      setError('Failed to load projects')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/projects/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update project status')
      
      // Update local state
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, status: newStatus } : project
      ))
    } catch (err) {
      setError('Failed to update project status')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-color"></div>
      </div>
    )
  }

  return (
    <div className="admin-projects">
      <div className="admin-header">
        <h1>Project Management</h1>
        <p>Monitor and manage all client projects</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4">Project</th>
                <th className="text-left p-4">Client</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Created</th>
                <th className="text-left p-4">Last Updated</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-gray-500">{project.description}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div>{project.user.name}</div>
                      <div className="text-sm text-gray-500">{project.user.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(project.id, e.target.value)}
                      className="form-select text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ON_HOLD">On Hold</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="p-4">
                    {formatDate(project.updatedAt)}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => {
                        setSelectedProject(project)
                        setShowEditModal(true)
                      }}
                      className="text-sm text-main-color hover:text-main-color-dark mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => window.location.href = `/dashboard/projects/${project.id}`}
                      className="text-sm text-main-color hover:text-main-color-dark"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
            {/* Add edit form here */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle save
                  setShowEditModal(false)
                }}
                className="px-4 py-2 bg-main-color text-white rounded hover:bg-main-color-dark"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
