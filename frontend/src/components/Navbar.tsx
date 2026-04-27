import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useTheme } from '../store/theme'
import { useCart } from '../store/cart'
import { useAuth } from '../store/auth'

const SECTIONS = ['porque', 'fabricamos', 'quienes', 'inicio']

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const total = useCart((s) => s.total())
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') { setActiveSection(''); return }
    function update() {
      const y = window.scrollY + window.innerHeight * 0.35
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && y >= el.offsetTop) { setActiveSection(id); return }
      }
      setActiveSection('inicio')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [location.pathname])

  const links = [
    { to: '/#inicio',     label: 'Inicio',            section: 'inicio' },
    { to: '/#quienes',    label: 'Quiénes Somos',     section: 'quienes' },
    { to: '/#fabricamos', label: 'Qué Fabricamos',    section: 'fabricamos' },
    { to: '/#porque',     label: 'Por qué Elegirnos', section: 'porque' },
    { to: '/productos',   label: 'Catálogo',           section: '' },
  ]

  const isActive = (l: { to: string; section: string }) => {
    if (location.pathname === '/productos') return l.to === '/productos'
    if (location.pathname === '/') {
      if (!l.section) return false
      return activeSection === l.section
    }
    return false
  }

  function scrollToSection(hash: string) {
    if (hash === 'inicio') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleNavClick(to: string) {
    return (e: React.MouseEvent) => {
      setOpen(false)
      const hashIdx = to.indexOf('#')
      if (hashIdx === -1) return
      e.preventDefault()
      const basePath = to.slice(0, hashIdx) || '/'
      const hash = to.slice(hashIdx + 1)
      if (location.pathname === basePath) {
        scrollToSection(hash)
      } else {
        navigate(basePath)
        setTimeout(() => scrollToSection(hash), 120)
      }
    }
  }

  const linkCls = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 whitespace-nowrap ${active ? 'font-bold' : 'font-medium'}`
  const linkStyle = (active: boolean): React.CSSProperties => ({
    color: active ? 'var(--navy)' : 'var(--text-mid)',
    background: active ? 'var(--sky)' : 'transparent',
  })

  const ThemeBtn = () => (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150 flex-shrink-0"
      style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-mid)' }}
      aria-label="Cambiar tema"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )

  const CartBtn = ({ mobile = false }: { mobile?: boolean }) => (
    <Link
      to="/pedido"
      onClick={() => setOpen(false)}
      className="flex items-center gap-1.5 rounded-[9px] font-bold text-white transition-all duration-150 flex-shrink-0"
      style={{
        background: 'var(--navy)',
        padding: mobile ? '8px 14px' : '7px 14px',
        fontSize: mobile ? 14 : 13,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-deep)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      {mobile ? `Carrito (${total})` : total}
    </Link>
  )

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--nav-h)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 20px rgba(18,38,78,.15)' : 'var(--shadow-sm)',
        transition: 'background .3s, border-color .3s, box-shadow .3s',
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: 0,
      }}
    >
      {/* Logo */}
      <Link to="/" onClick={handleNavClick('/#inicio')} className="flex-shrink-0 flex items-center mr-3" aria-label="AdherNeo inicio">
        <Logo height={46} dark={dark} />
      </Link>

      {/* Divider | */}
      <span className="hidden md:block w-px h-5 flex-shrink-0 mr-3" style={{ background: 'var(--border)' }} />

      {/* Desktop nav links — LEFT side */}
      <div className="hidden md:flex items-center gap-0.5">
        {links.map((l) => {
          const active = isActive(l)
          return (
            <Link
              key={l.to}
              to={l.to}
              onClick={handleNavClick(l.to)}
              className={linkCls(active)}
              style={linkStyle(active)}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--sky)' }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {l.label}
            </Link>
          )
        })}
        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="ml-1 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150 whitespace-nowrap"
            style={{
              color: location.pathname.startsWith('/admin') ? '#fff' : 'var(--blue)',
              background: location.pathname.startsWith('/admin') ? 'var(--navy)' : 'var(--sky)',
            }}
          >
            Admin
          </Link>
        )}
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />

      {/* Desktop right area */}
      <div className="hidden md:flex items-center gap-2">
        <ThemeBtn />
        <CartBtn />

        {/* Thin separator */}
        <span className="w-px h-5 flex-shrink-0 mx-1" style={{ background: 'var(--border)' }} />

        {user ? (
          <>
            <Link
              to="/mis-pedidos"
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap"
              style={{ color: 'var(--text-mid)', background: 'transparent' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)' }}
            >
              Mis pedidos
            </Link>
            <span className="text-[13px] font-semibold px-2 whitespace-nowrap" style={{ color: 'var(--text-mid)' }}>
              {user.name.split(' ')[0]}
            </span>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap"
              style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-soft)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-soft)' }}
            >
              Salir
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-lg text-[13px] font-bold text-white transition-all duration-150 whitespace-nowrap"
            style={{ background: 'var(--navy)', border: 'none' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-deep)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
          >
            Acceder
          </Link>
        )}
      </div>

      {/* Mobile: theme + burger */}
      <div className="md:hidden flex items-center gap-2 ml-auto">
        <ThemeBtn />
        <button
          className="flex flex-col justify-center gap-[5px] p-1 w-9 h-9"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Menú"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-0.5 w-full rounded-sm" style={{ background: 'var(--text)' }} />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden flex flex-col gap-1 fixed left-0 right-0 p-4 pb-5 z-50"
          style={{ top: 'var(--nav-h)', background: 'var(--surface)', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
        >
          {links.map((l) => {
            const active = isActive(l)
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={handleNavClick(l.to)}
                className="px-4 py-2.5 rounded-lg text-[14px]"
                style={linkStyle(active)}
              >
                {l.label}
              </Link>
            )
          })}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-lg text-[14px] font-semibold"
              style={{ color: 'var(--blue)', background: 'var(--sky)' }}>
              Admin
            </Link>
          )}

          <div className="my-1 h-px" style={{ background: 'var(--border)' }} />
          <CartBtn mobile />

          {user ? (
            <>
              <Link to="/mis-pedidos" onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-lg text-[14px] font-medium"
                style={{ color: 'var(--text-mid)' }}>
                Mis pedidos
              </Link>
              <button
                onClick={() => { setOpen(false); logout(); navigate('/') }}
                className="px-4 py-2.5 rounded-lg text-[14px] font-medium text-left"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)' }}
              >
                Salir ({user.name})
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}
              className="text-center py-2.5 rounded-lg text-[14px] font-bold text-white mt-1"
              style={{ background: 'var(--navy)' }}>
              Acceder
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
