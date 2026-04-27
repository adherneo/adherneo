import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../store/auth'

interface OrderItem {
  id: string
  productCode: string
  productName: string
  size: string
  quantity: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  notes: string | null
  status: string
  items: OrderItem[]
  createdAt: string
}

const STATUS_LABEL: Record<string, string> = {
  pending:    'Pendiente',
  confirmed:  'Confirmado',
  processing: 'En proceso',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
}

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending:    { bg: '#fff8e1', color: '#b07d00' },
  confirmed:  { bg: '#e8f5ee', color: '#1a7c4f' },
  processing: { bg: '#e8f0ff', color: '#2563be' },
  shipped:    { bg: '#e8f0ff', color: '#2563be' },
  delivered:  { bg: '#e8f5ee', color: '#1a7c4f' },
  cancelled:  { bg: '#fdf0ee', color: '#c0392b' },
}

export default function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    fetch(`/api/orders/by-user/${user.id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: Order[]) => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  function fmt(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function totalItems(o: Order) {
    return o.items.reduce((s, i) => s + i.quantity, 0)
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh' }}>
        <main className="max-w-[820px] mx-auto px-4 md:px-8 pt-8 pb-20">

          <div className="flex items-center gap-3 mb-7">
            <Link to="/" className="flex items-center p-1.5 rounded-lg transition-all duration-150"
              style={{ color: 'var(--text-mid)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4L6 10L12 16"/>
              </svg>
            </Link>
            <div>
              <h1 className="font-serif text-[24px] font-bold" style={{ color: 'var(--navy)' }}>Mis pedidos</h1>
              {!loading && (
                <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-soft)' }}>
                  {orders.length === 0 ? 'Aún no realizaste pedidos' : `${orders.length} pedido${orders.length !== 1 ? 's' : ''}`}
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin" style={{ color: 'var(--text-soft)' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex justify-center mb-4" style={{ color: 'var(--text-soft)' }}>
                <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <p className="text-[15px] font-semibold mb-2" style={{ color: 'var(--text-mid)' }}>Todavía no realizaste ningún pedido</p>
              <p className="text-[13px] mb-6" style={{ color: 'var(--text-soft)' }}>Explorá el catálogo y hacé tu primer pedido.</p>
              <Link to="/productos" className="btn-primary">Ver catálogo →</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((o) => {
                const sc = STATUS_COLOR[o.status] ?? { bg: 'var(--sky)', color: 'var(--text-mid)' }
                const isOpen = expanded === o.id
                return (
                  <div key={o.id} className="rounded-xl overflow-hidden transition-all duration-200"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    {/* Header row */}
                    <button
                      className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer transition-all duration-150"
                      style={{ background: 'none', border: 'none' }}
                      onClick={() => setExpanded(isOpen ? null : o.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[13px] font-bold" style={{ color: 'var(--text)', fontFamily: 'monospace' }}>
                            #{o.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: sc.bg, color: sc.color }}>
                            {STATUS_LABEL[o.status] ?? o.status}
                          </span>
                        </div>
                        <p className="text-[12px]" style={{ color: 'var(--text-soft)' }}>
                          {fmt(o.createdAt)} · {totalItems(o)} artículo{totalItems(o) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <svg
                        viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className="flex-shrink-0 transition-transform duration-200"
                        style={{ color: 'var(--text-soft)', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                      >
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>

                    {/* Expanded items */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="px-5 py-4">
                          <p className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--text-soft)' }}>
                            Productos
                          </p>
                          <div className="flex flex-col gap-2">
                            {o.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded flex-shrink-0"
                                  style={{ fontFamily: 'monospace', color: 'var(--blue)', background: 'var(--sky)' }}>
                                  {item.productCode}
                                </span>
                                <span className="text-[13px] flex-1 truncate" style={{ color: 'var(--text)' }}>{item.productName}</span>
                                <span className="text-[12px] flex-shrink-0" style={{ color: 'var(--text-soft)' }}>{item.size}</span>
                                <span className="text-[12px] font-bold flex-shrink-0" style={{ color: 'var(--text-mid)' }}>×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          {o.notes && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                              <p className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: 'var(--text-soft)' }}>Notas</p>
                              <p className="text-[13px]" style={{ color: 'var(--text-mid)' }}>{o.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}
