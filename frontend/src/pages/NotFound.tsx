import { Link } from 'react-router-dom'
import { t } from '@lingui/macro'

export default function NotFound() {
  return (
    <div className="max-w-md w-full text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">{t`Page not found`}</p>
      <Link to="/" className="text-blue-600 hover:underline">
        {t`Return to home`}
      </Link>
    </div>
  )
}
