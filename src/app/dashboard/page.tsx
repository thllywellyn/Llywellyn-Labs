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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="dashboard-section">
                <h2 className="dashboard-section-title">Recent Projects</h2>
                <div className="dashboard-list">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="dashboard-list-item">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                      <span className={`dashboard-status ${
                        project.status === 'PENDING' ? 'status-pending' : 'status-completed'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                  <Link href="/dashboard/projects" className="dashboard-view-all">
                    View All Projects →
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
