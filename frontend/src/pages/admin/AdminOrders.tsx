import { useState, useEffect, useCallback } from 'react'

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

const STATUSES: { value: string; label: string; bg: string; color: string }[] = [
  { value: 'pending',    label: 'Pendiente',   bg: '#fff8e1', color: '#b07d00' },
  { value: 'processing', label: 'En proceso',  bg: '#e8f0ff', color: '#2563be' },
  { value: 'delivered',  label: 'Completado',  bg: '#e8f5ee', color: '#1a7c4f' },
  { value: 'cancelled',  label: 'Cancelado',   bg: '#fdf0ee', color: '#c0392b' },
]

function statusMeta(value: string) {
  return STATUSES.find((s) => s.value === value) ?? { label: value, bg: 'var(--sky)', color: 'var(--text-mid)' }
}

const LIMIT = 15

export default function AdminOrders() {
  const [orders, setOrders]   = useState<Order[]>([])
  const [total, setTotal]     = useState(0)
  const [pages, setPages]     = useState(1)
  const [page, setPage]       = useState(1)
  const [search, setSearch]   = useState('')
  const [query, setQuery]     = useState('')  // debounced
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const load = useCallback((p: number, q: string) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT), search: q })
    fetch(`/api/orders?${params}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((res: { data: Order[]; total: number; pages: number }) => {
        setOrders(res.data)
        setTotal(res.total)
        setPages(res.pages)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load(page, query) }, [page, query, load])

  // Debounce search → query
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setQuery(search) }, 350)
    return () => clearTimeout(t)
  }, [search])

  async function handleStatusChange(id: string, status: string) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
    } catch {
      alert('No se pudo actualizar el estado.')
    } finally {
      setUpdating(null)
    }
  }

  function totalItems(o: Order) {
    return o.items.reduce((s, i) => s + i.quantity, 0)
  }

  function orderTotal(o: Order) {
    const t = o.items.reduce((s, i) => s + i.quantity * (Number(i.unitPrice) || 0), 0)
    return t > 0 ? t : null
  }

  function fmt(d: string) {
    return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function printOrderBW(o: Order) {
    const date = new Date(o.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    const rows = o.items.map(i => {
      const sub = i.unitPrice ? `$${(Number(i.unitPrice) * i.quantity).toLocaleString('es-AR')}` : '-'
      const unit = i.unitPrice ? `$${Number(i.unitPrice).toLocaleString('es-AR')}` : ''
      return `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #ccc;font-family:monospace;font-size:11px;font-weight:700">${i.productCode}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #ccc;font-size:12px">${i.productName}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #ccc;font-size:11px;text-align:center">${i.size}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #ccc;font-size:12px;text-align:center;font-weight:700">${i.quantity}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #ccc;font-size:11px;text-align:right">${unit}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #ccc;font-size:12px;text-align:right;font-weight:700">${sub}</td>
      </tr>`
    }).join('')
    const tot = orderTotal(o)
    const totalRow = tot ? `<tr>
      <td colspan="5" style="padding:8px 8px 4px;text-align:right;font-size:13px;font-weight:700">Total estimado</td>
      <td style="padding:8px 8px 4px;text-align:right;font-size:15px;font-weight:700">$${tot.toLocaleString('es-AR')}</td>
    </tr>` : ''
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pedido AdherNeo</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#000;padding:18mm}
@page{size:A4;margin:12mm}
@media print{body{padding:0}.no-print{display:none}}
h1{font-family:Georgia,serif;font-size:22px;font-weight:700;margin-bottom:3px}
.sub{font-size:11px;color:#555;margin-bottom:14px}
.divider{border:none;border-top:1.5px solid #000;margin:12px 0}
.section-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#555;margin-bottom:6px}
.info-row{display:flex;gap:32px;margin-bottom:10px}
.info-item{min-width:140px}
.info-item label{font-size:9px;color:#888;display:block;margin-bottom:1px}
.info-item span{font-size:12px}
table{width:100%;border-collapse:collapse}
thead tr{border-bottom:1.5px solid #000}
thead th{padding:6px 8px;text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
thead th:nth-child(3){text-align:center}
thead th:nth-child(4),thead th:nth-child(5),thead th:last-child{text-align:right}
.footer{margin-top:20px;font-size:10px;color:#888;border-top:1px solid #ccc;padding-top:8px}
.print-btn{position:fixed;bottom:18px;right:18px;background:#000;color:#fff;border:none;border-radius:6px;padding:9px 18px;font-size:12px;font-weight:600;cursor:pointer}
</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-start">
  <div><h1>AdherNeo</h1><div class="sub">Productos ortopédicos · Pedido #${o.id.slice(0,8).toUpperCase()}</div></div>
  <div style="text-align:right;font-size:12px;color:#555">${date}</div>
</div>
<hr class="divider">
<div class="section-title">Datos del cliente</div>
<div class="info-row">
  <div class="info-item"><label>Nombre</label><span>${o.customerName}</span></div>
  <div class="info-item"><label>Email</label><span>${o.customerEmail}</span></div>
  ${o.customerPhone ? `<div class="info-item"><label>Teléfono</label><span>${o.customerPhone}</span></div>` : ''}
</div>
<hr class="divider">
<div class="section-title">Artículos</div>
<table>
  <thead><tr>
    <th>Código</th><th>Producto</th><th>Talle</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th>
  </tr></thead>
  <tbody>${rows}${totalRow}</tbody>
</table>
${o.notes ? `<div style="margin-top:14px;font-size:12px"><strong>Notas:</strong> ${o.notes}</div>` : ''}
<div class="footer">AdherNeo · adherneo@hotmail.com · Este documento no es una factura oficial</div>
<button class="print-btn no-print" onclick="window.print()">Imprimir / PDF</button>
</body></html>`
    let iframe = document.getElementById('_bw_frame') as HTMLIFrameElement | null
    if (iframe) iframe.remove()
    iframe = document.createElement('iframe')
    iframe.id = '_bw_frame'
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999;background:#fff'
    document.body.appendChild(iframe)
    iframe.srcdoc = html
    iframe.onload = () => {
      const close = document.createElement('button')
      close.textContent = '✕ Cerrar'
      close.style.cssText = 'position:fixed;top:14px;left:20px;z-index:10000;background:#333;color:#fff;border:none;border-radius:7px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:sans-serif'
      close.onclick = () => { iframe!.remove(); close.remove() }
      document.body.appendChild(close)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-[22px] font-bold" style={{ color: 'var(--navy)' }}>Pedidos</h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-soft)' }}>
            {total} pedido{total !== 1 ? 's' : ''} en total
          </p>
        </div>

        {/* Search */}
        <div className="relative" style={{ width: 280 }}>
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-soft)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="form-input pl-9"
            placeholder="Buscar por nombre, email o teléfono…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                {['Código', 'Cliente', 'Teléfono', 'Artículos', 'Total', 'Notas', 'Estado', 'Fecha'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-soft)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin inline-block" style={{ color: 'var(--text-soft)' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                    {query ? 'Sin resultados para esa búsqueda.' : 'No hay pedidos aún.'}
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const sm = statusMeta(o.status)
                  const isOpen = expanded === o.id
                  return (
                    <>
                      <tr
                        key={o.id}
                        style={{ borderBottom: isOpen ? 'none' : '1px solid var(--border)' }}
                      >
                        {/* Código */}
                        <td className="px-4 py-3">
                          <span className="text-[12px] font-bold" style={{ fontFamily: 'monospace', color: 'var(--blue)' }}>
                            #{o.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>

                        {/* Cliente */}
                        <td className="px-4 py-3" style={{ maxWidth: 180 }}>
                          <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>{o.customerName}</p>
                          <p className="text-[11px] truncate" style={{ color: 'var(--text-soft)' }}>{o.customerEmail}</p>
                        </td>

                        {/* Teléfono */}
                        <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--text-soft)' }}>
                          {o.customerPhone || '—'}
                        </td>

                        {/* Artículos — expandable */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setExpanded(isOpen ? null : o.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-semibold transition-all duration-150 cursor-pointer"
                            style={{
                              background: isOpen ? 'var(--navy)' : 'var(--sky)',
                              color: isOpen ? '#fff' : 'var(--blue)',
                              border: 'none',
                            }}
                          >
                            {totalItems(o)} art.
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                              style={{ transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </button>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-3 text-[13px] font-bold whitespace-nowrap" style={{ color: 'var(--navy)' }}>
                          {orderTotal(o) !== null ? `$${orderTotal(o)!.toLocaleString('es-AR')}` : '—'}
                        </td>

                        {/* Notas */}
                        <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--text-soft)', maxWidth: 160 }}>
                          {o.notes
                            ? <span className="line-clamp-1" title={o.notes}>{o.notes}</span>
                            : '—'
                          }
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            disabled={updating === o.id}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="text-[12px] font-semibold px-2 py-1 rounded-lg cursor-pointer transition-all duration-150 outline-none"
                            style={{
                              background: sm.bg,
                              color: sm.color,
                              border: `1px solid ${sm.color}40`,
                              opacity: updating === o.id ? 0.6 : 1,
                            }}
                          >
                            {STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </td>

                        {/* Fecha */}
                        <td className="px-4 py-3 text-[12px] whitespace-nowrap" style={{ color: 'var(--text-soft)' }}>
                          {fmt(o.createdAt)}
                        </td>
                      </tr>

                      {/* Expanded items row */}
                      {isOpen && (
                        <tr key={`${o.id}-items`} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td colSpan={8} className="px-6 pb-4 pt-2" style={{ background: 'var(--bg)' }}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-soft)' }}>
                                Productos del pedido
                              </p>
                              <button
                                onClick={() => printOrderBW(o)}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-all duration-150 cursor-pointer"
                                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-mid)' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--text-mid)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-mid)' }}
                              >
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                                </svg>
                                Imprimir B/N
                              </button>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {o.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded flex-shrink-0"
                                    style={{ fontFamily: 'monospace', color: 'var(--blue)', background: 'var(--sky)' }}>
                                    {item.productCode}
                                  </span>
                                  <span className="text-[13px] flex-1" style={{ color: 'var(--text)' }}>{item.productName}</span>
                                  <span className="text-[12px] px-2 py-0.5 rounded flex-shrink-0" style={{ background: 'var(--sky)', color: 'var(--text-mid)' }}>
                                    {item.size}
                                  </span>
                                  <span className="text-[13px] font-bold flex-shrink-0 w-8 text-right" style={{ color: 'var(--text-mid)' }}>
                                    ×{item.quantity}
                                  </span>
                                  {item.unitPrice ? (
                                    <span className="text-[12px] font-semibold flex-shrink-0 w-28 text-right" style={{ color: 'var(--navy)' }}>
                                      ${(Number(item.unitPrice) * item.quantity).toLocaleString('es-AR')}
                                    </span>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-[12px]" style={{ color: 'var(--text-soft)' }}>
              Página {page} de {pages} · {total} pedidos
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all duration-150"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: page === 1 ? 'var(--text-soft)' : 'var(--text-mid)',
                  cursor: page === 1 ? 'default' : 'pointer',
                  opacity: page === 1 ? 0.5 : 1,
                }}
              >
                ← Anterior
              </button>

              {/* Page numbers (show up to 5) */}
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, pages - 4))
                const p = start + i
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 flex items-center justify-center rounded-[7px] text-[12px] font-semibold transition-all duration-150"
                    style={{
                      border: p === page ? 'none' : '1px solid var(--border)',
                      background: p === page ? 'var(--navy)' : 'var(--bg)',
                      color: p === page ? '#fff' : 'var(--text-mid)',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all duration-150"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: page === pages ? 'var(--text-soft)' : 'var(--text-mid)',
                  cursor: page === pages ? 'default' : 'pointer',
                  opacity: page === pages ? 0.5 : 1,
                }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
