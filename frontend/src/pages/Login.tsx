import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { t } from '@lingui/macro'
import { api } from '../utils/api'
import { setAuthToken } from '../utils/auth'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/api/login', { username, password })
      setAuthToken(response.data.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || t`Login failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-bold text-center mb-6">{t`Sign In`}</h1>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-900">
            {t`Username`}
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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900">
            {t`Password`}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50"
        >
          {loading ? t`Signing in...` : t`Sign In`}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t`Don't have an account?`}{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              {t`Register`}
            </Link>
          </p>
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            {t`Return`}
          </Link>
        </div>
      </form>
    </div>
  )
}
