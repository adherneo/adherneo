import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CategoryModal from '../components/CategoryModal'
import CatIcon from '../components/CatIcon'
import type { Category } from '../types'

const CATS: { id: Category | string; name: string; count: string }[] = [
  { id: 'rodilleras',      name: 'Rodilleras',       count: '14 modelos · T1 al T5' },
  { id: 'tobilleras',      name: 'Tobilleras',        count: '7 modelos · T1 al T4' },
  { id: 'munequeras',      name: 'Muñequeras',        count: '7 modelos · T0 al T3' },
  { id: 'coderas',         name: 'Coderas',           count: '4 modelos · T1 al T4' },
  { id: 'fajas',           name: 'Fajas & Espalda',   count: '11 modelos · T1 al T5' },
  { id: 'inmovilizadores', name: 'Inmovilizadores',   count: '5 modelos' },
  { id: 'correctores',     name: 'Hombros & Espalda', count: '4 modelos' },
  { id: 'otros',           name: 'Otros',             count: 'Máscara, Tapaboca, Juanetes…' },
]

const IC = {
  gem: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 18 3 22 9 12 22 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="3" x2="6" y2="9"/><line x1="12" y1="3" x2="18" y2="9"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  ruler: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="1"/><line x1="7" y1="7" x2="7" y2="12"/><line x1="12" y1="7" x2="12" y2="17"/><line x1="17" y1="7" x2="17" y2="12"/></svg>,
  factory: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20v-7l-5-5-3 3-4-6-6 5v10z"/><line x1="7" y1="14" x2="7" y2="16"/><line x1="12" y1="14" x2="12" y2="16"/><line x1="17" y1="14" x2="17" y2="16"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  pin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  gear: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  truck: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
} satisfies Record<string, ReactNode>

const FEATURES: { icon: ReactNode; title: string; desc: string }[] = [
  { icon: IC.gem,     title: 'Materiales premium',          desc: 'Utilizamos telas y componentes seleccionados por su resistencia, transpirabilidad y confort prolongado.' },
  { icon: IC.shield,  title: 'Control de calidad estricto', desc: 'Cada producto pasa por controles antes de salir al mercado para garantizar que cumpla con los estándares que nos exigimos.' },
  { icon: IC.ruler,   title: 'Talles para todos',           desc: 'Amplia variedad de talles — hasta T5 — para que cada persona encuentre el ajuste ideal sin comprometer el soporte.' },
  { icon: IC.factory, title: 'Fabricación propia',          desc: 'Todo se produce en nuestra planta, lo que nos permite controlar cada etapa y responder rápido a los pedidos.' },
  { icon: IC.users,   title: 'Atención personalizada',      desc: 'Asesoramiento directo para distribuidores, farmacias y ortopedias que buscan productos confiables.' },
  { icon: IC.zap,     title: 'Entrega ágil',                desc: 'Proceso de pedidos simple y despacho rápido para que nunca falte stock en tu negocio.' },
]

