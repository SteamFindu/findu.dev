import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { t } from '@lingui/macro'
import { api } from '../utils/api'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password_conf: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.password_conf) {
      setError(t`Passwords do not match`)
      setLoading(false)
      return
    }

    try {
      await api.post('/api/register', formData)
      navigate('/login?registered=true')
    } catch (err: any) {
      setError(err.response?.data?.message || t`Registration failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-bold text-center mb-6">{t`Register`}</h1>

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
            name="username"
            value={formData.username}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600"
          />
        </div>

        <div>
          <label htmlFor="password_conf" className="block text-sm font-medium text-gray-900">
            {t`Confirm Password`}
          </label>
          <input
            id="password_conf"
            type="password"
            name="password_conf"
            value={formData.password_conf}
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
          {loading ? t`Registering...` : t`Register`}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t`Already have an account?`}{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              {t`Sign In`}
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
