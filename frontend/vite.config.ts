import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { lingui } from '@lingui/vite-plugin'

export default defineConfig({
  plugins: [
    // Run lingui plugin before the React plugin so macros are handled during compilation
    lingui(),
    react({
      babel: {
        // Use the generic macros plugin so @lingui/macro is executed at compile time
        plugins: ["macros"],
      },
    }),
  ],
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
