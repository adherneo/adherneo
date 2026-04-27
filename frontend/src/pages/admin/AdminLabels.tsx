import { useState, useMemo, useRef } from 'react'

// ─── CATALOG ──────────────────────────────────────────────────────────────────
interface CatalogProduct {
  id: string
  code: string
  name: string
  sizes?: (number | string)[]
  variants?: string[]
  universal?: boolean
}

const CATALOG: CatalogProduct[] = [
  // RODILLERAS
  { id:'000A',  code:'000A',  name:'RODILLERA ORIFICIO ABIERTA',                     variants:['CORTA','LARGA','UNIVERSAL'] },
  { id:'01',    code:'01',    name:'RODILLERA TUBULAR LISA',                          sizes:[1,2,3,4,5] },
  { id:'02',    code:'02',    name:'RODILLERA TUBULAR ORIFICIO',                      sizes:[1,2,3,4,5] },
  { id:'04',    code:'04',    name:'RODILLERA ORIFICIO Y VELCRO',                     sizes:[1,2,3,4,5] },
  { id:'04A',   code:'04A',   name:'RODILLERA ORIFICIO Y VELCRO ABIERTA',             sizes:[1,2,3,4,5] },
  { id:'05',    code:'05',    name:'RODILLERA ORIFICIO VELCRO FLEJES LAT.',           sizes:[1,2,3,4,5] },
  { id:'05A',   code:'05A',   name:'RODILLERA ORIFICIO VELCRO FLEJES LAT. ABIERTA',  sizes:[1,2,3,4,5] },
  { id:'06',    code:'06',    name:'RODILLERA ORIFICIO VELCRO MONOCENTRICA',          sizes:[1,2,3,4,5] },
  { id:'06A',   code:'06A',   name:'RODILLERA ORIFICIO VELCRO MONOCENTRICA ABIERTA', sizes:[1,2,3,4,5] },
  // SUSPENSORES
  { id:'120',   code:'120',   name:'SUSPENSOR BAJO RODILLA',                          sizes:[1,2,3] },
  { id:'121D',  code:'121',   name:'SUSPENSOR SOBRE RODILLA DERECHO',                 sizes:[1,2,3] },
  { id:'121I',  code:'121',   name:'SUSPENSOR SOBRE RODILLA IZQUIERDO',               sizes:[1,2,3] },
  { id:'134',   code:'134',   name:'CINCHA ROTULIANA',                                sizes:[1,2,3] },
  // MUSLERA
  { id:'015',   code:'015',   name:'MUSLERA',                                          sizes:[1,2,3,4,5] },
  // CALZA
  { id:'060',   code:'060',   name:'CALZA REDUCTORA',                                  sizes:[1,2,3,4] },
  // FAJAS LUMBARES
  { id:'020',   code:'020',   name:'FAJA LUMBAR',                                      sizes:[1,2,3,4,5] },
  { id:'021',   code:'021',   name:'FAJA INTERCOSTAL',                                 sizes:[1,2,3,4,5] },
  { id:'022',   code:'022',   name:'FAJA LUMBAR C/BALLENAS',                           sizes:[1,2,3,4,5] },
  { id:'023',   code:'023',   name:'FAJA DOBLE AJUSTE C/BALLENAS',                    sizes:[1,2,3,4,5] },
  // CORRECTOR POSTURAL
  { id:'027',   code:'027',   name:'CORRECTOR POSTURAL DE ESPALDA',                   sizes:[1,2,3] },
  // HOMBRERA
  { id:'026',   code:'026',   name:'HOMBRERA UNIVERSAL',                               universal:true },
  // SOPORTE CLAVICULA
  { id:'024',   code:'024',   name:'SOPORTE DE CLAVICULA (STRAP)',                    sizes:[0,1,2,3] },
  // CABESTRILLO
  { id:'CABEST',code:'CABEST',name:'CABESTRILLO VELPEAU VIETNAM',                     universal:true },
  // TOBILLERAS
  { id:'030',   code:'030',   name:'TOBILLERA CORTA',                                  sizes:[1,2,3,4] },
  { id:'031',   code:'031',   name:'TOBILLERA LARGA',                                  sizes:[1,2,3,4] },
  { id:'031A',  code:'031A',  name:'TOBILLERA LARGA ABIERTA',                         sizes:[1,2,3,4] },
  { id:'033',   code:'033',   name:'TOBILLERA AJUSTE EN 8',                            sizes:[1,2,3,4] },
  { id:'034A',  code:'034A',  name:'TOBILLERA BALLENA Y CORDON',                      sizes:[1,2,3,4] },
  { id:'036',   code:'036',   name:'INMOVILIZADOR DE TOBILLO',                         sizes:[1,2,3,4] },
  // GEMELERA
  { id:'055',   code:'055',   name:'GEMELERA',                                          sizes:[1,2,3,4,5] },
  // MUÑEQUERAS
  { id:'040',   code:'040',   name:'MUÑEQUERA CON VELCRO',                             sizes:[0,1,2,3] },
  { id:'041',   code:'041',   name:'MUÑEQUERA BOOMERANG CON PULGAR',                  sizes:[0,1,2,3] },
  { id:'042',   code:'042',   name:'MUÑEQUERA BOOMERANG CON FLEJE',                   sizes:[0,1,2,3] },
  { id:'043',   code:'043',   name:'MUÑEQUERA DEDO LIBRE',                             sizes:[0,1,2,3] },
  // INMOVILIZADORES MUÑECA
  { id:'045D',  code:'045',   name:'INMOVILIZADOR MUÑECA LARGO DERECHO',              sizes:[1,2,3] },
  { id:'045I',  code:'045',   name:'INMOVILIZADOR MUÑECA LARGO IZQUIERDO',            sizes:[1,2,3] },
  { id:'046',   code:'046',   name:'INMOV. MUÑECA C/ INMOV. DE PULGAR',               universal:true },
  { id:'047D',  code:'047',   name:'INMOVILIZADOR MUÑECA CORTO DERECHO',              sizes:[1,2,3] },
  { id:'047I',  code:'047',   name:'INMOVILIZADOR MUÑECA CORTO IZQUIERDO',            sizes:[1,2,3] },
  // CODERAS
  { id:'050',   code:'050',   name:'CODERA LARGA',                                     sizes:[1,2,3] },
  { id:'051',   code:'051',   name:'CODERA LARGA C/ ORIFICIO Y VELCRO',               sizes:[1,2,3] },
  { id:'052',   code:'052',   name:'CODERA ANTICODO-TENISTA',                          sizes:[1,2,3,4] },
  { id:'053',   code:'053',   name:'CODERA LARGA C/ ORIFICIO',                        sizes:[1,2,3] },
  // CORRECTOR JUANETES
  { id:'039D',  code:'039',   name:'CORRECTOR DE JUANETES DERECHO',                   sizes:[1,2] },
  { id:'039I',  code:'039',   name:'CORRECTOR DE JUANETES IZQUIERDO',                 sizes:[1,2] },
  // INMOVILIZADORES RODILLA (VELOUR)
  { id:'INM50', code:'INM.50',name:'INMOV. RODILLA VELOUR 50CM',                      sizes:[0,1,2,3,4] },
  { id:'INM60', code:'INM.60',name:'INMOV. RODILLA VELOUR 60CM',                      sizes:[0,1,2,3,4] },
  { id:'INM65', code:'INM.65',name:'INMOV. RODILLA VELOUR 65CM',                      sizes:[0,1,2,3,4] },
  { id:'TPANEL',code:'TPANEL',name:'INMOV. RODILLA TRIPANEL VELOUR 55CM',             universal:true },
  // FUNDA BOTA
  { id:'FUNDA', code:'FUNDA', name:'FUNDA BOTA WALKER VELOUR 8MM',                    sizes:[0,1,2,3,4] },
  // MASCARAS
  { id:'MASCAR',code:'MASC',  name:'MASCARA SIMPLE',                                   universal:true },
  { id:'MASCB', code:'MASCB', name:'MASCARA CON BABERO',                               universal:true },
  { id:'TAPAB', code:'TAPAB', name:'TAPABOCA',                                          universal:true },
  // OTROS
  { id:'624',   code:'624',   name:'FAJA ALTA COMPRESION 24CM',                       sizes:['T1','T2','T3','T4','T5'] },
  { id:'628',   code:'628',   name:'FAJA ALTA COMPRESION 28CM',                       sizes:['T1','T2','T3','T4','T5'] },
]

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface SizeRow {
  id: number
  value: string
  qty: number
}

