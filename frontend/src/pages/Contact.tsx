import { useState } from 'react'
import { t } from '@lingui/macro'
import { api } from '../utils/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    content: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/api/contact', formData)
      setSubmitted(true)
      setFormData({ email: '', subject: '', content: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(t`Failed to send message. Please try again.`)
    }
  }

  return (
    <div className="max-w-xl w-full">
      <div className="flex justify-center mb-8">
        <h1 className="text-3xl font-bold">{t`Contact Form`}</h1>
      </div>

      {submitted && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {t`Message sent successfully!`}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
            {t`Email`}
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm/6 font-medium text-gray-900">
            {t`Subject`}
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm/6 font-medium text-gray-900">
            {t`Content`}
          </label>
          <div className="mt-2">
            <textarea
              id="content"
              name="content"
              rows={5}
              value={formData.content}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            {t`Send`}
          </button>
        </div>
      </form>
    </div>
  )
}
