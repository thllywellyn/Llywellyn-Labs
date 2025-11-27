'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import '@/styles/profile-settings.css'

interface UserProfile {
  id: string
  name: string
  email: string
  displayName: string | null
  profileImage: string | null
  bio: string | null
  phone: string | null
  companyName: string | null
  jobTitle: string | null
  website: string | null
  businessName?: string | null
  industry?: string | null
  businessSize?: string | null
  goals?: string[] | null
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
  linkedin: string | null
  twitter: string | null
  instagram: string | null
  github: string | null
  emailNotifications: boolean
  marketingEmails: boolean
}

export default function ProfileSettingsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [activeTab, setActiveTab] = useState<'personal' | 'business' | 'contact' | 'social' | 'preferences'>('personal')
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

  const goalsList = [
    'Website Development',
    'Social Media Management',
    'Domain Management',
    'Email Consultation',
    'SEO Optimization',
    'Digital Marketing',
    'Brand Development'
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data)
      if (data.profileImage) {
        setPreviewImage(data.profileImage)
      }
    } catch (err) {
      setError('Failed to load profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProfileImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload image
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload image')
      const result = await response.json()

      setProfile((prev) =>
        prev ? {
          ...prev,
          profileImage: result.url,
          profileImagePublicId: result.publicId,
        } : null
      )

      setSuccess('Profile image updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to upload image')
      console.error(err)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save profile')
      }

      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => prev ? { ...prev, [field]: value } : null)
  }

  if (loading) {
    return (
      <div className="profile-settings">
        <div className="preloader">
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-settings">
        <div className="error-message">Failed to load profile</div>
      </div>
    )
  }

  return (
    <div className="profile-settings">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your personal information and preferences</p>
      </div>

      <div className="profile-container">
        {/* Profile Image Section */}
        <div className="profile-image-section">
          <div className="image-preview">
            {previewImage ? (
              <img src={previewImage} alt="Profile" />
            ) : (
              <div className="placeholder">
                <i className='bx bxs-user-circle'></i>
              </div>
            )}
          </div>
          <div className="image-controls">
            <label htmlFor="profile-image" className="upload-btn">
              {uploadingImage ? 'Uploading...' : 'Change Photo'}
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                style={{ display: 'none' }}
              />
            </label>
            <p className="help-text">Max 5MB. JPG, PNG supported</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button
            className={`tab-btn ${activeTab === 'business' ? 'active' : ''}`}
            onClick={() => setActiveTab('business')}
          >
            Business
          </button>
          <button
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact & Address
          </button>
          <button
            className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            Social Links
          </button>
          <button
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>

        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Form Content */}
        <div className="form-content">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={profile.displayName || ''}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="How you want to be known"
                />
                <p className="field-hint">Leave blank to use your full name</p>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
                <p className="field-hint">Max 500 characters</p>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
                <p className="field-hint">You'll need to verify any email changes</p>
              </div>
            </div>
          )}

          {/* Contact & Address Tab */}
          {activeTab === 'business' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Business Name</label>
                <input
                  type="text"
                  value={profile.businessName || ''}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Your business or project name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Industry</label>
                  <select
                    value={profile.industry || ''}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  >
                    <option value="">Select industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Business Size</label>
                  <select
                    value={profile.businessSize || ''}
                    onChange={(e) => handleInputChange('businessSize', e.target.value)}
                  >
                    <option value="">Select size</option>
                    {businessSizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Services Interested In</label>
                <div className="chip-group">
                  {goalsList.map((g) => {
                    const checked = (profile.goals || []).includes(g)
                    return (
                      <button
                        type="button"
                        key={g}
                        className={`option-chip ${checked ? 'selected' : ''}`}
                        onClick={() => {
                          const current = Array.isArray(profile.goals) ? profile.goals.slice() : []
                          const idx = current.indexOf(g)
                          if (idx === -1) {
                            current.push(g)
                          } else {
                            current.splice(idx, 1)
                          }
                          handleInputChange('goals', current)
                        }}
                      >
                        <span>{g}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'contact' && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={profile.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your company"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={profile.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="Your position"
                  />
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={profile.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <h3>Address</h3>

              <div className="form-group">
                <label>Address Line 1</label>
                <input
                  type="text"
                  value={profile.addressLine1 || ''}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  value={profile.addressLine2 || ''}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={profile.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label>State/Province</label>
                  <input
                    type="text"
                    value={profile.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={profile.postalCode || ''}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="ZIP code"
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={profile.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="tab-content">
              <p className="section-hint">Add your social media profiles</p>

              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  value={profile.linkedin || ''}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="url"
                  value={profile.twitter || ''}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>

              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  value={profile.instagram || ''}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>

              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="url"
                  value={profile.github || ''}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  placeholder="https://github.com/yourprofile"
                />
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="tab-content">
              <p className="section-hint">Manage your communication preferences</p>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    className="checkbox-input"
                    type="checkbox"
                    checked={profile.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  />
                  <span>Email Notifications</span>
                </label>
                <p className="field-hint">Receive notifications about your projects and messages</p>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    className="checkbox-input"
                    type="checkbox"
                    checked={profile.marketingEmails}
                    onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                  />
                  <span>Marketing Emails</span>
                </label>
                <p className="field-hint">Receive updates about new features and promotions</p>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="form-actions">
          <button
            className="btn-save"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
