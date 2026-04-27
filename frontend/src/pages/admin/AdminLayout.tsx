import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { useTheme } from '../../store/theme'
import { useAuth } from '../../store/auth'

export default function AdminLayout() {
  const { dark, toggle } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: active ? 700 : 500,
    color: active ? (dark ? '#7eb4f0' : 'var(--navy)') : 'var(--text-mid)',
    background: active ? 'var(--sky)' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all .15s',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Admin header */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 1000,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex', alignItems: 'center', gap: 24,
          padding: '0 32px', height: 'var(--nav-h)',
        }}
      >
        <Logo height={44} dark={dark} />
        <span
          className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ background: 'var(--sky-mid)', color: 'var(--navy)' }}
        >
          Admin
        </span>

        <nav className="flex items-center gap-1 ml-4">
          <NavLink to="/admin/usuarios" style={({ isActive }) => tabStyle(isActive)}>
            Usuarios
          </NavLink>
          <NavLink to="/admin/productos" style={({ isActive }) => tabStyle(isActive)}>
            Productos
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <NavLink
            to="/"
            className="text-[13px] px-3 py-2 rounded-lg transition-all duration-150"
            style={{ color: 'var(--text-soft)', textDecoration: 'none' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            ← Ir al sitio
          </NavLink>

          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150"
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
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

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
              {user.name}
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
