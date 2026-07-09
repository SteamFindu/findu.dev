import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { useI18n } from '@lingui/react'
import { getAuthToken, logout } from '../utils/auth'

export default function Layout() {
  const navigate = useNavigate()
  const { i18n } = useI18n()
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken())

  useEffect(() => {
    const token = getAuthToken()
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
    navigate('/')
  }

  const toggleLanguage = () => {
    const newLang = i18n.locale === 'en' ? 'fi' : 'en'
    i18n.activate(newLang)
  }

  return (
    <div className="bg-white min-h-screen overflow-hidden flex flex-col w-full">
      <header className="sticky inset-x-0 top-0 z-50 bg-gray-300 bg-opacity-50">
        <nav className="max-lg:hidden flex items-center justify-between p-6 px-8" aria-label="Global">
          <div className="flex gap-x-12 lg:justify-center flex-1">
            <Link to="/" className="text-sm/6 font-semibold text-gray-900">
              {t`Home`}
            </Link>
            <Link to="/projects" className="text-sm/6 font-semibold text-gray-900">
              {t`Projects`}
            </Link>
            <Link to="/contact" className="text-sm/6 font-semibold text-gray-900">
              {t`Contact`}
            </Link>
          </div>
          <div className="flex gap-x-4 items-center">
            <button
              onClick={toggleLanguage}
              className="text-sm/6 font-semibold text-gray-900 hover:text-gray-600"
            >
              {i18n.locale === 'en' ? 'FI' : 'EN'}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/users" className="text-sm/6 font-semibold text-gray-900">
                  {t`Dashboard`}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm/6 font-semibold text-gray-900 hover:text-gray-600"
                >
                  {t`Logout`}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm/6 font-semibold text-gray-900">
                  {t`Login`}
                </Link>
                <Link to="/register" className="text-sm/6 font-semibold text-gray-900">
                  {t`Register`}
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <div className="bgdiv"></div>

      <main className="grid min-h-full justify-center px-6 py-24 sm:py-32 lg:px-8 w-full flex-1 overflow-y-scroll z-1 -mt-20">
        <Outlet />
      </main>

      <footer className="sticky bottom-0 w-full bg-gray-300 bg-opacity-50">
        <nav className="lg:hidden flex items-center p-3 pb-3 lg:px-8" aria-label="Global">
          <div className="flex gap-x-12 justify-evenly w-full">
            <Link to="/" className="text-sm/6 font-semibold text-gray-900">
              {t`Home`}
            </Link>
            <Link to="/projects" className="text-sm/6 font-semibold text-gray-900">
              {t`Projects`}
            </Link>
            <Link to="/contact" className="text-sm/6 font-semibold text-gray-900">
              {t`Contact`}
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  )
}
