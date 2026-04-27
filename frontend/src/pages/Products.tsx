import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import { CATALOG, CATEGORIES, CAT_LABELS } from '../data/catalog'
import { useCart } from '../store/cart'
import type { Product, SortKey } from '../types'

export default function Products() {
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState(searchParams.get('filter') ?? 'all')
  const [query, setQuery]   = useState('')
  const [sort, setSort]     = useState<SortKey>('code')
  const [preview, setPreview] = useState<Product | null>(null)
  const total = useCart((s) => s.total())

  useEffect(() => {
    const f = searchParams.get('filter')
    if (f) setFilter(f)
  }, [searchParams])

  const list = useMemo(() => {
    const q = query.toLowerCase().trim()
    let result = CATALOG.filter((p) => {
      const matchCat = filter === 'all' || p.cat === filter
      const matchQ   = !q || p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      return matchCat && matchQ
    })
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    else if (sort === 'cat') result.sort((a, b) => a.cat.localeCompare(b.cat) || a.code.localeCompare(b.code))
    else result.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
    return result
  }, [filter, query, sort])

  const _ = CAT_LABELS // ensure import used

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)' }}>

        {/* ── Sticky catalog bar ── */}
        <div
          className="sticky z-[900] px-10 pt-2.5 pb-2"
          style={{ top: 'var(--nav-h)', background: 'var(--surface)', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(18,38,78,.07)' }}
        >
          {/* Top row — all items in one line */}
          <div className="flex items-center gap-2.5 mb-2">
            <Link
              to="/"
              className="flex items-center p-1.5 rounded-[7px] transition-all duration-150 flex-shrink-0"
              style={{ color: 'var(--text-mid)', background: 'none', border: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)'; (e.currentTarget as HTMLElement).style.color = 'var(--navy)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4L6 10L12 16" />
              </svg>
            </Link>

            {/* Search */}
            <div className="relative flex-1" style={{ minWidth: 0 }}>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-soft)' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o código…"
                className="form-input pl-9"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="form-input flex-shrink-0"
              style={{ width: 'auto', minWidth: 160 }}
            >
              <option value="code">Ordenar por código</option>
              <option value="name">Ordenar por nombre</option>
              <option value="cat">Por categoría</option>
            </select>

            <Link
              to="/pedido"
              className="flex items-center gap-2 px-4 py-2 rounded-[9px] text-[13px] font-bold text-white flex-shrink-0 transition-all duration-150"
              style={{ background: 'var(--navy)', boxShadow: '0 3px 12px rgba(18,38,78,.22)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-deep)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
            >
              Realizar Pedido
              <span className="px-2 py-0.5 rounded-full text-[12px] font-bold" style={{ background: 'rgba(255,255,255,.22)' }}>{total}</span>
            </Link>
          </div>

          {/* Filter pills + count */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`pill-filter ${filter === c.id ? 'active' : ''}`}
              >
                {c.label}
              </button>
            ))}
            <span className="text-[12px] ml-auto hidden md:block" style={{ color: 'var(--text-soft)', whiteSpace: 'nowrap' }}>
              {list.length === CATALOG.length ? `${CATALOG.length} productos` : `${list.length} / ${CATALOG.length}`}
            </span>
          </div>
        </div>

        {/* ── Grid ── */}
        <main className="max-w-[1280px] mx-auto px-10 pt-6 pb-20">
          {list.length === 0 ? (
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
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}
            >
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
