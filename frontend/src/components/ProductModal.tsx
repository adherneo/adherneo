import { useState, useEffect } from 'react'
import CatIcon from './CatIcon'
import { useCart } from '../store/cart'
import { CAT_LABELS } from '../data/catalog'
import type { Product } from '../types'

interface Props {
  product: Product | null
  onClose: () => void
}

export default function ProductModal({ product: p, onClose }: Props) {
  const add = useCart((s) => s.add)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (p) { setSelectedSize(null); setQty(1); setAdded(false) }
  }, [p])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!p) return null

  const sizeLabel = (s: number | string) => typeof s === 'number' ? `T${s}` : String(s)

  function handleAdd() {
    let size: string
    if (p!.universal && !p!.variants) {
      size = 'Universal'
    } else {
      if (!selectedSize) {
        setShake(true)
        setTimeout(() => setShake(false), 400)
        return
      }
      size = selectedSize
    }
    add({ productId: p!.id, code: p!.code, name: p!.name, cat: p!.cat, size, qty })
    setAdded(true)
    setTimeout(() => { onClose() }, 1100)
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-5"
      style={{ background: 'rgba(8,18,40,.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[440px] overflow-hidden animate-fadeIn"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          boxShadow: '0 20px 60px rgba(18,38,78,.25)',
        }}
      >
        {/* Close */}
        <div className="flex justify-end px-5 pt-4">
          <button
            onClick={onClose}
            className="w-[30px] h-[30px] flex items-center justify-center rounded-[7px] text-base cursor-pointer transition-colors duration-150"
            style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-soft)' }}
          >✕</button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-[90px] h-[90px] flex items-center justify-center rounded-[24px] text-white"
              style={{ background: 'linear-gradient(135deg,var(--navy),var(--blue))', boxShadow: '0 8px 24px rgba(18,38,78,.25)' }}
            >
              {p.img
                ? <img src={p.img} alt={p.name} className="w-[70px] h-[70px] object-cover rounded-[16px]" />
                : <CatIcon cat={p.cat} size={46} />
              }
            </div>
          </div>

          <div className="text-center mb-4">
            <span
              className="text-[13px] font-extrabold px-2.5 py-1 rounded-[6px] inline-block mb-1.5"
              style={{ fontFamily: 'Courier New,monospace', color: 'var(--blue)', background: 'var(--sky)' }}
            >{p.code}</span>
            <p className="text-[16px] font-bold leading-[1.3] mb-1" style={{ color: 'var(--text)' }}>{p.name}</p>
            <p className="text-[12px]" style={{ color: 'var(--text-soft)' }}>{CAT_LABELS[p.cat] || p.cat}</p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '14px 0' }} />

          {/* Sizes */}
          {p.universal && !p.variants ? (
            <div className="mb-3">
              <span
                className="text-[14px] px-3.5 py-2 rounded-lg inline-block"
                style={{ background: 'var(--sky)', color: 'var(--text-mid)' }}
              >Universal</span>
            </div>
          ) : (
            <div className="mb-3">
              <p className="text-[10px] font-bold tracking-wider uppercase mb-2" style={{ color: 'var(--text-soft)' }}>
                {p.variants ? 'Variante' : 'Talle'}
              </p>
              <div className={`flex flex-wrap gap-2 ${shake ? 'animate-shake' : ''}`}>
                {(p.variants ?? (p.sizes?.map(sizeLabel) ?? [])).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="px-4 py-1.5 rounded-[7px] text-[14px] font-semibold cursor-pointer transition-all duration-150"
                    style={{
                      border: `1.5px solid ${selectedSize === s ? 'var(--navy)' : 'var(--border)'}`,
                      background: selectedSize === s ? 'var(--navy)' : 'var(--bg)',
                      color: selectedSize === s ? '#fff' : 'var(--text-mid)',
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="flex items-center gap-3.5 mt-3.5">
            <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-soft)' }}>Cantidad</p>
            <div className="flex items-center overflow-hidden rounded-[8px]" style={{ border: '1.5px solid var(--border)', background: 'var(--bg)' }}>
              <button className="w-[34px] h-[36px] flex items-center justify-center text-lg cursor-pointer transition-colors duration-150"
                style={{ background: 'none', border: 'none', color: 'var(--text-mid)' }}
                onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <input
                type="number" value={qty} min={1} max={99}
                onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value))))}
                className="w-[52px] h-[36px] text-center text-[15px] font-bold border-0 outline-none bg-transparent"
                style={{ color: 'var(--text)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
              />
              <button className="w-[34px] h-[36px] flex items-center justify-center text-lg cursor-pointer transition-colors duration-150"
                style={{ background: 'none', border: 'none', color: 'var(--text-mid)' }}
                onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
            </div>
          </div>

          {/* Add btn */}
          <button
            onClick={handleAdd}
            className="w-full py-3 mt-4 rounded-[10px] text-[15px] font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150"
            style={{ background: added ? '#1a7c4f' : 'var(--navy)', border: 'none' }}
          >
            {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}
