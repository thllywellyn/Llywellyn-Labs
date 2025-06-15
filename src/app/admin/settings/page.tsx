'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface Settings {
  emailNotifications: boolean
  maintenanceMode: boolean
  defaultProjectStatus: string
}

export default function AdminSettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    maintenanceMode: false,
    defaultProjectStatus: 'PENDING'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSettingChange = (setting: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [setting]: value }))
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to save settings')
      
      setMessage({ type: 'success', text: 'Settings saved successfully' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-settings p-6">
      <div className="admin-header mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
        <p className="text-gray-600">Manage system-wide settings and configurations</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500">Enable/disable system-wide email notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all peer-checked:bg-main-color"></div>
            </label>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Maintenance Mode</h3>
              <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all peer-checked:bg-main-color"></div>
            </label>
          </div>

          {/* Default Project Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Default Project Status</h3>
              <p className="text-sm text-gray-500">Set the default status for new projects</p>
            </div>
            <select
              value={settings.defaultProjectStatus}
              onChange={(e) => handleSettingChange('defaultProjectStatus', e.target.value)}
              className="block w-40 px-3 py-2 text-gray-700 bg-white border border-gray-300 
                        rounded-md shadow-sm focus:outline-none focus:ring-main-color focus:border-main-color"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={saveSettings}
              disabled={loading}
              className="px-4 py-2 bg-main-color text-white rounded-md hover:bg-opacity-90 
                       focus:outline-none focus:ring-2 focus:ring-main-color focus:ring-opacity-50 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mt-4 p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
