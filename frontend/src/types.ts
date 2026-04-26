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
