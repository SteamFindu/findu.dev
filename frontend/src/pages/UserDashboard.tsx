import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { t } from '@lingui/macro'
import { api } from '../utils/api'
import { getAuthToken } from '../utils/auth'

interface User {
  id: string
  username: string
  role: string
  createdAt: string
  updatedAt: string
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/login')
      return
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/user/all')
        setUsers(response.data.users || [])
      } catch (err: any) {
        setError(err.response?.data?.message || t`Failed to fetch users`)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [navigate])

  if (loading) {
    return <div className="max-w-6xl w-full text-center">{t`Loading...`}</div>
  }

  return (
    <div className="max-w-6xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t`Users`}</h1>
        <div className="space-x-4">
          <Link to="/user/changename" className="text-blue-600 hover:underline">
            {t`Change Name`}
          </Link>
          <Link to="/user/changepassword" className="text-blue-600 hover:underline">
            {t`Change Password`}
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">{t`Username`}</th>
              <th className="border border-gray-300 p-2 text-left">{t`Role`}</th>
              <th className="border border-gray-300 p-2 text-left">{t`Created`}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
