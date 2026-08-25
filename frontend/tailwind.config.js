/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        y2k: {
          purple: '#a855f7',
          cyan: '#06b6d4',
          lime: '#84cc16',
          pink: '#ec4899',
          orange: '#f97316',
          neon: {
            purple: '#c084fc',
            cyan: '#22d3ee',
            lime: '#bfef45',
            pink: '#f472b6',
          },
        },
        code: {
          bg: '#0f172a',
          string: '#86efac',
          keyword: '#fbbf24',
          comment: '#64748b',
          number: '#f87171',
        },
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
        display: ['Comic Sans MS', 'cursive', 'sans-serif'],
      },
      borderStyle: {
        'dashed-thick': 'dashed',
      },
      boxShadow: {
        'neon': '0 0 10px currentColor, 0 0 20px currentColor',
        'neon-pink': '0 0 20px #ec4899, 0 0 40px #ec4899',
        'neon-cyan': '0 0 20px #06b6d4, 0 0 40px #06b6d4',
        'neon-purple': '0 0 20px #a855f7, 0 0 40px #a855f7',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '14%': { opacity: '0.95' },
          '15%': { opacity: '0.4' },
          '49%': { opacity: '0.95' },
          '50%': { opacity: '0.8' },
          '99%': { opacity: '0.99' },
        },
      },
    },
  },
  plugins: [],
}
