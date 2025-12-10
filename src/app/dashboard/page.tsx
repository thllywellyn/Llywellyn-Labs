'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
}

interface File {
  id: string
  name: string
  url: string
  createdAt: string
  project: {
    title: string
  }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, filesRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/files?limit=5')
        ])

        const [projectsData, filesData] = await Promise.all([
          projectsRes.json(),
          filesRes.json()
        ])

        setProjects(projectsData)
        setFiles(filesData)
        
        // Calculate stats
        setStats({
          totalProjects: projectsData.length,          activeProjects: projectsData.filter((p: Project) => p.status === 'PENDING').length,
          completedProjects: projectsData.filter((p: Project) => p.status === 'COMPLETED').length,
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  return (
    <section className="dashboard">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="preloader">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="content-header">
              <h1>Overview</h1>
              <div className="header-actions">
                <Link href="/dashboard/projects" className="create-button">View All Projects</Link>
              </div>
            </div>

            {/* Quick stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><i className="bx bxs-briefcase"></i></div>
                <div className="stat-content">
                  <h3>Total Projects</h3>
                  <p>{stats.totalProjects}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon"><i className="bx bxs-time-five"></i></div>
                <div className="stat-content">
                  <h3>Active</h3>
                  <p>{stats.activeProjects}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon"><i className="bx bxs-check-shield"></i></div>
                <div className="stat-content">
                  <h3>Completed</h3>
                  <p>{stats.completedProjects}</p>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="projects-grid" style={{ marginTop: '2.4rem' }}>
              {projects.slice(0, 6).map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <div>
                      <span className={`status-badge ${project.status === 'PENDING' ? 'pending' : project.status === 'COMPLETED' ? 'completed' : 'in-progress'}`}>
                        {project.status.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="project-description">{project.description}</div>

                  <div className="project-meta">
                    <div className="project-stats">
                      <div className="stat"><i className="bx bx-calendar"></i> {new Date(project.createdAt).toLocaleDateString()}</div>
                    </div>
                    <Link href={`/dashboard/projects/${project.id}`} className="view-details">View Details <i className="bx bx-right-arrow-alt"></i></Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Files */}
            {files.length > 0 && (
              <>
                <h2 className="section-title" style={{ marginTop: '3.2rem' }}>Recent Files</h2>
                <div className="files-grid">
                  {files.map((file) => (
                    <div key={file.id} className={`file-card`}>
                      <div className="file-icon">
                        <i className="bx bxs-file-blank"></i>
                        <input type="checkbox" aria-label={`Select ${file.name}`} />
                      </div>
                      <div className="file-info">
                        <h3>{file.name}</h3>
                        <a className="project-link">{file.project?.title}</a>
                      </div>
                      <div className="file-meta">
                        <div className="file-actions">
                          <a href={file.url} className="view-details">Download</a>
                        </div>
                        <div className="file-date">{new Date(file.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  )
}
