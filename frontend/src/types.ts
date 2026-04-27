export type Category =
  | 'rodilleras'
  | 'tobilleras'
  | 'munequeras'
  | 'coderas'
  | 'fajas'
  | 'inmovilizadores'
  | 'otros'

export interface Product {
  id: string
  code: string
  name: string
  cat: Category
  sizes?: (number | string)[]
  variants?: string[]
  universal?: boolean
  img?: string
  price?: number
  description?: string
}

export interface ApiProduct {
  id: string
  code: string
  name: string
  category: string
  sizes: string[]
  description: string | null
  imgUrl: string | null
  price: number
  isActive: boolean
}

export function mapApiProduct(p: ApiProduct): Product {
  const universal = p.sizes.includes('UNIVERSAL')
  const isNumericOrT = (s: string) => !isNaN(Number(s)) || /^T\d/.test(s)
  const areVariants = !universal && p.sizes.length > 0 && !p.sizes.every(isNumericOrT)
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    cat: p.category as Category,
    universal: universal || undefined,
    variants: areVariants ? p.sizes : undefined,
    sizes: (!universal && !areVariants && p.sizes.length > 0)
      ? p.sizes.map((s) => { const n = Number(s); return isNaN(n) ? s : n })
      : undefined,
    img: p.imgUrl || undefined,
    price: p.price,
    description: p.description || undefined,
  }
}

export interface CartItem {
  key: string
  productId: string
  code: string
  name: string
  cat: Category
  size: string
  qty: number
}

export interface Cart {
  items: CartItem[]
}

export type SortKey = 'code' | 'name' | 'cat'
