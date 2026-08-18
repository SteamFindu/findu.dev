import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '@lingui/macro'
import { api } from '../utils/api'

export default function ChangeName() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.put('/api/user/changename', { username })
      setSuccess(true)
      setTimeout(() => navigate('/users'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || t`Failed to change username`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full">
      <h1 className="text-3xl font-bold mb-6">{t`Change Username`}</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {t`Username changed successfully!`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-900">
            {t`New Username`}
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
