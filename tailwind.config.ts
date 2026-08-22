import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { poppins: ['var(--font-poppins)', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#f97316', foreground: '#ffffff' },
        accent:  { DEFAULT: '#dc2626', foreground: '#ffffff' },
        success: '#22c55e',
        // Light theme surfaces
        surface:  '#f9f9f9',
        surface2: '#f4f4f5',
        surface3: '#e4e4e7',
        // Legacy alias kept for footer (footer stays dark)
        ink:     '#0a0a0a',
        // Text
        fg:      '#111111',
        muted: { DEFAULT: '#f4f4f5', fg: '#71717a' },
      },
      boxShadow: {
        glow:     '0 0 0 1px rgba(249,115,22,.3), 0 6px 24px rgba(249,115,22,.15)',
        'glow-red': '0 0 0 1px rgba(220,38,38,.3), 0 6px 24px rgba(220,38,38,.15)',
        card:     '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 30px rgba(249,115,22,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg,#f97316,#dc2626)',
      },
    },
  },
  plugins: [],
}
export default config
