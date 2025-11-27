'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef, useCallback } from 'react'
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
  const [isRadialOpen, setIsRadialOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const radialRef = useRef<HTMLDivElement | null>(null)
  const [positions, setPositions] = useState<{left:number, top:number, tx:number, ty:number}[]>([])
  const activeItemRef = useRef<HTMLElement | null>(null)

  // Define radial items here so the layout can adapt to any number of items
  const RADIAL_ITEMS = [
    { href: '/dashboard', label: 'Overview', icon: 'bx bxs-dashboard' },
    { href: '/dashboard/projects', label: 'Projects', icon: 'bx bxs-briefcase' },
    { href: '/dashboard/files', label: 'Files', icon: 'bx bxs-file' },
    { href: '/dashboard/settings', label: 'Settings', icon: 'bx bxs-cog' },
  ]

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

  const toggleRadial = () => {
    setIsRadialOpen((v) => !v)
  }

  useEffect(() => {
    // keep body scroll when menu closed; no dynamic positioning required for simple radial
    if (!isRadialOpen) return
    // small timeout for potential animations; nothing to compute
    return undefined
  }, [isRadialOpen])

  useEffect(() => {
    const onResize = () => {
      if (isRadialOpen) {
        // No need to compute positions anymore
      }
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [isRadialOpen])

  useEffect(() => {
    if (!radialRef.current) return
    if (!isRadialOpen) {
      if (activeItemRef.current) {
        activeItemRef.current.classList.remove('active')
        activeItemRef.current = null
      }
      return
    }

    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX
      const y = e.clientY
      const el = document.elementFromPoint(x, y) as HTMLElement | null
      const item = el ? el.closest('.radial-item') as HTMLElement | null : null

      if (item && item !== activeItemRef.current) {
        if (activeItemRef.current) activeItemRef.current.classList.remove('active')
        item.classList.add('active')
        activeItemRef.current = item
        return
      }

      if (!item && activeItemRef.current) {
        activeItemRef.current.classList.remove('active')
        activeItemRef.current = null
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove as any)
      if (activeItemRef.current) {
        activeItemRef.current.classList.remove('active')
        activeItemRef.current = null
      }
    }
  }, [isRadialOpen])

  const handleToggleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleRadial()
    }
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
            {/* Onboarding removed - moved into Settings */}
            <Link href="/dashboard/settings" className="dashboard-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <i className='bx bxs-cog'></i>
              Settings
            </Link>
            
            {/* Terms and Conditions link */}
            <Link href="/terms" className="dashboard-nav-item terms-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <i className='bx bxs-book-content'></i>
              Terms & Conditions
            </Link>
          </nav>
        </aside>
        
        <button
          ref={toggleRef}
          className="mobile-menu-toggle"
          onClick={toggleRadial}
          onKeyDown={handleToggleKey}
          aria-expanded={isRadialOpen}
          aria-controls="radial-menu"
          aria-label={isRadialOpen ? 'Close quick menu' : 'Open quick menu'}
        >
          <i className={`bx ${isRadialOpen ? 'bx-x' : 'bx-menu'}`}></i>
        </button>

        {/* Radial quick-menu for mobile: full-viewport container so items can be positioned reliably */}
        <div
          id="radial-menu"
          ref={radialRef}
          className={`radial-menu ${isRadialOpen ? 'open' : ''}`}
          aria-hidden={!isRadialOpen}
        >
          {RADIAL_ITEMS.map((it, i) => (
            <Link
              key={it.href + i}
              href={it.href}
              className={`radial-item pos${i+1}`}
              onClick={() => setIsRadialOpen(false)}
              aria-label={it.label}
            >
              <i className={it.icon}></i>
              <span className="radial-label">{it.label}</span>
            </Link>
          ))}

          {/* Labels are shown inline by toggling the 'active' class on .radial-item */}
        </div>
        
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </PublicLayout>
  )
}
