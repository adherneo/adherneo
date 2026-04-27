import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CatIcon from '../components/CatIcon'
import { useCart } from '../store/cart'
import { useAuth } from '../store/auth'

const EJS_PUBLIC_KEY  = 'V2bRqh3q4CJXT8Cbt'
const EJS_SERVICE_ID  = 'service_r5i4s3b'
const EJS_TEMPLATE_ID = 'template_0h7uglo'

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
  const { items, updateQty, remove, clear, total } = useCart()
  const { user } = useAuth()

  const [name, setName]   = useState(user?.name  ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [editEmail, setEditEmail] = useState(false)

  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const n = total()
  const effectiveEmail = (user && !editEmail) ? user.email : email

  function buildEmailBody() {
    const grouped: Record<string, { code: string; name: string; entries: { size: string; qty: number }[] }> = {}
    items.forEach((item) => {
      const k = `${item.code}||${item.name}`
      if (!grouped[k]) grouped[k] = { code: item.code, name: item.name, entries: [] }
      grouped[k].entries.push({ size: item.size, qty: item.qty })
    })
    const lines = Object.values(grouped).map((p) => {
      const parts = p.entries.map((e) => `${e.size} (${e.qty})`).join('  ')
      return `- ${p.code}. ${p.name}: ${parts}`
    })
    let body = `Nuevo pedido de ${name}\nEmail: ${effectiveEmail}\n`
    if (phone) body += `Teléfono: ${phone}\n`
    body += `\nArtículos pedidos:\n${lines.join('\n')}\n\nTotal: ${n} artículo${n !== 1 ? 's' : ''}`
    if (notes) body += `\n\nNotas: ${notes}`
    return body
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
            productId:   i.productId,
          })),
        }),
      })
    } catch { /* non-critical */ }
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
        subject:  `Nuevo Pedido - ${name}`,
        body:     buildEmailBody(),
        reply_to: effectiveEmail,
      })
      await saveToDb()
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
              <div className="flex gap-3 justify-center">
                <Link to="/productos" className="btn-secondary">Seguir comprando</Link>
                <Link to="/"          className="btn-primary">Ir al inicio</Link>
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
                          <button
                            onClick={() => remove(item.key)}
                            className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[13px] cursor-pointer transition-all duration-150 flex-shrink-0"
                            style={{ border: '1px solid var(--border)', background: 'none', color: 'var(--text-soft)' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#c0392b'; (e.currentTarget as HTMLElement).style.color = '#c0392b' }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-soft)' }}
                          >✕</button>
                        </div>
                      ))}
                      <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                        <span className="text-[13px]" style={{ color: 'var(--text-mid)' }}>Total de artículos</span>
                        <span className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>{n}</span>
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
