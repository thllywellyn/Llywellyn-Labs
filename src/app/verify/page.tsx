'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function VerifyEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      // Redirect to login page after successful verification
      router.push('/login?verified=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <p className="text-red-600 text-lg">Invalid verification link</p>
            <button
              onClick={() => router.push('/signup')}
              className="mt-4 text-orange-600 hover:text-orange-700"
            >
              Go back to sign up
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Image
            src="/assets/LLYWELLYN LABS WHITE.png"
            alt="Llywellyn Labs Logo"
            width={200}
            height={48}
            className="mx-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div>
            <label htmlFor="otp" className="sr-only">
              Verification Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-center text-2xl tracking-widest"
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                if (value.length <= 6) {
                  setOtp(value)
                }
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="text-orange-600 hover:text-orange-700"
              >
                Try signing up again
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
