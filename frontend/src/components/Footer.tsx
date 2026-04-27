import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

function useScrollNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return function go(to: string) {
    const hashIdx = to.indexOf('#')
    if (hashIdx === -1) { navigate(to); return }

    const basePath = to.slice(0, hashIdx) || '/'
    const hash = to.slice(hashIdx + 1)

    function scroll() {
      if (hash === 'inicio') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (location.pathname === basePath) {
      scroll()
    } else {
      navigate(basePath)
      setTimeout(scroll, 120)
    }
  }
}

export default function Footer() {
  const go = useScrollNav()

  const NavLink = ({ to, children }: { to: string; children: ReactNode }) => (
    <button
      onClick={() => go(to)}
      className="text-sm transition-colors duration-150 text-left"
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.65)', padding: 0 }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.65)' }}
    >
      {children}
    </button>
  )

  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,.8)', padding: '60px 40px 32px' }}>
      <div className="max-w-[1160px] mx-auto">
        <div
          className="grid gap-12 pb-12 mb-7"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            borderBottom: '1px solid rgba(255,255,255,.1)',
          }}
        >
          <div>
            <Logo height={52} white />
            <p className="mt-4 text-[13px] leading-7" style={{ color: 'rgba(255,255,255,.55)' }}>
              Productos ortopédicos de fabricación nacional. Calidad y confort en cada producto.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-5" style={{ color: 'rgba(255,255,255,.4)' }}>Navegación</p>
            <ul className="space-y-2.5">
              {([
                ['/#inicio',     'Inicio'],
                ['/#quienes',    'Quiénes Somos'],
                ['/#fabricamos', 'Qué Fabricamos'],
                ['/#porque',     'Por Qué Elegirnos'],
              ] as [string, string][]).map(([to, label]) => (
                <li key={to}><NavLink to={to}>{label}</NavLink></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-5" style={{ color: 'rgba(255,255,255,.4)' }}>Productos</p>
            <ul className="space-y-2.5">
              {([
                ['/productos', 'Catálogo completo'],
                ['/pedido',    'Realizar pedido'],
              ] as [string, string][]).map(([to, label]) => (
                <li key={to}><NavLink to={to}>{label}</NavLink></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-5" style={{ color: 'rgba(255,255,255,.4)' }}>Contacto</p>
            <div className="space-y-3">
              {([
                [<svg key="pin" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>, 'La Lonja, Pilar, Buenos Aires, Argentina'],
                [<svg key="mail" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, 'adherneo@hotmail.com'],
                [<svg key="phone" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z"/></svg>, 'WhatsApp disponible'],
              ] as [ReactNode, string][]).map(([icon, text]) => (
                <div key={text} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,.65)' }}>
                  <span className="flex-shrink-0 mt-px" style={{ opacity: .7 }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-2 text-xs" style={{ color: 'rgba(255,255,255,.35)' }}>
          <span>© 2025 AdherNeo. Todos los derechos reservados.</span>
          <span>La Lonja, Pilar · Buenos Aires, Argentina</span>
        </div>
      </div>
    </footer>
  )
}
