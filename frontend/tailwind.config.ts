import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#12264e', deep: '#0d1e3d' },
        brand: { DEFAULT: '#2563be', light: '#3b82d4' },
        sky: { soft: '#e8f0ff', mid: '#d0e0f8' },
      },
      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        card:  '0 4px 24px rgba(18,38,78,.09)',
        'card-sm': '0 2px 10px rgba(18,38,78,.07)',
        'card-lg': '0 8px 32px rgba(18,38,78,.15)',
      },
      borderRadius: {
        xl2: '14px',
        xl3: '18px',
      },
      keyframes: {
        morph: {
          '0%,100%': { borderRadius: '60% 40% 55% 45% / 50% 55% 45% 50%' },
          '25%':      { borderRadius: '50% 50% 40% 60% / 45% 60% 40% 55%' },
          '50%':      { borderRadius: '40% 60% 50% 50% / 55% 45% 55% 45%' },
          '75%':      { borderRadius: '55% 45% 60% 40% / 40% 50% 60% 50%' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%':     { transform: 'translateX(-5px)' },
          '40%':     { transform: 'translateX(5px)' },
          '60%':     { transform: 'translateX(-5px)' },
          '80%':     { transform: 'translateX(5px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px) scale(.97)' },
          to:   { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        morph:   'morph 8s ease-in-out infinite',
        shake:   'shake .35s ease',
        fadeIn:  'fadeIn .25s ease forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
