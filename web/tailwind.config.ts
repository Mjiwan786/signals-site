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
        highlight: 'var(--highlight)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        pos: 'var(--pos)',
        neg: 'var(--neg)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, var(--accent-a), var(--accent-b))',
        'gradient-radial': 'radial-gradient(circle, var(--accent-a), var(--accent-b))',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.25)',
        glow: '0 0 40px rgba(110, 231, 255, 0.3)',
        'glow-violet': '0 0 40px rgba(167, 139, 250, 0.3)',
        'glow-highlight': '0 0 40px rgba(255, 115, 54, 0.3)',
      },
      borderRadius: {
        xl2: '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(110, 231, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(110, 231, 255, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
