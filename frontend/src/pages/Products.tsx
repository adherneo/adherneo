import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import { CATEGORIES, CAT_LABELS } from '../data/catalog'
import { useCart } from '../store/cart'
import { mapApiProduct, BODY_PARTS } from '../types'
import type { Product, ApiProduct, SortKey } from '../types'

export default function Products() {
  const [searchParams] = useSearchParams()
  const [filter, setFilter]       = useState(searchParams.get('filter') ?? 'all')
  const [bodyPart, setBodyPart]   = useState('all')
  const [query, setQuery]         = useState('')
  const [sort, setSort]           = useState<SortKey>('code')
  const [preview, setPreview] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState('')
  const total = useCart((s) => s.total())

  useEffect(() => {
    const f = searchParams.get('filter')
    if (f) setFilter(f)
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch('/api/products')
      .then((r) => r.ok ? r.json() : Promise.reject('error'))
      .then((data: ApiProduct[]) => { setProducts(data.map(mapApiProduct)); setLoading(false) })
      .catch(() => { setError('No se pudo cargar el catálogo.'); setLoading(false) })
  }, [])

  const list = useMemo(() => {
    const q = query.toLowerCase().trim()
    let result = products.filter((p) => {
      const matchCat  = filter === 'all' || p.cat === filter
      const matchPart = bodyPart === 'all' || (p.bodyParts?.includes(bodyPart) ?? false)
      const matchQ    = !q || p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      return matchCat && matchPart && matchQ
    })
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    else if (sort === 'cat') result.sort((a, b) => a.cat.localeCompare(b.cat) || a.code.localeCompare(b.code))
    else result.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
    return result
  }, [products, filter, bodyPart, query, sort])

  const _ = CAT_LABELS // ensure import used

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)' }}>

        {/* ── Sticky catalog bar ── */}
        <div
          className="sticky z-[900] px-3 md:px-8 pt-2.5 pb-2"
          style={{ top: 'var(--nav-h)', background: 'var(--surface)', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(18,38,78,.07)' }}
        >
          {/* Row 1: back + search + [desktop: sort + pedido] [mobile: cart icon] */}
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/"
              className="flex items-center p-1.5 rounded-[7px] transition-all duration-150 flex-shrink-0"
              style={{ color: 'var(--text-mid)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)'; (e.currentTarget as HTMLElement).style.color = 'var(--navy)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4L6 10L12 16" />
              </svg>
            </Link>

            <div className="relative flex-1" style={{ minWidth: 0 }}>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-soft)' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar…"
                className="form-input pl-9"
              />
            </div>

            {/* Desktop: sort + pedido */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="form-input hidden md:block flex-shrink-0"
              style={{ width: 'auto', minWidth: 150 }}
            >
              <option value="code">Por código</option>
              <option value="name">Por nombre</option>
              <option value="cat">Por categoría</option>
            </select>

            <Link
              to="/pedido"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-[9px] text-[13px] font-bold text-white flex-shrink-0 transition-all duration-150"
              style={{ background: 'var(--navy)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-deep)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
            >
              Realizar Pedido
              <span className="px-2 py-0.5 rounded-full text-[12px] font-bold" style={{ background: 'rgba(255,255,255,.22)' }}>{total}</span>
            </Link>

            {/* Mobile: compact cart */}
            <Link
              to="/pedido"
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-[9px] text-[13px] font-bold text-white flex-shrink-0 transition-all duration-150"
              style={{ background: 'var(--navy)' }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {total}
            </Link>
          </div>

          {/* Row 2 (mobile only): sort select */}
          <div className="md:hidden mb-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="form-input w-full"
            >
              <option value="code">Ordenar por código</option>
              <option value="name">Ordenar por nombre</option>
              <option value="cat">Por categoría</option>
            </select>
          </div>

          {/* Single merged filter bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setFilter(c.id); setBodyPart('all') }}
                className={`pill-filter flex-shrink-0 ${
                  c.id === 'all'
                    ? filter === 'all' && bodyPart === 'all' ? 'active' : ''
                    : filter === c.id ? 'active' : ''
                }`}
              >
                {c.label}
              </button>
            ))}
            <span className="flex-shrink-0 w-px self-stretch my-0.5 mx-0.5" style={{ background: 'var(--border)' }} />
            {BODY_PARTS.map((bp) => (
              <button
                key={bp.value}
                onClick={() => { setBodyPart(bp.value); setFilter('all') }}
                className={`pill-filter flex-shrink-0 ${bodyPart === bp.value ? 'active' : ''}`}
              >
                {bp.label}
              </button>
            ))}
            {!loading && (
              <span className="text-[12px] ml-auto pl-3 hidden md:block flex-shrink-0 self-center" style={{ color: 'var(--text-soft)', whiteSpace: 'nowrap' }}>
                {list.length === products.length ? `${products.length} productos` : `${list.length} / ${products.length}`}
              </span>
            )}
          </div>
        </div>

        {/* ── Grid ── */}
        <main className="max-w-[1280px] mx-auto px-3 md:px-8 pt-6 pb-20">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin" style={{ color: 'var(--text-soft)' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-[15px] mb-4" style={{ color: 'var(--text-mid)' }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Reintentar
              </button>
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-20">
              <div className="flex justify-center mb-4" style={{ color: 'var(--text-soft)' }}>
                <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold mb-2" style={{ color: 'var(--text-mid)' }}>Sin resultados</h3>
              <p className="text-[14px]" style={{ color: 'var(--text-soft)' }}>Probá con otro término o quitá los filtros.</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
              {list.map((p) => (
                <ProductCard key={p.id} product={p} onPreview={setPreview} />
              ))}
            </div>
          )}
        </main>

      </div>
      <Footer />
      <ProductModal product={preview} onClose={() => setPreview(null)} />
    </>
  )
}