interface QueueItem {
  uid: number
  code: string
  name: string
  sizeLabel: string
  qty: number
  labelLines: string[]
}

const PER_PAGE = 14

function escHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function getLabelFontSize(lines: string[]) {
  const maxLen = Math.max(...lines.map(l => l.length))
  if (maxLen <= 8)  return 24
  if (maxLen <= 14) return 22
  if (maxLen <= 20) return 20
  if (maxLen <= 28) return 18
  return 16
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AdminLabels() {
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState<CatalogProduct | null>(null)
  const [rows, setRows]         = useState<SizeRow[]>([])
  const [queue, setQueue]       = useState<QueueItem[]>([])
  const rowCounter = useRef(0)

  const nextId = () => ++rowCounter.current

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return q
      ? CATALOG.filter(p => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
      : CATALOG
  }, [search])

  function makeFirstRow(p: CatalogProduct): SizeRow {
    return {
      id: nextId(),
      value: p.sizes ? String(p.sizes[0]) : p.variants ? p.variants[0] : '',
      qty: 1,
    }
  }

  function selectProduct(p: CatalogProduct) {
    setSelected(p)
    setRows([makeFirstRow(p)])
  }

  function addRow() {
    if (!selected) return
    setRows(r => [...r, makeFirstRow(selected)])
  }

  function removeRow(id: number) {
    setRows(r => r.filter(row => row.id !== id))
  }

  function updateRowValue(id: number, value: string) {
    setRows(r => r.map(row => row.id === id ? { ...row, value } : row))
  }

  function updateRowQty(id: number, qty: number) {
    setRows(r => r.map(row => row.id === id ? { ...row, qty: Math.max(1, qty || 1) } : row))
  }

  function addToQueue() {
    if (!selected || !rows.length) return
    const p = selected
    const newItems: QueueItem[] = []

    rows.forEach(row => {
      const qty = Math.max(1, row.qty || 1)
      let sizeLabel = ''
      let labelLines: string[] = []

      if (p.universal && !p.variants) {
        labelLines = [`${p.code}. ${p.name}`]
      } else if (p.variants) {
        sizeLabel = row.value
        labelLines = [`${p.code}. ${p.name} ${row.value}`]
      } else {
        sizeLabel = `T: ${row.value}`
        labelLines = [`${p.code}. ${p.name}`, `T: ${row.value}`]
      }

      newItems.push({ uid: Date.now() + Math.random(), code: p.code, name: p.name, sizeLabel, qty, labelLines })
    })

    setQueue(q => [...q, ...newItems])
  }

  function removeFromQueue(uid: number) {
    setQueue(q => q.filter(item => item.uid !== uid))
  }

  function clearQueue() {
    if (!queue.length) return
    if (confirm('¿Limpiar toda la cola?')) setQueue([])
  }

  const totalLabels  = queue.reduce((s, q) => s + q.qty, 0)
  const fullPages    = Math.floor(totalLabels / PER_PAGE)
  const lastCount    = totalLabels % PER_PAGE
  const remaining    = lastCount > 0 ? PER_PAGE - lastCount : 0
  const totalPages   = fullPages + (lastCount > 0 ? 1 : 0)

  function generateLabels() {
    if (!queue.length) return

    const labels: string[][] = []
    queue.forEach(q => { for (let i = 0; i < q.qty; i++) labels.push(q.labelLines) })

    const pages: (string[][] | null)[][] = []
    for (let i = 0; i < labels.length; i += PER_PAGE) {
      const slice: (string[][] | null)[] = labels.slice(i, i + PER_PAGE)
      while (slice.length < PER_PAGE) slice.push(null)
      pages.push(slice)
    }

    const labelCells = pages.map((page, pi) => `
      <div class="label-page${pi > 0 ? ' page-break' : ''}">
        ${page.map(lines => {
          if (!lines) return `<div class="label label-empty"></div>`
          const fs = getLabelFontSize(lines)
          const cells = lines.map((l, i) =>
            `<div class="label-line" style="font-size:${i === 0 ? fs + 0.5 : fs}pt">${escHtml(l)}</div>`
          ).join('')
          return `<div class="label"><div class="label-inner">${cells}</div></div>`
        }).join('')}
      </div>`).join('')

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Etiquetas AdherNeo</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Times New Roman',Times,serif;background:#fff}
@page{size:A4 portrait;margin:10mm}
.label-page{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(7,1fr);gap:2mm 5mm;width:190mm;height:270mm}
.page-break{page-break-before:always;margin-top:0}
.label{border:1.5px solid #1a1a1a;border-radius:5mm;display:flex;align-items:center;justify-content:center;padding:1mm 2mm}
.label-empty{border:1.5px dashed #e0e0e0;border-radius:5mm}
.label-inner{text-align:center;width:100%}
.label-line{font-family:'Times New Roman',Times,serif;font-weight:bold;line-height:1.25;color:#000;word-break:break-word}
@media print{body{margin:0;padding:0}.label-empty{border-color:#ccc}}
</style></head><body>${labelCells}</body></html>`

    let iframe = document.getElementById('_print_frame') as HTMLIFrameElement | null
    if (iframe) iframe.remove()
    iframe = document.createElement('iframe')
    iframe.id = '_print_frame'
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;visibility:hidden'
    document.body.appendChild(iframe)
    iframe.srcdoc = html
    iframe.onload = () => { iframe!.contentWindow?.focus(); iframe!.contentWindow?.print() }
  }

  const typeLabel = selected
    ? selected.universal && !selected.variants
      ? 'Universal (sin talle)'
      : selected.variants
        ? `Variantes: ${selected.variants.join(' · ')}`
        : `Talles: ${selected.sizes?.join(', ')}`
    : ''

  const canAddMore = !!(selected && (selected.sizes || selected.variants))

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h2 className="font-serif text-[22px] font-bold" style={{ color: 'var(--navy)' }}>Etiquetas</h2>
        <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-soft)' }}>Generador de etiquetas para impresión A4 · 14 por hoja</p>
      </div>

      {/* 3-column responsive grid */}
      <div className="grid gap-4 items-start grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

        {/* ── COLUMNA 1: Seleccionar producto ─────────────────────────────── */}
        <Card title="1 — Seleccionar producto">
          {/* Search */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-soft)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="form-input pl-9"
              placeholder="Buscar por código o nombre…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Product list */}
          <div className="overflow-y-auto rounded-lg" style={{ maxHeight: 340, border: '1px solid var(--border)' }}>
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-[12px]" style={{ color: 'var(--text-soft)' }}>Sin resultados</div>
            ) : filtered.map(p => (
              <button
                key={p.id}
                onClick={() => selectProduct(p)}
                className="w-full flex items-baseline gap-2 px-3 py-2.5 text-left transition-all duration-100"
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: selected?.id === p.id ? 'var(--sky)' : 'transparent',
                  borderLeft: selected?.id === p.id ? '3px solid var(--navy)' : '3px solid transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { if (selected?.id !== p.id) (e.currentTarget as HTMLElement).style.background = 'var(--sky)' }}
                onMouseLeave={e => { if (selected?.id !== p.id) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span className="text-[11px] font-bold flex-shrink-0 min-w-[40px]"
                  style={{ fontFamily: 'monospace', color: selected?.id === p.id ? 'var(--navy)' : 'var(--blue)' }}>
                  {p.code}
                </span>
                <span className="text-[12px] leading-[1.35]" style={{ color: 'var(--text)' }}>{p.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* ── COLUMNA 2: Configurar ────────────────────────────────────────── */}
        <Card title="2 — Configurar etiquetas">
          {!selected ? (
            <div className="text-center py-10 text-[13px] leading-[1.7]" style={{ color: 'var(--text-soft)' }}>
              ← Seleccioná un producto<br/>para configurar las etiquetas
            </div>
          ) : (
            <>
              {/* Selected product badge */}
              <div className="rounded-lg px-3 py-2.5 mb-4" style={{ background: 'var(--sky)', border: '1px solid var(--sky-mid)' }}>
                <p className="text-[12px] font-bold" style={{ fontFamily: 'monospace', color: 'var(--navy)' }}>{selected.code}</p>
                <p className="text-[13px] font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{selected.name}</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-soft)' }}>{typeLabel}</p>
              </div>

              {/* Size rows */}
              <div className="flex flex-col gap-2 mb-3">
                {rows.map((row, idx) => (
                  <div key={row.id} className="flex items-end gap-2 p-2.5 rounded-lg" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    {selected.universal && !selected.variants ? (
                      /* Universal: only qty */
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Cantidad</label>
                        <input
                          type="number" min={1} max={999}
                          value={row.qty}
                          onChange={e => updateRowQty(row.id, parseInt(e.target.value))}
                          className="form-input"
                        />
                      </div>
                    ) : selected.variants ? (
                      /* Variants: select + qty */
                      <>
                        <div className="flex-1">
                          <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Variante</label>
                          <select className="form-input" value={row.value} onChange={e => updateRowValue(row.id, e.target.value)}>
                            {selected.variants!.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div style={{ width: 84 }}>
                          <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Cantidad</label>
                          <input
                            type="number" min={1} max={999}
                            value={row.qty}
                            onChange={e => updateRowQty(row.id, parseInt(e.target.value))}
                            className="form-input"
                          />
                        </div>
                      </>
                    ) : (
                      /* Sizes: select + qty */
                      <>
                        <div className="flex-1">
                          <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Talle</label>
                          <select className="form-input" value={row.value} onChange={e => updateRowValue(row.id, e.target.value)}>
                            {selected.sizes!.map(s => <option key={String(s)} value={String(s)}>{s}</option>)}
                          </select>
                        </div>
                        <div style={{ width: 84 }}>
                          <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Cantidad</label>
                          <input
                            type="number" min={1} max={999}
                            value={row.qty}
                            onChange={e => updateRowQty(row.id, parseInt(e.target.value))}
                            className="form-input"
                          />
                        </div>
                      </>
                    )}

                    {/* Remove row button (only when >1 row) */}
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-150"
                        style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-soft)', cursor: 'pointer', marginBottom: idx === 0 ? 0 : 0 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c0392b'; (e.currentTarget as HTMLElement).style.color = '#c0392b' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-soft)' }}
                        title="Eliminar fila"
                      >✕</button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add row */}
              {canAddMore && (
                <button
                  onClick={addRow}
                  className="flex items-center gap-1.5 text-[12px] font-semibold mb-4 px-3 py-1.5 rounded-lg transition-all duration-150"
                  style={{ border: '1.5px dashed var(--border)', background: 'transparent', color: 'var(--blue)', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  + Agregar otro talle
                </button>
              )}

              <button
                onClick={addToQueue}
                className="w-full py-2.5 rounded-[9px] text-[14px] font-bold text-white transition-all duration-150"
                style={{ background: 'var(--navy)', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-deep)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
              >
                Agregar a la cola →
              </button>
            </>
          )}
        </Card>

        {/* ── COLUMNA 3: Cola ──────────────────────────────────────────────── */}
        <div className="md:col-span-2 xl:col-span-1">
        <Card title="3 — Cola de impresión">
          {queue.length === 0 ? (
            <div className="text-center py-10 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              No hay etiquetas en la cola todavía.
            </div>
          ) : (
            <>
              {/* Queue items */}
              <div className="flex flex-col gap-2 mb-4">
                {queue.map(item => (
                  <div key={item.uid} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-center leading-tight"
                      style={{ background: 'var(--navy)', color: '#fff', fontFamily: 'monospace' }}>
                      {item.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--text)' }}>
                        {item.name}{item.sizeLabel ? ` — ${item.sizeLabel}` : ''}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--text-soft)' }}>Cód: {item.code}</p>
                    </div>
                    <span className="text-[12px] font-bold px-2 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'var(--sky)', color: 'var(--navy)' }}>
                      ×{item.qty}
                    </span>
                    <button
                      onClick={() => removeFromQueue(item.uid)}
                      className="w-7 h-7 flex items-center justify-center rounded-[6px] flex-shrink-0 text-[13px] transition-all duration-150"
                      style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-soft)', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c0392b'; (e.currentTarget as HTMLElement).style.color = '#c0392b' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-soft)' }}
                    >✕</button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-lg p-3 mb-3" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <SumRow label="Total de etiquetas" value={totalLabels} />
                <SumRow label="Páginas" value={totalPages} />
                <SumRow label="En última hoja" value={lastCount || PER_PAGE} />
              </div>

              {/* Warning: incomplete last page */}
              {remaining > 0 && totalLabels > 0 && (
                <div className="flex gap-2 items-start rounded-lg px-3 py-2.5 mb-3 text-[12px]"
                  style={{ background: '#fffbea', border: '1px solid #f0d060', color: '#7a5800' }}>
                  <span className="flex-shrink-0 mt-0.5">⚠</span>
                  <span>Se pueden agregar <strong>{remaining}</strong> etiqueta{remaining !== 1 ? 's' : ''} más para completar la última hoja.</span>
                </div>
              )}

              {/* Generate button */}
              <button
                onClick={generateLabels}
                className="w-full py-3 rounded-[9px] text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 mb-2"
                style={{ background: 'var(--navy)', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-deep)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Generar e imprimir
              </button>

              <button
                onClick={clearQueue}
                className="w-full py-2 rounded-[9px] text-[12px] font-medium transition-all duration-150"
                style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-soft)', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f5c5c5'; (e.currentTarget as HTMLElement).style.color = '#c0392b' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-soft)' }}
              >
                Limpiar cola
              </button>
            </>
          )}
        </Card>
        </div>

      </div>
    </div>
  )
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <p className="text-[11px] font-bold tracking-wider uppercase mb-4 pb-3"
        style={{ color: 'var(--text-soft)', borderBottom: '1px solid var(--border)' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function SumRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-[12px]" style={{ color: 'var(--text-soft)' }}>{label}</span>
      <span className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  )
}
