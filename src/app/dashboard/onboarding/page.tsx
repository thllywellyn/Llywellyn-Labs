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
    'Email Consultation',
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
      <div className="onboarding-container">
        <div className="onboarding-header">
          <h2 className="onboarding-title">
            Complete Your Profile
          </h2>
          <p className="onboarding-subtitle">
            Help us understand your business better to provide tailored solutions
          </p>
        </div>

        {/* Progress Steps */}
        <div className="onboarding-progress">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`progress-step ${s <= step ? 'active' : 'inactive'}`}
            />
          ))}
        </div>

        <div className="onboarding-form">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="businessName" className="form-label">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    required
                    className="form-input"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="industry" className="form-label">
                    Industry
                  </label>
                  <select
                    id="industry"
                    required
                    className="form-select"
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
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="website" className="form-label">
                    Website (if any)
                  </label>
                  <input
                    type="url"
                    id="website"
                    className="form-input"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="businessSize" className="form-label">
                    Business Size
                  </label>
                  <select
                    id="businessSize"
                    required
                    className="form-select"
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
              <div className="form-group">
                <label className="form-label">
                  What services are you interested in?
                </label>
                <div className="chip-group">
                  {goals.map((goal) => {
                    const checked = formData.goals.includes(goal)
                    return (
                      <button
                        type="button"
                        key={goal}
                        className={`option-chip ${checked ? 'selected' : ''}`}
                        onClick={() => {
                          if (!formData.goals.includes(goal)) {
                            setFormData({ ...formData, goals: [...formData.goals, goal] })
                          } else {
                            setFormData({ ...formData, goals: formData.goals.filter((g) => g !== goal) })
                          }
                        }}
                      >
                        <span>{goal}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="form-buttons">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-previous"
                >
                  Previous
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="btn-next"
                >
                  Next
                </button>
              )}
              {step === 3 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
  )
}
