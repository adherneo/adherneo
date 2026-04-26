import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  add: (item: Omit<CartItem, 'key'>) => void
  remove: (key: string) => void
  updateQty: (key: string, qty: number) => void
  clear: () => void
  total: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add({ productId, code, name, cat, size, qty }) {
        const key = `${productId}||${size}`
        set((s) => {
          const existing = s.items.find((i) => i.key === key)
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === key ? { ...i, qty: i.qty + qty } : i,
              ),
            }
          }
          return { items: [...s.items, { key, productId, code, name, cat, size, qty }] }
        })
      },
      remove(key) {
        set((s) => ({ items: s.items.filter((i) => i.key !== key) }))
      },
      updateQty(key, qty) {
        if (qty < 1) return
        set((s) => ({
          items: s.items.map((i) => (i.key === key ? { ...i, qty } : i)),
        }))
      },
      clear() { set({ items: [] }) },
      total() { return get().items.reduce((s, i) => s + i.qty, 0) },
    }),
    { name: 'adherneo_cart' },
  ),
)
