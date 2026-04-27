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
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    if (p) { setSelectedSize(null); setQty(1); setAdded(false); setImgIndex(0) }
  }, [p])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (!p) return
      if (e.key === 'ArrowLeft') setImgIndex((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setImgIndex((i) => Math.min((p.images?.length || 1) - 1, i + 1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, p])

  if (!p) return null

  const images = p.images?.length ? p.images : []
  const hasImages = images.length > 0
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

  function prev() { setImgIndex((i) => Math.max(0, i - 1)) }
  function next() { setImgIndex((i) => Math.min(images.length - 1, i + 1)) }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-5"
      style={{ background: 'rgba(8,18,40,.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[700px] flex overflow-hidden animate-fadeIn"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          boxShadow: '0 20px 60px rgba(18,38,78,.28)',
          maxHeight: '90vh',
        }}
      >
        {/* LEFT: Image carousel */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{
            width: '42%',
            minHeight: 420,
            background: 'var(--bg)',
            borderRadius: '18px 0 0 18px',
          }}
        >
          {hasImages ? (
            <>
              <img
                src={images[imgIndex]}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transition: 'opacity .2s' }}
              />

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    disabled={imgIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,.85)',
                      border: 'none',
                      color: '#12264e',
                      opacity: imgIndex === 0 ? 0.3 : 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,.18)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 3L5 8l5 5"/>
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    disabled={imgIndex === images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,.85)',
                      border: 'none',
                      color: '#12264e',
                      opacity: imgIndex === images.length - 1 ? 0.3 : 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,.18)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3l5 5-5 5"/>
                    </svg>
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className="rounded-full transition-all duration-150 cursor-pointer"
                        style={{
                          width: i === imgIndex ? 18 : 6,
                          height: 6,
                          background: i === imgIndex ? '#fff' : 'rgba(255,255,255,.45)',
                          border: 'none',
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Image count badge */}
              {images.length > 1 && (
                <div
                  className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-[11px] font-semibold text-white"
                  style={{ background: 'rgba(8,18,40,.55)', backdropFilter: 'blur(4px)' }}
                >
                  {imgIndex + 1}/{images.length}
                </div>
              )}
            </>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,var(--sky),var(--sky-mid))', color: 'var(--text)' }}
            >
              <CatIcon cat={p.cat} size={72} />
            </div>
          )}
        </div>

        {/* RIGHT: Info */}
        <div className="flex flex-col flex-1 px-6 pt-5 pb-6 overflow-y-auto">
          {/* Close button */}
          <div className="flex justify-end mb-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-[30px] h-[30px] flex items-center justify-center rounded-[7px] cursor-pointer transition-colors duration-150"
              style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-soft)' }}
            >✕</button>
          </div>

          {/* Code + Name */}
          <div className="mb-3">
            <span
              className="text-[12px] font-extrabold px-2.5 py-1 rounded-[6px] inline-block mb-2"
              style={{ fontFamily: 'Courier New,monospace', color: 'var(--blue)', background: 'var(--sky)' }}
            >{p.code}</span>
            <h3 className="text-[17px] font-bold leading-[1.3] mb-1" style={{ color: 'var(--text)' }}>{p.name}</h3>
            <p className="text-[12px]" style={{ color: 'var(--text-soft)' }}>{CAT_LABELS[p.cat] || p.cat}</p>
          </div>

          {p.description && (
            <p className="text-[13px] leading-[1.55] mb-3" style={{ color: 'var(--text-mid)' }}>{p.description}</p>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0 14px' }} />

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
                    className="px-4 py-1.5 rounded-[7px] text-[13px] font-semibold cursor-pointer transition-all duration-150"
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
          <div className="flex items-center gap-3.5 mt-2">
            <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-soft)' }}>Cantidad</p>
            <div className="flex items-center overflow-hidden rounded-[8px]" style={{ border: '1.5px solid var(--border)', background: 'var(--bg)' }}>
              <button className="w-[34px] h-[36px] flex items-center justify-center text-lg cursor-pointer"
                style={{ background: 'none', border: 'none', color: 'var(--text-mid)' }}
                onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <input
                type="number" value={qty} min={1} max={99}
                onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value))))}
                className="w-[48px] h-[36px] text-center text-[15px] font-bold border-0 outline-none bg-transparent"
                style={{ color: 'var(--text)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
              />
              <button className="w-[34px] h-[36px] flex items-center justify-center text-lg cursor-pointer"
                style={{ background: 'none', border: 'none', color: 'var(--text-mid)' }}
                onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            className="w-full py-3 mt-4 rounded-[10px] text-[14px] font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150"
            style={{ background: added ? '#1a7c4f' : 'var(--navy)', border: 'none' }}
          >
            {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}
