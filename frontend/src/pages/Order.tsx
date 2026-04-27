import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CatIcon from '../components/CatIcon'
import { useCart } from '../store/cart'
import { useAuth } from '../store/auth'

const EJS_PUBLIC_KEY  = 'V2bRqh3q4CJXT8Cbt'
const EJS_SERVICE_ID  = 'service_r5i4s3b'
const EJS_TEMPLATE_ID = 'template_0h7uglo'

const WA_ADMIN = '5491154140942'

declare const emailjs: {
  init: (key: string) => void
  send: (svc: string, tpl: string, params: Record<string, string>) => Promise<unknown>
}

function loadEmailJS(): Promise<void> {
  if (typeof emailjs !== 'undefined') return Promise.resolve()
  return new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
    s.onload = () => { emailjs.init(EJS_PUBLIC_KEY); resolve() }
    document.head.appendChild(s)
  })
}

export default function Order() {
  const { items, updateQty, remove, clear, total, priceTotal } = useCart()
  const { user } = useAuth()

  const [name, setName]   = useState(user?.name  ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [editEmail, setEditEmail] = useState(false)

  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const snapshot = useRef<{ name: string; email: string; phone: string; items: typeof items; subtotal: number } | null>(null)

  const n = total()
  const subtotal = priceTotal()
  const hasPrices = items.some((i) => (i.price ?? 0) > 0)
  const effectiveEmail = (user && !editEmail) ? user.email : email

  function buildEmailBody() {
    const date = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    const rows = items.map(i => {
      const sub = i.price ? `$${(i.price * i.qty).toLocaleString('es-AR')}` : '—'
      const unit = i.price ? `$${i.price.toLocaleString('es-AR')}` : ''
      return `<tr>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px;color:#12264e;font-weight:700">${i.code}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:13px">${i.name}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;text-align:center;color:#666">${i.size}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:center;font-weight:700">${i.qty}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:12px;text-align:right;color:#555">${unit}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:right;font-weight:700;color:#12264e">${sub}</td>
      </tr>`
    }).join('')
    const totalRow = hasPrices ? `<tr>
      <td colspan="5" style="padding:10px 10px 6px;text-align:right;font-size:14px;font-weight:700;color:#333">Total estimado</td>
      <td style="padding:10px 10px 6px;text-align:right;font-size:16px;font-weight:700;color:#12264e">$${subtotal.toLocaleString('es-AR')}</td>
    </tr>` : ''
    const notesRow = notes ? `<div style="margin-top:16px;padding:12px;background:#f9f9f9;border-radius:8px;font-size:13px;color:#444"><strong>Notas:</strong> ${notes}</div>` : ''
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;padding:24px;margin:0">
<div style="max-width:620px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
  <div style="background:#12264e;padding:20px 28px;display:flex;justify-content:space-between;align-items:center">
    <div><span style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:#fff">AdherNeo</span><div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:2px">Productos ortopédicos</div></div>
    <div style="text-align:right"><div style="background:rgba(255,255,255,.2);color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:.06em">NUEVO PEDIDO</div><div style="font-size:12px;color:rgba(255,255,255,.6);margin-top:5px">${date}</div></div>
  </div>
  <div style="padding:24px 28px">
    <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#888;margin:0 0 10px">Datos del cliente</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr><td style="padding:4px 0;font-size:12px;color:#888;width:90px">Nombre</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a;font-weight:600">${name}</td></tr>
      <tr><td style="padding:4px 0;font-size:12px;color:#888">Email</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a">${effectiveEmail}</td></tr>
      ${phone ? `<tr><td style="padding:4px 0;font-size:12px;color:#888">Teléfono</td><td style="padding:4px 0;font-size:13px;color:#1a1a1a">${phone}</td></tr>` : ''}
    </table>
    <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#888;margin:0 0 8px">Artículos</p>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:#f5f8ff">
        <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#555">Cód.</th>
        <th style="padding:8px 10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#555">Producto</th>
        <th style="padding:8px 10px;text-align:center;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#555">Talle</th>
        <th style="padding:8px 10px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#555">Cant.</th>
        <th style="padding:8px 10px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#555">P. Unit.</th>
        <th style="padding:8px 10px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#555">Subtotal</th>
      </tr></thead>
      <tbody>${rows}${totalRow}</tbody>
    </table>
    ${notesRow}
  </div>
  <div style="padding:14px 28px;border-top:1px solid #eee;font-size:11px;color:#aaa;text-align:center">adherneo@hotmail.com · Este documento no es una factura oficial</div>
</div>
</body></html>`
  }

  async function saveToDb() {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName:  name.trim(),
          customerEmail: effectiveEmail,
          customerPhone: phone.trim() || null,
          notes:         notes.trim() || null,
          userId:        user?.id ?? null,
          items: items.map((i) => ({
            productCode: i.code,
            productName: i.name,
            size:        i.size,
            quantity:    i.qty,
            unitPrice:   i.price ?? null,
            productId:   i.productId,
          })),
        }),
      })
    } catch { /* non-critical */ }
  }

  function openWA() {
    const s = snapshot.current
    if (!s) return
    const lines = s.items.map(i => `- ${i.code}. ${i.name} | ${i.size} x${i.qty}${i.price ? ` ($${(i.price * i.qty).toLocaleString('es-AR')})` : ''}`).join('\n')
    const totalLine = s.subtotal > 0 ? `\nTotal: $${s.subtotal.toLocaleString('es-AR')}` : ''
    const msg = `Hola Hernan, soy ${s.name}, quería realizar un pedido con los siguientes productos:\n\n${lines}${totalLine}\n\nEmail: ${s.email}${s.phone ? `\nTel: ${s.phone}` : ''}`
    window.open(`https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    if (!name.trim()) { setErrorMsg('Por favor ingresá tu nombre.'); return }
    if (!effectiveEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail)) {
      setErrorMsg('Por favor ingresá un email válido.'); return
    }
    if (!items.length) { setErrorMsg('El carrito está vacío.'); return }

    setStatus('sending')
    try {
      await loadEmailJS()
      await emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, {
        subject:  `Nuevo Pedido - ${name.trim()}`,
        body:     buildEmailBody(),
        reply_to: effectiveEmail,
      })
      await saveToDb()
      snapshot.current = { name: name.trim(), email: effectiveEmail, phone: phone.trim(), items: [...items], subtotal }
      clear()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Hubo un error al enviar. Verificá tu conexión o intentá de nuevo.')
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh' }}>
        <main className="max-w-[1100px] mx-auto px-4 md:px-10 pt-9 pb-20">

          {/* Success */}
          {status === 'success' && (
            <div className="max-w-[560px] mx-auto mt-15 text-center p-10 rounded-[20px]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-6 text-[34px]" style={{ background: '#e8f5ee', color: '#1a7c4f' }}>✓</div>
              <h2 className="font-serif text-[24px] font-bold mb-3" style={{ color: 'var(--text)' }}>¡Pedido enviado!</h2>
              <p className="text-[15px] leading-[1.7] mb-7" style={{ color: 'var(--text-mid)' }}>
                Recibimos el pedido de <strong>{name}</strong>. Te contactaremos a <strong>{effectiveEmail}</strong> a la brevedad.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                <Link to="/productos" className="btn-secondary">Seguir comprando</Link>
                <Link to="/"          className="btn-primary">Ir al inicio</Link>
              </div>
              <div className="flex justify-center pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={openWA}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-[9px] text-[13px] font-semibold transition-all duration-150 cursor-pointer"
                  style={{ background: '#25d366', border: 'none', color: '#fff' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1da851' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#25d366' }}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  Enviar por WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* Empty cart */}
          {!items.length && status !== 'success' && (
            <div className="text-center py-24">
              <div className="flex justify-center mb-5" style={{ color: 'var(--text-soft)' }}>
                <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <h2 className="font-serif text-[22px] font-bold mb-2.5" style={{ color: 'var(--text)' }}>Tu carrito está vacío</h2>
              <p className="text-[15px] mb-7" style={{ color: 'var(--text-mid)' }}>Agregá productos desde el catálogo para continuar.</p>
              <Link to="/productos" className="btn-primary">Ver catálogo →</Link>
            </div>
          )}

          {/* Order form */}
          {!!items.length && status !== 'success' && (
            <>
              <h1 className="font-serif text-[24px] md:text-[26px] font-bold mb-2" style={{ color: 'var(--navy)' }}>Confirmar Pedido</h1>
              <p className="text-[14px] mb-6" style={{ color: 'var(--text-soft)' }}>Revisá tu selección y completá tus datos para enviarnos el pedido.</p>

              <div className="grid gap-6" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
                <div className="grid gap-6 md:grid-cols-[1fr_380px]">

                  {/* Left: cart items */}
                  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>Resumen del pedido</span>
                      <span className="text-[13px]" style={{ color: 'var(--text-soft)' }}>{items.length} línea{items.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="px-5 py-4">
                      {items.map((item) => (
                        <div key={item.key} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                          <div className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,var(--sky),var(--sky-mid))', color: 'var(--text)' }}>
                            <CatIcon cat={item.cat} size={22} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded inline-block mb-1" style={{ fontFamily: 'Courier New,monospace', color: 'var(--blue)', background: 'var(--sky)' }}>{item.code}</span>
                            <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>{item.name}</p>
                            <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>{item.size}</p>
                          </div>
                          <div className="flex items-center overflow-hidden rounded-[7px] flex-shrink-0" style={{ border: '1.5px solid var(--border)', background: 'var(--bg)' }}>
                            <button className="w-[26px] h-7 flex items-center justify-center cursor-pointer" style={{ background: 'none', border: 'none', color: 'var(--text-mid)', fontSize: 15 }}
                              onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                            <div className="w-[30px] h-7 text-center text-[13px] font-bold leading-7" style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', color: 'var(--text)', background: 'var(--bg)' }}>{item.qty}</div>
                            <button className="w-[26px] h-7 flex items-center justify-center cursor-pointer" style={{ background: 'none', border: 'none', color: 'var(--text-mid)', fontSize: 15 }}
                              onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                          </div>
                          {hasPrices && (
                            <div className="text-right flex-shrink-0 w-24 hidden sm:block">
                              {item.price ? (
                                <>
                                  <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
                                    ${(item.price * item.qty).toLocaleString('es-AR')}
                                  </p>
                                  <p className="text-[10px]" style={{ color: 'var(--text-soft)' }}>
                                    ${item.price.toLocaleString('es-AR')} c/u
                                  </p>
                                </>
                              ) : (
                                <span className="text-[11px]" style={{ color: 'var(--text-soft)' }}>—</span>
                              )}
                            </div>
                          )}
                          <button
                            onClick={() => remove(item.key)}
                            className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[13px] cursor-pointer transition-all duration-150 flex-shrink-0"
                            style={{ border: '1px solid var(--border)', background: 'none', color: 'var(--text-soft)' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#c0392b'; (e.currentTarget as HTMLElement).style.color = '#c0392b' }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-soft)' }}
                          >✕</button>
                        </div>
                      ))}
                      <div className="mt-4 pt-4 flex flex-col gap-1.5" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="flex justify-between items-center">
                          <span className="text-[13px]" style={{ color: 'var(--text-mid)' }}>Total de artículos</span>
                          <span className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{n}</span>
                        </div>
                        {hasPrices && (
                          <div className="flex justify-between items-center pt-1.5 mt-0.5" style={{ borderTop: '1px solid var(--border)' }}>
                            <span className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Total estimado</span>
                            <span className="text-[17px] font-bold" style={{ color: 'var(--navy)' }}>
                              ${subtotal.toLocaleString('es-AR')}
                            </span>
                          </div>
                        )}
                      </div>
                      <Link to="/productos" className="inline-flex items-center gap-1.5 mt-3.5 text-[13px] font-medium" style={{ color: 'var(--text-mid)' }}>
                        ← Seguir agregando
                      </Link>
                    </div>
                  </div>

                  {/* Right: form */}
                  <div className="rounded-xl overflow-hidden self-start" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>Tus datos</span>
                    </div>
                    <div className="px-5 py-5">
                      <form onSubmit={handleSubmit} noValidate>

                        {/* Name — always editable, pre-filled if logged in */}
                        <div className="mb-4">
                          <label className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                            Nombre completo <span style={{ color: '#c0392b' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Juan Pérez"
                            className="form-input"
                            required
                          />
                        </div>

                        {/* Email — info badge if logged in, input if not */}
                        {user && !editEmail ? (
                          <div className="mb-4">
                            <label className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                              Email
                            </label>
                            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: 'var(--sky)', border: '1px solid var(--border)' }}>
                              <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{user.email}</span>
                              <button
                                type="button"
                                onClick={() => { setEmail(user.email); setEditEmail(true) }}
                                className="text-[11px] font-semibold ml-3 flex-shrink-0 transition-colors duration-150"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)' }}
                              >
                                Cambiar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <label className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                              Email <span style={{ color: '#c0392b' }}>*</span>
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="juan@ejemplo.com"
                                className="form-input flex-1"
                                required
                              />
                              {user && (
                                <button
                                  type="button"
                                  onClick={() => setEditEmail(false)}
                                  className="px-2.5 rounded-lg text-[11px] font-semibold flex-shrink-0"
                                  style={{ background: 'var(--sky)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-mid)' }}
                                >
                                  Restaurar
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Phone */}
                        <div className="mb-4">
                          <label className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                            Teléfono (opcional)
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+54 11 1234-5678"
                            className="form-input"
                          />
                        </div>

                        {/* Notes */}
                        <div className="mb-4">
                          <label className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                            Notas adicionales (opcional)
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Consultas, preferencias de entrega…"
                            className="form-input resize-y"
                            style={{ height: 80 }}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={status === 'sending'}
                          className="w-full py-3.5 mt-1 rounded-[10px] text-[15px] font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-65"
                          style={{ background: status === 'sending' ? 'var(--blue)' : 'var(--navy)', border: 'none' }}
                        >
                          {status === 'sending' ? 'Enviando…' : 'Confirmar Pedido'}
                        </button>

                        {errorMsg && (
                          <div className="mt-2.5 px-3.5 py-2.5 rounded-[8px] text-[13px]" style={{ background: '#fdf0ee', border: '1px solid rgba(192,57,43,.25)', color: '#c0392b' }}>
                            {errorMsg}
                          </div>
                        )}

                        <p className="text-[11px] text-center mt-2.5 leading-[1.6]" style={{ color: 'var(--text-soft)' }}>
                          Tu pedido se envía a <strong>adherneo@hotmail.com</strong>.<br />Te responderemos a la brevedad.
                        </p>
                      </form>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}
