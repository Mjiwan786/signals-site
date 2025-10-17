import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        elev: 'var(--elev)',
        border: 'var(--border)',
        text: 'var(--text)',
        text2: 'var(--text-2)',
        dim: 'var(--dim)',
        muted: 'var(--muted)',
        accentA: 'var(--accent-a)',
        accentB: 'var(--accent-b)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        pos: 'var(--pos)',
        neg: 'var(--neg)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, var(--accent-a), var(--accent-b))',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.25)',
        glow: '0 0 32px rgba(99, 102, 241, 0.3)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
}

export default config
