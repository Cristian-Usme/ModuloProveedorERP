import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
      },
      boxShadow: {
        glass: '0 24px 80px rgba(2, 8, 23, 0.42)',
      },
      backgroundImage: {
        'erp-radial':
          'radial-gradient(circle at top left, rgba(37, 99, 235, 0.32), transparent 26%), radial-gradient(circle at top right, rgba(34, 197, 94, 0.14), transparent 22%), linear-gradient(180deg, #071426 0%, #071426 45%, #030712 100%)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.4rem',
      },
    },
  },
  plugins: [],
}

export default config