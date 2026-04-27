import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { useTheme } from '../../store/theme'
import { useAuth } from '../../store/auth'

const TABS = [
  { to: '/admin/usuarios',  label: 'Usuarios'  },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/pedidos',   label: 'Pedidos'   },
  { to: '/admin/etiquetas', label: 'Etiquetas' },
]

export default function AdminLayout() {
  const { dark, toggle } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: active ? 700 : 500,
    color: active ? (dark ? '#7eb4f0' : 'var(--navy)') : 'var(--text-mid)',
    background: active ? 'var(--sky)' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all .15s',
    whiteSpace: 'nowrap' as const,
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
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 1000,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Main row */}
        <div className="flex items-center gap-2 px-4 md:px-8" style={{ height: 'var(--nav-h)' }}>

          {/* Logo + badge */}
          <Logo height={40} dark={dark} />
          <span
            className="hidden sm:inline text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: 'var(--sky-mid)', color: 'var(--navy)' }}
          >
            Admin
          </span>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-0.5 ml-2">
            {TABS.map((t) => (
              <NavLink key={t.to} to={t.to} style={({ isActive }) => tabStyle(isActive)}>
                {t.label}
              </NavLink>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop right area */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              className="text-[13px] px-3 py-2 rounded-lg transition-all duration-150"
              style={{ color: 'var(--text-soft)', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              ← Ir al sitio
            </NavLink>

            <ThemeBtn />

            {user && (
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-soft)' }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {user.name.split(' ')[0]}
              </button>
            )}
          </div>

          {/* Mobile: theme + burger */}
          <div className="md:hidden flex items-center gap-2">
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
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div
            className="md:hidden flex flex-col gap-1 p-4 pb-5"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', boxShadow: 'var(--shadow)' }}
          >
            {/* Nav tabs */}
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-lg text-[14px]"
                style={({ isActive }) => ({
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--navy)' : 'var(--text-mid)',
                  background: isActive ? 'var(--sky)' : 'transparent',
                  textDecoration: 'none',
                })}
              >
                {t.label}
              </NavLink>
            ))}

            <div className="my-1 h-px" style={{ background: 'var(--border)' }} />

            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-lg text-[14px] font-medium"
              style={{ color: 'var(--text-soft)', textDecoration: 'none' }}
            >
              ← Ir al sitio
            </NavLink>

            {user && (
              <button
                onClick={() => { setOpen(false); logout(); navigate('/login') }}
                className="px-4 py-2.5 rounded-lg text-[14px] font-medium text-left"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)' }}
              >
                Salir ({user.name.split(' ')[0]})
              </button>
            )}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-[1200px] mx-auto px-3 md:px-8 py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  )
}
