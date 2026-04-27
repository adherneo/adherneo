import { useState, useEffect, useRef } from 'react'
import { BODY_PARTS } from '../../types'
import type { ApiProduct } from '../../types'

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error desconocido')
    throw new Error(msg)
  }
  const data = await res.json()
  return data.url as string
}

const CATS = ['rodilleras','tobilleras','munequeras','coderas','fajas','inmovilizadores','otros']

const EMPTY_FORM = {
  code: '', name: '', category: 'rodilleras', description: '',
  sizes: '', price: '999999', isActive: true,
  images: [] as string[],
  bodyParts: [] as string[],
}

type FormData = typeof EMPTY_FORM

export default function AdminProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState('')
  const [modal, setModal]      = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing]  = useState<ApiProduct | null>(null)
  const [form, setForm]        = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving]    = useState(false)
  const [formError, setFormError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput]   = useState('')
  const [search, setSearch]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function load() {
    setLoading(true)
    fetch('/api/products?all=true')
      .then((r) => r.ok ? r.json() : Promise.reject('error'))
      .then((data) => { setProducts(data); setLoading(false) })
      .catch(() => { setError('No se pudieron cargar los productos.'); setLoading(false) })
  }

  useEffect(load, [])

  function openAdd() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setUrlInput('')
    setModal('add')
  }

  function openEdit(p: ApiProduct) {
    setEditing(p)
    setForm({
      code:        p.code,
      name:        p.name,
      category:    p.category,
      description: p.description || '',
      sizes:       p.sizes.join(','),
      price:       String(p.price),
      isActive:    p.isActive,
      images:      p.images || [],
      bodyParts:   p.bodyParts || [],
    })
    setFormError('')
    setUrlInput('')
    setModal('edit')
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setFormError('')
    try {
      const url = await uploadImage(file)
      setForm((f) => ({ ...f, images: [...f.images, url] }))
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'No se pudo subir la imagen.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function addUrlImage() {
    const url = urlInput.trim()
    if (!url) return
    setForm((f) => ({ ...f, images: [...f.images, url] }))
    setUrlInput('')
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  function toggleBodyPart(value: string) {
    setForm((f) => ({
      ...f,
      bodyParts: f.bodyParts.includes(value)
        ? f.bodyParts.filter((v) => v !== value)
        : [...f.bodyParts, value],
    }))
  }

  function set(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.code.trim() || !form.name.trim()) { setFormError('Código y nombre son requeridos.'); return }

    const body = {
      code:        form.code.trim(),
      name:        form.name.trim(),
      category:    form.category,
      description: form.description.trim() || null,
      sizes:       form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      price:       Number(form.price) || 0,
      isActive:    form.isActive,
      images:      form.images,
      bodyParts:   form.bodyParts,
    }

    setSaving(true)
    try {
      const url    = modal === 'edit' && editing ? `/api/products/${editing.id}` : '/api/products'
      const method = modal === 'edit' ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(await res.text())
      setModal(null)
      load()
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(p: ApiProduct) {
    if (!confirm(`¿Desactivar "${p.name}"?`)) return
    try {
      await fetch(`/api/products/${p.id}`, { method: 'DELETE' })
      load()
    } catch {
      alert('Error al desactivar.')
    }
  }

  async function handleReactivate(p: ApiProduct) {
    try {
      await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true }),
      })
      load()
    } catch {
      alert('Error al reactivar.')
    }
  }

  const q = search.trim().toLowerCase()
  const filtered = q
    ? products.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    : products
  const active   = filtered.filter((p) => p.isActive)
  const inactive = filtered.filter((p) => !p.isActive)

  if (loading) return (
    <div className="flex justify-center py-20">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin" style={{ color: 'var(--text-soft)' }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    </div>
  )

  if (error) return <p className="text-center py-12 text-[14px]" style={{ color: '#c0392b' }}>{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-[22px] font-bold" style={{ color: 'var(--navy)' }}>Productos</h2>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text-soft)' }}>{active.length} activos · {inactive.length} inactivos</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative" style={{ width: 260 }}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-soft)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="form-input pl-9"
              placeholder="Buscar por nombre, código…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[9px] text-[14px] font-bold text-white transition-all duration-150"
            style={{ background: 'var(--navy)', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy-deep)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
          >
            + Agregar producto
          </button>
        </div>
      </div>

      <ProductTable
        products={active}
        onEdit={openEdit}
        onDelete={handleDelete}
        onReactivate={handleReactivate}
      />

      {inactive.length > 0 && (
        <div className="mt-8">
          <p className="text-[12px] font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--text-soft)' }}>Inactivos</p>
          <ProductTable
            products={inactive}
            onEdit={openEdit}
            onDelete={handleDelete}
            onReactivate={handleReactivate}
          />
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center p-5"
          style={{ background: 'rgba(8,18,40,.65)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <div
            className="w-full overflow-y-auto"
            style={{
              maxWidth: 580, maxHeight: '90vh',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 18, boxShadow: '0 20px 60px rgba(18,38,78,.3)',
            }}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-[16px] font-bold" style={{ color: 'var(--navy)' }}>
                {modal === 'add' ? 'Nuevo producto' : `Editar: ${editing?.name}`}
              </p>
              <button onClick={() => setModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-[7px]"
                style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-soft)' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Código *">
                  <input className="form-input" value={form.code} onChange={set('code')} placeholder="Ej: 04A" disabled={saving} />
                </Field>
                <Field label="Precio *">
                  <input className="form-input" type="number" value={form.price} onChange={set('price')} min={0} disabled={saving} />
                </Field>
              </div>

              <Field label="Nombre *">
                <input className="form-input" value={form.name} onChange={set('name')} placeholder="Rodillera Tubular Lisa" disabled={saving} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Categoría *">
                  <select className="form-input" value={form.category} onChange={set('category')} disabled={saving}>
                    {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Talles">
                  <input className="form-input" value={form.sizes} onChange={set('sizes')} placeholder="1,2,3,4,5 o UNIVERSAL" disabled={saving} />
                </Field>
              </div>

              <Field label="Descripción">
                <textarea className="form-input resize-y" value={form.description} onChange={set('description')} placeholder="Descripción del producto…" style={{ height: 72 }} disabled={saving} />
              </Field>

              {/* Body parts */}
              <div>
                <label className="block text-[11px] font-semibold mb-2 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                  Zona del cuerpo
                </label>
                <div className="flex flex-wrap gap-2">
                  {BODY_PARTS.map((bp) => {
                    const active = form.bodyParts.includes(bp.value)
                    return (
                      <button
                        key={bp.value}
                        type="button"
                        onClick={() => toggleBodyPart(bp.value)}
                        disabled={saving}
                        className="px-3 py-1 rounded-full text-[12px] font-semibold transition-all duration-150 cursor-pointer"
                        style={{
                          border: `1.5px solid ${active ? 'var(--navy)' : 'var(--border)'}`,
                          background: active ? 'var(--navy)' : 'var(--bg)',
                          color: active ? '#fff' : 'var(--text-mid)',
                        }}
                      >
                        {bp.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-[11px] font-semibold mb-2 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                  Imágenes del producto
                </label>

                {/* Thumbnails */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.images.map((url, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-[10px] overflow-hidden flex-shrink-0" style={{ border: '1.5px solid var(--border)' }}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          disabled={saving}
                          className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold cursor-pointer"
                          style={{ background: 'rgba(192,57,43,.85)', color: '#fff', border: 'none' }}
                        >✕</button>
                        {idx === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold py-0.5 text-white" style={{ background: 'rgba(18,38,78,.65)' }}>
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 items-center">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={saving || uploading}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={saving || uploading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[12px] font-semibold transition-all duration-150 flex-shrink-0"
                    style={{ border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text-mid)', cursor: 'pointer' }}
                  >
                    {uploading ? (
                      <>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        Subiendo…
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        Subir imagen
                      </>
                    )}
                  </button>
                  <input
                    className="form-input text-[12px] flex-1"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrlImage() } }}
                    placeholder="O pegá una URL y presioná Enter…"
                    disabled={saving || uploading}
                  />
                  {urlInput.trim() && (
                    <button
                      type="button"
                      onClick={addUrlImage}
                      disabled={saving}
                      className="px-3 py-2 rounded-[8px] text-[12px] font-semibold flex-shrink-0"
                      style={{ background: 'var(--sky)', border: '1px solid var(--border)', color: 'var(--blue)', cursor: 'pointer' }}
                    >
                      Agregar
                    </button>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  disabled={saving}
                />
                <span className="text-[13px]" style={{ color: 'var(--text-mid)' }}>Activo (visible en catálogo)</span>
              </label>

              {formError && (
                <div className="px-3 py-2.5 rounded-[8px] text-[12px]" style={{ background: '#fdf0ee', border: '1px solid rgba(192,57,43,.2)', color: '#c0392b' }}>
                  {formError}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={() => setModal(null)}
                  className="px-5 py-2.5 rounded-[9px] text-[14px] font-semibold"
                  style={{ border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text-mid)', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2.5 rounded-[9px] text-[14px] font-bold text-white"
                  style={{ background: 'var(--navy)', border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? .65 : 1 }}>
                  {saving ? 'Guardando…' : modal === 'add' ? 'Crear producto' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold mb-1 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>{label}</label>
      {children}
    </div>
  )
}

function ProductTable({ products, onEdit, onDelete, onReactivate }: {
  products: ApiProduct[]
  onEdit: (p: ApiProduct) => void
  onDelete: (p: ApiProduct) => void
  onReactivate: (p: ApiProduct) => void
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="overflow-x-auto">
      <table className="w-full" style={{ minWidth: 580 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            {['Código','Nombre','Categoría','Talles','Precio',''].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-soft)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', opacity: p.isActive ? 1 : .5 }}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt="" className="w-8 h-8 rounded-[6px] object-cover flex-shrink-0" />
                  )}
                  <span className="text-[12px] font-extrabold px-2 py-0.5 rounded" style={{ fontFamily: 'monospace', color: 'var(--blue)', background: 'var(--sky)' }}>{p.code}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: 'var(--text)', maxWidth: 200 }}>
                <span className="line-clamp-1">{p.name}</span>
              </td>
              <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--text-soft)' }}>{p.category}</td>
              <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--text-soft)' }}>
                {p.sizes.length === 1 && p.sizes[0] === 'UNIVERSAL' ? 'Universal' : p.sizes.join(', ')}
              </td>
              <td className="px-4 py-3 text-[13px] font-bold" style={{ color: 'var(--navy)' }}>
                ${Number(p.price).toLocaleString('es-AR')}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(p)}
                    className="px-2.5 py-1 rounded-[6px] text-[12px] font-semibold transition-all duration-150"
                    style={{ background: 'var(--sky)', border: '1px solid var(--border)', color: 'var(--blue)', cursor: 'pointer' }}>
                    Editar
                  </button>
                  {p.isActive ? (
                    <button onClick={() => onDelete(p)}
                      className="px-2.5 py-1 rounded-[6px] text-[12px] font-semibold"
                      style={{ background: '#fdf0ee', border: '1px solid rgba(192,57,43,.2)', color: '#c0392b', cursor: 'pointer' }}>
                      Desactivar
                    </button>
                  ) : (
                    <button onClick={() => onReactivate(p)}
                      className="px-2.5 py-1 rounded-[6px] text-[12px] font-semibold"
                      style={{ background: '#e8f5ee', border: '1px solid rgba(26,124,79,.2)', color: '#1a7c4f', cursor: 'pointer' }}>
                      Activar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="text-center py-8 text-[13px]" style={{ color: 'var(--text-soft)' }}>Sin productos.</p>
      )}
      </div>
    </div>
  )
}
