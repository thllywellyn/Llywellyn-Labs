'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import PublicLayout from '@/components/layouts/PublicLayout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="preloader">
        <div className="loader"></div>
      </div>
    )
  }
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <PublicLayout>
      <div className="dashboard-container">
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'active' : ''}`}>
          <nav className="dashboard-nav">
            <Link href="/dashboard" className="dashboard-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <i className='bx bxs-dashboard'></i>
              Overview
            </Link>
            <Link href="/dashboard/projects" className="dashboard-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <i className='bx bxs-briefcase'></i>
              Projects
            </Link>
            <Link href="/dashboard/files" className="dashboard-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <i className='bx bxs-file'></i>
              Files
            </Link>
            <Link href="/dashboard/onboarding" className="dashboard-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <i className='bx bxs-user-plus'></i>
              Onboarding
            </Link>
            
            {/* Terms and Conditions link */}
            <Link href="/terms" className="dashboard-nav-item terms-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <i className='bx bxs-book-content'></i>
              Terms & Conditions
            </Link>
          </nav>
        </aside>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleSidebar}
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
