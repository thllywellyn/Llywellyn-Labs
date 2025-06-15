'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import PublicLayout from '@/components/layouts/PublicLayout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (status !== 'loading') {
      if (status === 'unauthenticated') {
        router.replace('/?auth=login')
      } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
        router.replace('/dashboard')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-color"></div>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
    return (
      <PublicLayout hideFooter>
        <div className="dashboard-container">
          <aside className={`dashboard-sidebar ${isSidebarOpen ? 'active' : ''}`}>
            <nav className="dashboard-nav">
              <Link href="/admin" className="dashboard-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <i className='bx bxs-dashboard'></i>
                Dashboard
              </Link>
              <Link href="/admin/users" className="dashboard-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <i className='bx bxs-user'></i>
                Users
              </Link>
              <Link href="/admin/projects" className="dashboard-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <i className='bx bxs-briefcase'></i>
                Projects
              </Link>
              <Link href="/admin/settings" className="dashboard-nav-item" onClick={() => setIsSidebarOpen(false)}>
                <i className='bx bxs-cog'></i>
                Settings
              </Link>
            </nav>
          </aside>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            <i className={`bx ${isSidebarOpen ? 'bx-x' : 'bx-menu'}`}></i>
          </button>
          
          <main className="dashboard-main">
            {children}
          </main>
        </div>
      </PublicLayout>
    )
  }

  return null
}
