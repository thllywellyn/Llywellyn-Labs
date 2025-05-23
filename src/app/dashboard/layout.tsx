'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import PublicLayout from '@/components/layouts/PublicLayout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter()

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
  return (
    <PublicLayout>
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link href="/dashboard" className="dashboard-nav-item">
              <i className='bx bxs-dashboard'></i>
              Overview
            </Link>
            <Link href="/dashboard/projects" className="dashboard-nav-item">
              <i className='bx bxs-briefcase'></i>
              Projects
            </Link>
            <Link href="/dashboard/messages" className="dashboard-nav-item">
              <i className='bx bxs-message-dots'></i>
              Messages
            </Link>
            <Link href="/dashboard/files" className="dashboard-nav-item">
              <i className='bx bxs-file'></i>
              Files
            </Link>
            <Link href="/dashboard/onboarding" className="dashboard-nav-item">
              <i className='bx bxs-user-plus'></i>
              Onboarding
            </Link>
          </nav>
        </aside>
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </PublicLayout>
  )
}
