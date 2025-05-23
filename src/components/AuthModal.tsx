'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    } else {
      setResendDisabled(false)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
          callbackUrl: '/',
          remember: rememberMe,
        })

        if (result?.error) {
          setError('Invalid credentials')
        } else {
          setSuccess('Successfully logged in!')
          setTimeout(() => {
            onClose()
          }, 1500)
        }
      } else {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        setUserEmail(formData.email)
        setShowVerification(true)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          otp: verificationCode,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setSuccess('Email verified successfully! You can now log in.')
      setShowVerification(false)
      setIsLogin(true)
      setFormData({ firstName: '', lastName: '', email: '', password: '' })
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setResendDisabled(true)
    setResendTimer(60) // 60 second cooldown

    try {
      const res = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend verification code')
      }

      setSuccess('Verification code resent successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code')
      setResendDisabled(false)
      setResendTimer(0)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="close-button"
          aria-label="Close"
        >
          ×
        </button>
        
        <h2>{showVerification ? 'Verify Email' : (isLogin ? 'Login' : 'Sign Up')}</h2>

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {showVerification ? (
          <form onSubmit={handleVerification}>
            <p className="text-center mb-4">
              We've sent a verification code to <strong>{userEmail}</strong>
            </p>
            <div className="form-group">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="verification-input"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
            </div>
            <button type="submit" disabled={loading || verificationCode.length !== 6}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <div className="form-footer">
              Didn't receive the code?{" "}
              <button 
                type="button" 
                onClick={handleResendCode}
                disabled={resendDisabled}
              >
                Resend code {resendTimer > 0 ? `(${resendTimer}s)` : ''}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {isLogin && (
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
        )}

        <div className="form-footer">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
