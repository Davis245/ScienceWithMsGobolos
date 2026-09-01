import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#F8FAFC',
        surface: '#FFFFFF',
        brand: '#2563EB',
        border: '#E2E8F0',
        ink: '#0F172A',
        muted: '#64748B',
        chemistry: '#2563EB',
        anatomy: '#16A34A',
        calculus: '#7C3AED',
        scholarships: '#D97706',
      },
      maxWidth: {
        content: '75rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        panel: '1rem',
        pill: '9999px',
      },
      boxShadow: {
        surface: '0 1px 2px rgba(15, 23, 42, 0.08), 0 12px 32px rgba(15, 23, 42, 0.04)',
        soft: '0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
}

export default config
