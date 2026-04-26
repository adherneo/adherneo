import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
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
              {[['/', 'Inicio'], ['/#quienes', 'Quiénes Somos'], ['/#fabricamos', 'Qué Fabricamos'], ['/#porque', 'Por qué Elegirnos']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm transition-colors duration-150" style={{ color: 'rgba(255,255,255,.65)' }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,.65)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-5" style={{ color: 'rgba(255,255,255,.4)' }}>Productos</p>
            <ul className="space-y-2.5">
              {[['/productos', 'Catálogo completo'], ['/pedido', 'Realizar pedido']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm transition-colors duration-150" style={{ color: 'rgba(255,255,255,.65)' }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,.65)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-5" style={{ color: 'rgba(255,255,255,.4)' }}>Contacto</p>
            <div className="space-y-3">
              {[
                ['📍', 'La Lonja, Pilar, Buenos Aires, Argentina'],
                ['📧', 'adherneo@hotmail.com'],
                ['📱', 'WhatsApp disponible'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,.65)' }}>
                  <span className="text-base flex-shrink-0 mt-px">{icon}</span>
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