export default function Landing() {
  const [catModal, setCatModal] = useState<string | null>(null)
  const revealRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 },
    )
    revealRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const addReveal = (el: HTMLElement | null, delay = 0) => {
    if (!el) return
    el.classList.add('reveal')
    if (delay) el.classList.add(`reveal-d${delay}`)
    revealRefs.current.push(el)
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)' }}>

        {/* ── HERO ── */}
        <section
          id="inicio"
          className="min-h-screen flex items-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg,var(--surface) 0%,var(--sky) 60%,var(--sky-mid) 100%)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 70% 60% at 70% 50%,rgba(37,99,190,.08) 0%,transparent 70%)',
          }} />

          <div className="w-full max-w-[1160px] mx-auto px-10 py-20 grid md:grid-cols-2 gap-15 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-widest uppercase mb-6"
                style={{ background: 'var(--sky-mid)', border: '1px solid var(--border)', color: 'var(--blue)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)' }} />
                Fabricación Nacional · Argentina
              </div>

              <h1 className="font-serif text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.15] font-bold mb-5" style={{ color: 'var(--navy)' }}>
                Cuidado ortopédico de{' '}
                <em className="not-italic" style={{ color: 'var(--blue)' }}>calidad</em>
                {' '}para cada momento
              </h1>

              <p className="text-[17px] leading-[1.7] mb-9 max-w-[480px]" style={{ color: 'var(--text-mid)' }}>
                Más de 60 productos ortopédicos diseñados para brindar soporte, confort y recuperación.
                Fabricados con materiales de primera calidad, adaptados a cada necesidad.
              </p>

              <div className="flex gap-3 flex-wrap mb-12">
                <Link to="/productos" className="btn-primary">Ver catálogo completo</Link>
                <Link to="/pedido"    className="btn-secondary">Realizar un pedido</Link>
              </div>

              <div className="flex gap-6 flex-wrap">
                {[['60+', 'Productos disponibles'], ['8', 'Categorías'], ['5', 'Talles por producto']].map(([num, label], i) => (
                  <div key={label} className="flex items-center gap-6">
                    {i > 0 && <div className="h-10 w-px self-stretch" style={{ background: 'var(--border)' }} />}
                    <div>
                      <div className="font-serif text-[28px] font-bold leading-none mb-1" style={{ color: 'var(--navy)' }}>{num}</div>
                      <div className="text-[12px]" style={{ color: 'var(--text-soft)' }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div
                className="w-[420px] h-[420px] flex items-center justify-center animate-morph"
                style={{ background: 'linear-gradient(135deg,var(--navy) 0%,var(--blue) 100%)', boxShadow: '0 30px 80px rgba(18,38,78,.25)' }}
              >
                <div className="text-center p-8">
                  <svg viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg" style={{ height: 90, width: 'auto' }}>
                    <circle cx="43" cy="36" r="30" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2.8" />
                    <text x="43" y="52" textAnchor="middle" fontFamily="Georgia,serif" fontSize="42" fontWeight="bold" fill="rgba(255,255,255,.95)">A</text>
                    <text x="90" y="55" textAnchor="start" fontFamily="Georgia,serif" fontSize="36" fontWeight="bold" fill="rgba(255,255,255,.95)">Adher</text>
                    <text x="147" y="74" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fill="rgba(255,255,255,.7)" letterSpacing="4">neo</text>
                  </svg>
                  <p className="font-serif text-[13px] tracking-[3px] uppercase mt-4" style={{ color: 'rgba(255,255,255,.6)' }}>
                    Ortopedia Argentina
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUIÉNES SOMOS ── */}
        <section id="quienes" className="py-24 px-10" style={{ background: 'var(--surface)' }}>
          <div className="max-w-[1160px] mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div ref={(el) => addReveal(el as HTMLElement)}>
              <p className="text-[11px] font-bold tracking-[.1em] uppercase mb-3" style={{ color: 'var(--blue)' }}>Quiénes Somos</p>
              <h2 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.25] mb-4" style={{ color: 'var(--navy)' }}>
                Compromiso con tu recuperación y bienestar
              </h2>
              <div className="w-15 h-0.5 mb-7 rounded" style={{ background: 'linear-gradient(90deg,var(--navy),var(--blue))' }} />
              {[
                <><strong style={{color:'var(--text)'}}>AdherNeo</strong> es una empresa argentina especializada en la fabricación de productos ortopédicos de alta calidad. Desde La Lonja, Pilar, llegamos a todo el país con soluciones pensadas para cada etapa de la recuperación.</>,
                'Trabajamos con materiales seleccionados y procesos de fabricación que garantizan durabilidad, comodidad y efectividad en cada producto que sale de nuestras manos.',
                'Nuestro compromiso es que cada persona acceda al soporte ortopédico que necesita, con productos de calidad y un servicio personalizado.',
              ].map((text, i) => (
                <p key={i} className="text-[16px] leading-[1.8] mb-5" style={{ color: 'var(--text-mid)' }}>{text}</p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: IC.pin,   title: '100% Nacional',  desc: 'Fabricación propia en Argentina con control de calidad en cada etapa.', delay: 1 },
                { icon: IC.gem,   title: 'Alta calidad',   desc: 'Materiales seleccionados para máxima durabilidad y confort de uso.', delay: 2 },
                { icon: IC.ruler, title: 'Talles variados', desc: 'Hasta 5 talles por producto para un ajuste preciso a cada persona.', delay: 3 },
                { icon: IC.truck, title: 'Entrega ágil',   desc: 'Distribución eficiente para llegar donde el cliente lo necesita.', delay: 4 },
              ].map((v) => (
                <div
                  key={v.title}
                  ref={(el) => addReveal(el as HTMLElement, v.delay)}
                  className="p-6 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3.5"
                    style={{ background: 'linear-gradient(135deg,var(--navy),var(--blue))', color: '#fff' }}
                  >
                    <span style={{ width: 22, height: 22, display: 'inline-flex' }}>{v.icon}</span>
                  </div>
                  <p className="text-[15px] font-bold mb-1.5" style={{ color: 'var(--text)' }}>{v.title}</p>
                  <p className="text-[13px] leading-[1.5]" style={{ color: 'var(--text-mid)' }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUÉ FABRICAMOS ── */}
        <section id="fabricamos" className="py-24 px-10" style={{ background: 'var(--bg)' }}>
          <div className="max-w-[1160px] mx-auto">
            <div className="text-center mb-15">
              <p ref={(el) => addReveal(el as HTMLElement)} className="text-[11px] font-bold tracking-[.1em] uppercase mb-3" style={{ color: 'var(--blue)' }}>Qué Fabricamos</p>
              <h2 ref={(el) => addReveal(el as HTMLElement)} className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.25] text-center" style={{ color: 'var(--navy)' }}>
                Línea completa de productos ortopédicos
              </h2>
              <p ref={(el) => addReveal(el as HTMLElement)} className="text-[17px] leading-[1.7] mt-4 max-w-[560px] mx-auto" style={{ color: 'var(--text-mid)' }}>
                Diseñados para brindar soporte en rodillas, tobillos, muñecas, codos, espalda y más.
              </p>
            </div>

            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {CATS.map((c, i) => (
                <div
                  key={c.id}
                  ref={(el) => addReveal(el as HTMLElement, (i % 4) + 1)}
                  onClick={() => setCatModal(c.id)}
                  className="p-7 text-center cursor-pointer rounded-xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--sky-mid)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
                >
                  {/* accent */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    style={{ background: 'linear-gradient(90deg,var(--navy),var(--blue))' }} />
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-[16px] flex items-center justify-center transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg,var(--sky),var(--sky-mid))', color: 'var(--text)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg,var(--navy),var(--blue))'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                  >
                    <CatIcon cat={c.id as Category} size={30} />
                  </div>
                  <p className="text-[15px] font-bold mb-1.5" style={{ color: 'var(--text)' }}>{c.name}</p>
                  <p className="text-[12px]" style={{ color: 'var(--text-soft)' }}>{c.count}</p>
                </div>
              ))}
            </div>

            <div ref={(el) => addReveal(el as HTMLElement)} className="text-center mt-12">
              <Link to="/productos" className="btn-primary">Ver catálogo completo →</Link>
            </div>
          </div>
        </section>

        {/* ── POR QUÉ ELEGIRNOS ── */}
        <section
          id="porque"
          className="py-24 px-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg,var(--navy) 0%,#1a3a70 50%,var(--blue) 100%)' }}
        >
          <div className="absolute inset-0 opacity-[.03] pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Crect x='36' y='34' width='2' height='4'/%3E%3C/g%3E%3C/svg%3E")` }} />

          <div className="max-w-[1160px] mx-auto relative">
            <div className="text-center mb-15">
              <p ref={(el) => addReveal(el as HTMLElement)} className="text-[11px] font-bold tracking-[.1em] uppercase mb-3" style={{ color: 'rgba(255,255,255,.6)' }}>Por Qué Elegirnos</p>
              <h2 ref={(el) => addReveal(el as HTMLElement)} className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.25] text-white">
                Calidad que se siente en cada producto
              </h2>
              <p ref={(el) => addReveal(el as HTMLElement)} className="text-[17px] leading-[1.7] mt-4 max-w-[560px] mx-auto" style={{ color: 'rgba(255,255,255,.65)' }}>
                Cada detalle de nuestros productos está pensado para dar la mejor experiencia al usuario.
              </p>
            </div>

            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  ref={(el) => addReveal(el as HTMLElement, (i % 3) + 1)}
                  className="p-8 rounded-xl transition-all duration-200 hover:-translate-y-1 backdrop-blur-[10px]"
                  style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.13)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.08)' }}
                >
                  <div className="w-9 h-9 mb-4" style={{ color: 'rgba(255,255,255,.85)' }}>{f.icon}</div>
                  <p className="text-[18px] font-bold text-white mb-2.5">{f.title}</p>
                  <p className="text-[14px] leading-[1.7]" style={{ color: 'rgba(255,255,255,.65)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-10" style={{ background: 'var(--surface)' }}>
          <div ref={(el) => addReveal(el as HTMLElement)} className="max-w-[680px] mx-auto text-center">
            <p className="text-[11px] font-bold tracking-[.1em] uppercase mb-3" style={{ color: 'var(--blue)' }}>Empezá hoy</p>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.25] mb-5" style={{ color: 'var(--navy)' }}>
              ¿Listo para hacer tu pedido?
            </h2>
            <p className="text-[17px] leading-[1.7] mb-9" style={{ color: 'var(--text-mid)' }}>
              Explorá nuestro catálogo completo o contactanos directamente.
              Te asesoramos sin compromiso sobre qué producto se adapta mejor a tu necesidad.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/pedido"    className="btn-primary">Realizar un pedido</Link>
              <Link to="/productos" className="btn-secondary">Ver catálogo</Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />

      <CategoryModal catId={catModal} onClose={() => setCatModal(null)} />
    </>
  )
}
