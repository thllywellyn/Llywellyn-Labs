'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import AuthModal from '../AuthModal'
import { useSession, signOut } from 'next-auth/react'

interface PublicLayoutProps {
  children: ReactNode
  hideFooter?: boolean
}

export default function PublicLayout({ children, hideFooter = false }: PublicLayoutProps) {
  const { data: session } = useSession()
  const [theme, setTheme] = useState('dark')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'login') {
      setIsAuthModalOpen(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  return (
    <div data-theme={theme}>
      {isAuthModalOpen && (
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      )}

      <header className={`header${isScrolled ? ' scrolled' : ''}`}>
        <Link href="/" className="logo">
          <Image
            src={
              theme === 'dark'
                ? '/assets/LLYWELLYN LABS WHITE.png'
                : '/assets/LLYWELLYN LABS BLACK.png'
            }
            alt="Llywellyn Labs"
            width={180}
            height={43}
            className="w-auto h-auto"
          />
        </Link>

        <nav
          className={`navbar ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${mobileMenuOpen ? 'active' : ''
            }`}
        >
          <Link href="/#home" className="hover:text-orange-500 transition-colors">
            Home
          </Link>
          <Link href="/#services" className="hover:text-orange-500 transition-colors">
            Services
          </Link>
          <Link href="/#portfolio" className="hover:text-orange-500 transition-colors">
            Portfolio
          </Link>
          <Link href="/#contact" className="hover:text-orange-500 transition-colors">
            Contact
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-orange-500 transition-colors">
                Dashboard
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-orange-500 transition-colors">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() =>
                  signOut({
                    callbackUrl: `${window.location.origin}/`,
                  })
                }
                className="login-btn bg-orange-600 hover:bg-orange-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="login-btn bg-orange-600 hover:bg-orange-700"
            >
              Login
            </button>
          )}
        </nav>

        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            className="menu-icon-container"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >            <div className={`icon-menu ${mobileMenuOpen ? 'icon-hidden' : ''}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </div>
            <div className={`icon-close ${mobileMenuOpen ? '' : 'icon-hidden'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          </button>
        </div>
      </header>

      <main>{children}</main>

      {!hideFooter && !isDashboard && (
        <footer className="footer">
          <div className="social">
            <a
              href="https://www.instagram.com/thllywellyn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="bx bxl-instagram-alt"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/thllywellyn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="bx bxl-linkedin-square"></i>
            </a>
            <a
              href="https://x.com/thllywellyn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <i className="bx bxl-twitter"></i>
            </a>
            <a
              href="https://github.com/thllywellyn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <i className="bx bxl-github"></i>
            </a>
          </div>
          <div className="footer-text">
            <Link href="/terms" className="hover:text-gray-300 mr-4">
              Terms & Conditions
            </Link>
            <p>© {new Date().getFullYear()} Llywellyn Labs | All rights reserved</p>
          </div>
        </footer>
      )}
    </div>
  )
}
