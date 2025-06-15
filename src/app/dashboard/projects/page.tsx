'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  files: Array<{
    id: string
    name: string
    url: string
  }>
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <h1>Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="create-button"
        >
          <i className='bx bx-plus'></i>
          New Project
        </Link>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.title}</h3>
              <span className={`status-badge ${project.status.toLowerCase()}`}>
                {project.status}
              </span>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-stats">
              <div className="stat">
                <i className='bx bx-file'></i>
                <span>{project.files.length} Files</span>
              </div>
            </div>

            <div className="project-meta">
              <span className="date">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button className="view-details">
                  View Details
                  <i className='bx bx-right-arrow-alt'></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
