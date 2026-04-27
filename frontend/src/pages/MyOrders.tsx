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
  unitPrice: number | null
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
  processing: 'En proceso',
  delivered:  'Completado',
  cancelled:  'Cancelado',
}

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending:    { bg: '#fff8e1', color: '#b07d00' },
  processing: { bg: '#e8f0ff', color: '#2563be' },
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

  function orderTotal(o: Order) {
    const t = o.items.reduce((s, i) => s + i.quantity * (Number(i.unitPrice) || 0), 0)
    return t > 0 ? t : null
  }

  function printOrderInvoice(o: Order) {
    const date = new Date(o.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    const rows = o.items.map(i => {
      const sub = i.unitPrice ? `$${(Number(i.unitPrice) * i.quantity).toLocaleString('es-AR')}` : '—'
      const unit = i.unitPrice ? `$${Number(i.unitPrice).toLocaleString('es-AR')}` : ''
      return `<tr>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px;color:#12264e;font-weight:700">${i.productCode}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:13px">${i.productName}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;text-align:center;color:#666">${i.size}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:center;font-weight:700">${i.quantity}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;text-align:right;color:#555">${unit}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:right;font-weight:700;color:#12264e">${sub}</td>
      </tr>`
    }).join('')
    const tot = orderTotal(o)
    const totalRow = tot ? `<tr>
      <td colspan="5" style="padding:10px 10px 6px;text-align:right;font-size:14px;font-weight:700;color:#333">Total estimado</td>
      <td style="padding:10px 10px 6px;text-align:right;font-size:16px;font-weight:700;color:#12264e">$${tot.toLocaleString('es-AR')}</td>
    </tr>` : ''
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pedido AdherNeo</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#1a1a1a;padding:20mm}
@page{size:A4;margin:15mm}
@media print{body{padding:0}}
.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #12264e;padding-bottom:14px;margin-bottom:20px}
.logo-text{font-family:Georgia,serif;font-size:28px;font-weight:700;color:#12264e}
.logo-sub{font-size:11px;color:#888;margin-top:3px;letter-spacing:.05em}
.badge{background:#12264e;color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:.06em;text-transform:uppercase}
.section{margin-bottom:18px}
.section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:8px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px}
.info-item label{font-size:10px;color:#888;display:block;margin-bottom:2px}
.info-item span{font-size:13px;color:#1a1a1a}
table{width:100%;border-collapse:collapse;margin-top:6px}
thead tr{background:#f5f8ff}
thead th{padding:8px 10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#555}
thead th:last-child,thead th:nth-child(4),thead th:nth-child(5){text-align:right}
thead th:nth-child(3){text-align:center}
.footer{margin-top:24px;padding-top:12px;border-top:1px solid #eee;font-size:11px;color:#aaa;text-align:center}
.print-btn{position:fixed;bottom:20px;right:20px;background:#12264e;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:600;cursor:pointer;font-family:sans-serif}
@media print{.print-btn{display:none}}
</style></head><body>
<div class="header">
  <div><div class="logo-text">AdherNeo</div><div class="logo-sub">Productos ortopédicos</div></div>
  <div style="text-align:right">
    <div class="badge">Pedido</div>
    <div style="font-size:11px;color:#888;margin-top:4px;font-family:monospace">#${o.id.slice(0, 8).toUpperCase()}</div>
    <div style="font-size:12px;color:#888;margin-top:3px">${date}</div>
  </div>
</div>
<div class="section">
  <div class="section-title">Datos del cliente</div>
  <div class="info-grid">
    <div class="info-item"><label>Nombre</label><span>${o.customerName}</span></div>
    <div class="info-item"><label>Email</label><span>${o.customerEmail}</span></div>
    ${o.customerPhone ? `<div class="info-item"><label>Teléfono</label><span>${o.customerPhone}</span></div>` : ''}
  </div>
</div>
<div class="section">
  <div class="section-title">Artículos</div>
  <table>
    <thead><tr>
      <th>Código</th><th>Producto</th><th style="text-align:center">Talle</th>
      <th style="text-align:right">Cant.</th><th style="text-align:right">P. Unit.</th><th style="text-align:right">Subtotal</th>
    </tr></thead>
    <tbody>${rows}${totalRow}</tbody>
  </table>
</div>
<div class="footer">AdherNeo · adherneo@hotmail.com · Este documento no es una factura oficial</div>
<button class="print-btn" onclick="window.print()">Imprimir / Guardar PDF</button>
</body></html>`
    let iframe = document.getElementById('_invoice_frame') as HTMLIFrameElement | null
    if (iframe) iframe.remove()
    iframe = document.createElement('iframe')
    iframe.id = '_invoice_frame'
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999;background:#fff'
    document.body.appendChild(iframe)
    iframe.srcdoc = html
    iframe.onload = () => {
      const close = document.createElement('button')
      close.textContent = '✕ Cerrar'
      close.style.cssText = 'position:fixed;top:14px;left:20px;z-index:10000;background:#c0392b;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;font-family:sans-serif'
      close.onclick = () => { iframe!.remove(); close.remove() }
      document.body.appendChild(close)
    }
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
                          {orderTotal(o) !== null && (
                            <span className="font-semibold" style={{ color: 'var(--navy)' }}>
                              {' · '}${orderTotal(o)!.toLocaleString('es-AR')}
                            </span>
                          )}
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
                                {item.unitPrice ? (
                                  <span className="text-[12px] font-semibold flex-shrink-0 w-24 text-right" style={{ color: 'var(--text)' }}>
                                    ${(Number(item.unitPrice) * item.quantity).toLocaleString('es-AR')}
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                          {o.notes && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                              <p className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: 'var(--text-soft)' }}>Notas</p>
                              <p className="text-[13px]" style={{ color: 'var(--text-mid)' }}>{o.notes}</p>
                            </div>
                          )}
                          <div className="mt-4 pt-3 flex justify-end" style={{ borderTop: '1px solid var(--border)' }}>
                            <button
                              onClick={() => printOrderInvoice(o)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[12px] font-semibold transition-all duration-150 cursor-pointer"
                              style={{ background: 'var(--sky)', border: '1px solid var(--border)', color: 'var(--navy)' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky-mid)' }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)' }}
                            >
                              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                              </svg>
                              Imprimir / PDF
                            </button>
                          </div>
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
