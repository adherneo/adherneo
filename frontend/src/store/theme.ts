import { create } from 'zustand'

interface ThemeStore {
  dark: boolean
  toggle: () => void
}

function getInitialDark(): boolean {
  const saved = localStorage.getItem('theme')
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useTheme = create<ThemeStore>((set) => ({
  dark: getInitialDark(),
  toggle() {
    set((s) => {
      const next = !s.dark
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return { dark: next }
    })
  },
}))
