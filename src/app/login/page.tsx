'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('verified') === 'true') {
      setSuccess('Email verified successfully! You can now log in.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
        return
      }

      router.push('/dashboard')
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="text-center mb-8">
          <Image
            src="/assets/LLYWELLYN LABS WHITE.png"
            alt="Llywellyn Labs Logo"
            width={200}
            height={48}
            className="mx-auto mb-8"
          />
          <h2>Sign in to your account</h2>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="switch-auth">
            <p>
              Don't have an account?{' '}
              <Link href="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
