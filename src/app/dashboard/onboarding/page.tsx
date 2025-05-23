'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface BusinessDetails {
  businessName: string
  industry: string
  website: string
  businessSize: string
  goals: string[]
}

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<BusinessDetails>({
    businessName: '',
    industry: '',
    website: '',
    businessSize: '',
    goals: []
  })

  const industries = [
    'E-commerce',
    'Technology',
    'Healthcare',
    'Education',
    'Finance',
    'Real Estate',
    'Retail',
    'Other'
  ]

  const businessSizes = [
    'Solo',
    '2-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201+ employees'
  ]

  const goals = [
    'Website Development',
    'Social Media Management',
    'Domain Management',
    'Email Solutions',
    'SEO Optimization',
    'Digital Marketing',
    'Brand Development'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/client/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save client details')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving client details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Help us understand your business better to provide tailored solutions
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full mx-2 ${
                  s <= step ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center mt-2 text-sm text-gray-500">
            Step {step} of 3
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    Industry
                  </label>
                  <select
                    id="industry"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  >
                    <option value="">Select an industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website (if any)
                  </label>
                  <input
                    type="url"
                    id="website"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="businessSize" className="block text-sm font-medium text-gray-700">
                    Business Size
                  </label>
                  <select
                    id="businessSize"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    value={formData.businessSize}
                    onChange={(e) => setFormData({ ...formData, businessSize: e.target.value })}
                  >
                    <option value="">Select business size</option>
                    {businessSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What services are you interested in?
                </label>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal} className="flex items-center">
                      <input
                        type="checkbox"
                        id={goal}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        checked={formData.goals.includes(goal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              goals: [...formData.goals, goal],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              goals: formData.goals.filter((g) => g !== goal),
                            })
                          }
                        }}
                      />
                      <label htmlFor={goal} className="ml-3 text-sm text-gray-700">
                        {goal}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Previous
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Next
                </button>
              )}
              {step === 3 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
