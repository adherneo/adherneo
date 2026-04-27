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
  images: string[]
  bodyParts: string[]
  price?: number
  description?: string
}

export interface ApiProduct {
  id: string
  code: string
  name: string
  category: string
  sizes: string[]
  images: string[]
  bodyParts: string[]
  description: string | null
  imgUrl: string | null
  price: number
  isActive: boolean
}

export function mapApiProduct(p: ApiProduct): Product {
  const universal = p.sizes.includes('UNIVERSAL')
  const isNumericOrT = (s: string) => !isNaN(Number(s)) || /^T\d/.test(s)
  const areVariants = !universal && p.sizes.length > 0 && !p.sizes.every(isNumericOrT)
  const images = p.images?.length ? p.images : (p.imgUrl ? [p.imgUrl] : [])
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
    img: images[0] || undefined,
    images,
    bodyParts: p.bodyParts || [],
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

export const BODY_PARTS: { value: string; label: string }[] = [
  { value: 'pierna',  label: 'Pierna'  },
  { value: 'brazo',   label: 'Brazo'   },
  { value: 'espalda', label: 'Espalda' },
  { value: 'hombro',  label: 'Hombro'  },
  { value: 'tobillo', label: 'Tobillo' },
  { value: 'muneca',  label: 'Muñeca'  },
  { value: 'codo',    label: 'Codo'    },
  { value: 'pie',     label: 'Pie'     },
]
