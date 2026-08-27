/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        aero: {
          50: '#f7fbff',
          100: '#eef7ff',
          200: '#d7eeff',
          300: '#bfe3ff',
          400: '#8fd7ff',
          500: '#5fc9ff',
          600: '#3aaedf',
          700: '#2d88b7',
          800: '#23607f',
          900: '#18394a',
        },
      },
      fontFamily: {
        frutiger: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(16,24,40,0.08), 0 2px 6px rgba(16,24,40,0.04)'
      }
    },
  },
  plugins: [],
}

