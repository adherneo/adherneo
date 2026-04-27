import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCart } from './cart'
import type { CartItem } from '../types'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthStore {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const cartKey = (userId: string) => `adherneo_cart_${userId}`

function loadUserCart(userId: string): CartItem[] {
  try {
    const raw = localStorage.getItem(cartKey(userId))
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch { return [] }
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,

      async login(email, password) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) throw new Error('Credenciales incorrectas')
        const user: AuthUser = await res.json()

        const savedItems = loadUserCart(user.id)
        const anonItems  = useCart.getState().items

        if (savedItems.length > 0) {
          // Merge: start from saved, add anon items not already present
          const merged = [...savedItems]
          for (const item of anonItems) {
            if (!merged.find((i) => i.key === item.key)) merged.push(item)
          }
          useCart.setState({ items: merged })
        }
        // else: anonymous items become the user's starting cart

        set({ user })
      },

      logout() {
        const { user } = get()
        if (user) {
          const items = useCart.getState().items
          try { localStorage.setItem(cartKey(user.id), JSON.stringify(items)) } catch { /* ignore */ }
          useCart.getState().clear()
        }
        set({ user: null })
      },
    }),
    { name: 'adherneo-auth' },
  ),
)
