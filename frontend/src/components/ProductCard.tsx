import { useState } from 'react'
import CatIcon from './CatIcon'
import { useCart } from '../store/cart'
import { CAT_LABELS } from '../data/catalog'
import type { Product } from '../types'

interface Props {
  product: Product
  onPreview: (p: Product) => void
}

export default function ProductCard({ product: p, onPreview }: Props) {
  const add = useCart((s) => s.add)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [shake, setShake] = useState(false)

  const sizeLabel = (s: number | string) => typeof s === 'number' ? `T${s}` : String(s)
  const firstImg = p.images?.[0] || p.img

  function handleAdd() {
    let size: string
    if (p.universal && !p.variants) {
      size = 'Universal'
    } else {
      if (!selectedSize) {
        setShake(true)
        setTimeout(() => setShake(false), 400)
        return
      }
      size = selectedSize
    }
    add({ productId: p.id, code: p.code, name: p.name, cat: p.cat, size, qty })
    setAdded(true)
    setQty(1)
    setSelectedSize(null)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div
      className="flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 relative group"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        boxShadow: 'none',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--sky-mid)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: 'linear-gradient(90deg,var(--navy),var(--blue))' }}
      />

      {/* Image area — fills top, fades into card surface */}
      <div
        className="relative h-[160px] overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={() => onPreview(p)}
      >
        {firstImg ? (
          <img
            src={firstImg}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,var(--sky),var(--sky-mid))', color: 'var(--text)' }}
          >
            <CatIcon cat={p.cat} size={52} />
          </div>
        )}

        {/* Fade-to-surface gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 30%, var(--surface) 95%)' }}
        />

        {/* "Vista rápida" hint on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <span
            className="px-3 py-1 rounded-full text-[11px] font-semibold text-white"
            style={{ background: 'rgba(18,38,78,.55)', backdropFilter: 'blur(4px)' }}
          >
            Vista rápida
          </span>
        </div>

        {/* Code badge at bottom of image */}
        <div className="absolute bottom-2 left-3 z-10">
          <span
            className="text-[12px] font-extrabold px-2 py-0.5 rounded-[5px]"
            style={{ fontFamily: 'Courier New,monospace', color: 'var(--blue)', background: 'var(--sky)' }}
          >
            {p.code}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-3.5 pb-3.5 pt-1">
        <p className="text-[13px] font-bold leading-[1.35] mb-0.5" style={{ color: 'var(--text)' }}>{p.name}</p>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>{CAT_LABELS[p.cat] || p.cat}</p>
          {p.price != null && (
            <p className="text-[12px] font-bold" style={{ color: 'var(--blue)' }}>
              ${p.price.toLocaleString('es-AR')}
            </p>
          )}
        </div>

        {/* Size selector */}
        {p.universal && !p.variants ? (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-[5px] mb-2 inline-block" style={{ background: 'var(--sky)', color: 'var(--blue)' }}>
            Universal
          </span>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'var(--text-soft)' }}>
              {p.variants ? 'Variante' : 'Talle'}
            </p>
            <div className={`flex flex-wrap gap-1 mb-2 ${shake ? 'animate-shake' : ''}`}>
              {(p.variants ?? (p.sizes?.map(sizeLabel) ?? [])).map((s) => (
                <button
                  key={s}
                  className="px-2 py-0.5 rounded-[5px] text-[11px] font-semibold transition-all duration-150 cursor-pointer"
                  style={{
                    border: `1.5px solid ${selectedSize === s ? 'var(--navy)' : 'var(--border)'}`,
                    background: selectedSize === s ? 'var(--navy)' : 'var(--bg)',
                    color: selectedSize === s ? '#fff' : 'var(--text-mid)',
                  }}
                  onClick={() => setSelectedSize((prev) => prev === s ? null : s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Qty + Add */}
        <div className="flex gap-1.5 items-center mt-auto pt-1.5">
          <div className="flex items-center overflow-hidden flex-shrink-0 rounded-[7px]" style={{ border: '1.5px solid var(--border)', background: 'var(--bg)' }}>
            <button className="w-[26px] h-[30px] flex items-center justify-center text-base cursor-pointer transition-colors duration-150"
              style={{ background: 'none', border: 'none', color: 'var(--text-mid)' }}
              onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <input
              type="number"
              value={qty}
              min={1} max={99}
              onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value))))}
              className="w-9 h-[30px] text-center text-[13px] font-bold border-0 outline-none bg-transparent"
              style={{ color: 'var(--text)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
            />
            <button className="w-[26px] h-[30px] flex items-center justify-center text-base cursor-pointer transition-colors duration-150"
              style={{ background: 'none', border: 'none', color: 'var(--text-mid)' }}
              onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 h-[30px] px-2 rounded-[7px] text-[12px] font-bold text-white cursor-pointer transition-colors duration-150 whitespace-nowrap"
            style={{ background: added ? '#1a7c4f' : 'var(--navy)', border: 'none' }}
          >
            {added ? '✓ Agregado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
