'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  async function handleRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: email,
      password: formData.get('password')
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Registration failed')
      }

      if (typeof email === 'string') {
        setUserEmail(email)
        setShowVerification(true)
      } else {
        throw new Error('Invalid email format')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsVerifying(true)
    setError('')

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          otp: verificationCode
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      // Now that email is verified, redirect to login
      router.push('/login?verified=true')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed')
    } finally {
      setIsVerifying(false)
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
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {showVerification ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
              <p className="mb-4">
                We've sent a verification code to <strong>{userEmail}</strong>
              </p>
              <form onSubmit={handleVerification} className="mt-6">
                <div className="mb-4">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-2 text-center text-2xl tracking-widest rounded-md border border-gray-300"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
              <p className="mt-4 text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={() => setShowVerification(false)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Try signing up again
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Create your account</h2>
              <form onSubmit={handleRegistration}>
                <div className="input-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    required
                  />
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
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <p className="mt-4 text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-600 hover:text-orange-700">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
