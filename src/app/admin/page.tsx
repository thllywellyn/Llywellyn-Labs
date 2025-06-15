'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Stats {
  totalUsers: number
  totalProjects: number
  totalMessages: number
  activeUsers: number
}

interface RecentActivity {
  id: string
  type: 'USER_JOINED' | 'PROJECT_CREATED' | 'MESSAGE_SENT'
  description: string
  timestamp: string
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProjects: 0,
    totalMessages: 0,
    activeUsers: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await fetch('/api/admin/stats')
        const statsData = await statsRes.json()
        setStats(statsData)

        // Fetch recent activity
        const activityRes = await fetch('/api/admin/activity')
        const activityData = await activityRes.json()
        setRecentActivity(activityData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-color"></div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, {session?.user?.name}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-project-diagram"></i>
          </div>
          <div className="stat-content">
            <h3>Total Projects</h3>
            <p>{stats.totalProjects}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="stat-content">
            <h3>Total Messages</h3>
            <p>{stats.totalMessages}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-clock"></i>
          </div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p>{stats.activeUsers}</p>
          </div>
        </div>
      </div>

      <div className="admin-content-grid">
        <div className="admin-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'USER_JOINED' && <i className="fas fa-user-plus"></i>}
                  {activity.type === 'PROJECT_CREATED' && <i className="fas fa-folder-plus"></i>}
                  {activity.type === 'MESSAGE_SENT' && <i className="fas fa-paper-plane"></i>}
                </div>
                <div className="activity-content">
                  <p>{activity.description}</p>
                  <span className="activity-time">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-button">
              <i className="fas fa-user-plus"></i>
              Add New User
            </button>
            <button className="action-button">
              <i className="fas fa-folder-plus"></i>
              Create Project
            </button>
            <button className="action-button">
              <i className="fas fa-envelope"></i>
              Send Message
            </button>
            <button className="action-button">
              <i className="fas fa-cog"></i>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
