import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { lingui } from '@lingui/vite-plugin'

export default defineConfig({
  plugins: [react(), lingui()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:443',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
