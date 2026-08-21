import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { poppins: ['var(--font-poppins)', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#f97316', foreground: '#0a0a0a' },
        accent: { DEFAULT: '#dc2626', foreground: '#ffffff' },
        success: '#22c55e',
        ink: '#0a0a0a',
        surface: '#111111',
        surface2: '#1a1a1a',
        surface3: '#222222',
        // legacy tokens remapped for dark theme
        dark: '#0a0a0a',
        fg: '#d4d4d8',
        muted: { DEFAULT: '#141414', fg: '#9ca3af' },
        border: 'rgba(255,255,255,0.10)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(249,115,22,.35), 0 8px 30px rgba(249,115,22,.18)',
        'glow-red': '0 0 0 1px rgba(220,38,38,.35), 0 8px 30px rgba(220,38,38,.18)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg,#f97316,#dc2626)',
      },
    },
  },
  plugins: [],
}
export default config
