import express from 'express'
import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')))

// Configuration
const PORT = process.env.PORT || 3000
const USE_HTTPS = process.env.USE_HTTPS === 'true'
const CERT_PATH = process.env.CERTIFICATE_PATH
const KEY_PATH = process.env.PRIVATEKEY_PATH

// Start server
if (USE_HTTPS) {
  // Check if certificates exist
  if (!fs.existsSync(CERT_PATH) || !fs.existsSync(KEY_PATH)) {
    console.error('no cert')
    console.error(`Certificate path: ${CERT_PATH}`)
    console.error(`Key path: ${KEY_PATH}`)
    process.exit(1)
  }

  const https_options = {
    key: fs.readFileSync(KEY_PATH),
    cert: fs.readFileSync(CERT_PATH)
  }

  https.createServer(https_options, app).listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}
