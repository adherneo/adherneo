import { create } from 'zustand'

interface ThemeStore {
  dark: boolean
  toggle: () => void
}

export const useTheme = create<ThemeStore>((set) => ({
  dark: document.documentElement.getAttribute('data-theme') === 'dark',
  toggle() {
    set((s) => {
      const next = !s.dark
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return { dark: next }
    })
  },
}))
