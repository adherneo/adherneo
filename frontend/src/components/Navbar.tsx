import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useTheme } from '../store/theme'
import { useCart } from '../store/cart'

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const total = useCart((s) => s.total())
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { to: '/',          label: 'Inicio' },
    { to: '/#quienes',  label: 'Quiénes Somos' },
    { to: '/productos', label: 'Catálogo' },
  ]

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to.split('#')[0])

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--nav-h)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 20px rgba(18,38,78,.15)' : 'var(--shadow-sm)',
        transition: 'background .3s, border-color .3s, box-shadow .3s',
        display: 'flex', alignItems: 'center', padding: '0 40px', gap: '32px',
      }}
    >
      <Link to="/" className="flex-shrink-0 flex items-center" aria-label="AdherNeo inicio">
        <Logo height={48} dark={dark} />
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1.5 ml-auto">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              color: isActive(l.to) ? (dark ? 'var(--blue-light)' : 'var(--navy)') : 'var(--text-mid)',
              fontWeight: isActive(l.to) ? 600 : 500,
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'var(--sky)' }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '' }}
          >
            {l.label}
          </Link>
        ))}
        <Link
          to="/pedido"
          className="ml-2 px-5 py-2 rounded-[9px] text-sm font-bold text-white transition-all duration-150"
          style={{ background: 'var(--navy)' }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'var(--navy-deep)' }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'var(--navy)' }}
        >
          Carrito ({total})
        </Link>
      </div>

      <button
        onClick={toggle}
        className="ml-2 w-10 h-10 flex items-center justify-center rounded-lg text-lg transition-all duration-150 flex-shrink-0"
        style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
        aria-label="Cambiar tema"
      >
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Burger */}
      <button
        className="md:hidden ml-auto flex flex-col justify-center gap-[5px] p-1 w-9 h-9"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Menú"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-0.5 w-full rounded-sm transition-all duration-300"
            style={{ background: 'var(--text)' }}
          />
        ))}
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden flex flex-col gap-1 fixed left-0 right-0 p-4 pb-6 z-50"
          style={{
            top: 'var(--nav-h)',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: 'var(--text-mid)' }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/pedido"
            className="mt-1 px-4 py-2.5 rounded-[9px] text-sm font-bold text-white text-center"
            style={{ background: 'var(--navy)' }}
            onClick={() => setOpen(false)}
          >
            Carrito ({total})
          </Link>
        </div>
      )}
    </nav>
  )
}
