import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import App from './App'
import './index.css'

// Load default locale
import { messages as enMessages } from './locales/en/messages'
i18n.load('en', enMessages)
i18n.activate('en')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  </React.StrictMode>,
)
