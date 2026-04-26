import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CatIcon from './CatIcon'
import type { Category } from '../types'

interface CatProduct {
  code: string
  name: string
  info: string
}

interface CatData {
  label: string
  filter: string
  products: CatProduct[]
}

const LANDING_CATS: Record<string, CatData> = {
  rodilleras: { label: 'Rodilleras', filter: 'rodilleras', products: [
    { code: '000A', name: 'Rodillera Orificio Abierta Universal', info: 'Corta / Larga' },
    { code: '01',   name: 'Rodillera Tubular Lisa',               info: 'T1 · T2 · T3 · T4 · T5' },
    { code: '02',   name: 'Rodillera Tubular Orificio',           info: 'T1 · T2 · T3 · T4 · T5' },
    { code: '04',   name: 'Rodillera Orificio y Velcro',          info: 'T1 · T2 · T3 · T4 · T5' },
    { code: '05',   name: 'Rodillera Velcro Flejes Laterales',    info: 'T1 · T2 · T3 · T4 · T5' },
    { code: '06',   name: 'Rodillera Velcro Monocentrica',        info: 'T1 · T2 · T3 · T4 · T5' },
    { code: '120',  name: 'Suspensor Bajo Rodilla',               info: 'T1 · T2 · T3' },
    { code: '134',  name: 'Cincha Rotuliana',                     info: 'T1 · T2 · T3' },
    { code: '015',  name: 'Muslera',                              info: 'T1 · T2 · T3 · T4 · T5' },
  ]},
  tobilleras: { label: 'Tobilleras', filter: 'tobilleras', products: [
    { code: '030',  name: 'Tobillera Corta',               info: 'T1 · T2 · T3 · T4' },
    { code: '031',  name: 'Tobillera Larga',               info: 'T1 · T2 · T3 · T4' },
    { code: '033',  name: 'Tobillera Ajuste en 8',         info: 'T1 · T2 · T3 · T4' },
    { code: '036',  name: 'Inmovilizador de Tobillo',      info: 'T1 · T2 · T3 · T4' },
    { code: '055',  name: 'Gemelera',                      info: 'T1 · T2 · T3 · T4 · T5' },
  ]},
  munequeras: { label: 'Muñequeras', filter: 'munequeras', products: [
    { code: '040', name: 'Muñequera con Velcro',            info: 'T0 · T1 · T2 · T3' },
    { code: '041', name: 'Muñequera Boomerang con Pulgar',  info: 'T0 · T1 · T2 · T3' },
    { code: '043', name: 'Muñequera Dedo Libre',            info: 'T0 · T1 · T2 · T3' },
    { code: '045', name: 'Inmovilizador Muñeca Largo',      info: 'Der./Izq. · T1-T3' },
  ]},
  coderas: { label: 'Coderas', filter: 'coderas', products: [
    { code: '050', name: 'Codera Larga',                          info: 'T1 · T2 · T3' },
    { code: '051', name: 'Codera Larga con Orificio y Velcro',    info: 'T1 · T2 · T3' },
    { code: '052', name: 'Codera Anticodo-Tenista',               info: 'T1 · T2 · T3 · T4' },
  ]},
  fajas: { label: 'Fajas & Espalda', filter: 'fajas', products: [
    { code: '020', name: 'Faja Lumbar',                    info: 'T1 · T2 · T3 · T4 · T5' },
    { code: '022', name: 'Faja Lumbar con Ballenas',       info: 'T1 · T2 · T3 · T4 · T5' },
    { code: '023', name: 'Faja Doble Ajuste con Ballenas', info: 'T1 · T2 · T3 · T4 · T5' },
    { code: '027', name: 'Corrector Postural de Espalda',  info: 'T1 · T2 · T3' },
  ]},
  inmovilizadores: { label: 'Inmovilizadores', filter: 'inmovilizadores', products: [
    { code: 'INM.50', name: 'Inmovilizador Rodilla Velour 50cm', info: 'T0–T4' },
    { code: 'INM.60', name: 'Inmovilizador Rodilla Velour 60cm', info: 'T0–T4' },
    { code: 'TPANEL', name: 'Inmov. Tripanel Velour 55cm',       info: 'Universal' },
    { code: 'FUNDA',  name: 'Funda Bota Walker Velour 8mm',      info: 'T0–T4' },
  ]},
  correctores: { label: 'Hombros & Espalda', filter: 'fajas', products: [
    { code: '026',   name: 'Hombrera Universal',              info: 'Universal' },
    { code: '024',   name: 'Soporte de Clavícula (Strap)',    info: 'T0 · T1 · T2 · T3' },
    { code: 'CABEST',name: 'Cabestrillo Velpeau Vietnam',     info: 'Universal' },
  ]},
  otros: { label: 'Otros', filter: 'otros', products: [
    { code: '039',  name: 'Corrector de Juanetes', info: 'Der./Izq. · T1 · T2' },
    { code: 'MASC', name: 'Máscara Simple',        info: 'Universal' },
    { code: 'TAPAB',name: 'Tapaboca',              info: 'Universal' },
  ]},
}

interface Props {
  catId: Category | string | null
  onClose: () => void
}

export default function CategoryModal({ catId, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!catId) return null
  const cat = LANDING_CATS[catId]
  if (!cat) return null

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-5"
      style={{ background: 'rgba(8,18,40,.65)', backdropFilter: 'blur(5px)', opacity: 1 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[760px] flex flex-col animate-fadeIn"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          maxHeight: '86vh',
          boxShadow: '0 24px 64px rgba(18,38,78,.28)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3.5 px-6 py-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div
            className="w-[52px] h-[52px] flex items-center justify-center rounded-[14px] flex-shrink-0 text-white"
            style={{ background: 'linear-gradient(135deg,var(--navy),var(--blue))' }}
          >
            <CatIcon cat={catId as Category} size={26} />
          </div>
          <div>
            <p className="text-[20px] font-bold font-serif" style={{ color: 'var(--text)' }}>{cat.label}</p>
            <p className="text-[13px]" style={{ color: 'var(--text-soft)' }}>{cat.products.length} productos</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-[8px] text-base cursor-pointer transition-colors duration-150 flex-shrink-0"
            style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-soft)' }}
          >✕</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 no-scrollbar">
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {cat.products.map((prod) => (
              <div
                key={prod.code + prod.name}
                className="flex items-start gap-2.5 p-3.5 rounded-[10px] transition-all duration-150"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text)' }}>
                  <CatIcon cat={catId as Category} size={20} />
                </div>
                <div>
                  <span
                    className="text-[11px] font-bold px-1.5 py-0.5 rounded inline-block mb-1"
                    style={{ fontFamily: 'Courier New,monospace', color: 'var(--blue)', background: 'var(--sky)' }}
                  >{prod.code}</span>
                  <p className="text-[12px] font-semibold leading-[1.35] mb-0.5" style={{ color: 'var(--text)' }}>{prod.name}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>{prod.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 px-6 py-3.5 flex-shrink-0"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            Podés agregar al carrito desde el catálogo completo.
          </p>
          <Link
            to={`/productos?filter=${cat.filter}`}
            onClick={onClose}
            className="px-5 py-2 rounded-[9px] text-[13px] font-bold text-white whitespace-nowrap transition-colors duration-150"
            style={{ background: 'var(--navy)' }}
          >
            Ver en catálogo →
          </Link>
        </div>
      </div>
    </div>
  )
}
