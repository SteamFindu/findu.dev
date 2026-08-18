import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '@lingui/macro'
import { api } from '../utils/api'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.new_password !== formData.new_password_confirm) {
      setError(t`New passwords do not match`)
      return
    }

    setLoading(true)

    try {
      await api.put('/api/user/changepassword', formData)
      setSuccess(true)
      setTimeout(() => navigate('/users'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || t`Failed to change password`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full">
      <h1 className="text-3xl font-bold mb-6">{t`Change Password`}</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {t`Password changed successfully!`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="old_password" className="block text-sm font-medium text-gray-900">
            {t`Current Password`}
          </label>
          <input
            id="old_password"
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600"
          />
        </div>

        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-gray-900">
            {t`New Password`}
          </label>
          <input
            id="new_password"
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600"
          />
        </div>

        <div>
          <label htmlFor="new_password_confirm" className="block text-sm font-medium text-gray-900">
            {t`Confirm New Password`}
          </label>
          <input
            id="new_password_confirm"
            type="password"
            name="new_password_confirm"
            value={formData.new_password_confirm}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50"
        >
          {loading ? t`Updating...` : t`Update`}
        </button>
      </form>
    </div>
  )
}
