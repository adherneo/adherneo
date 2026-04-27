import { useState, useEffect } from 'react'
import { useAuth } from '../../store/auth'

interface UserRow {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
}

export default function AdminUsers() {
  const currentUser = useAuth((s) => s.user)
  const [users, setUsers]   = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    setLoading(true)
    fetch('/api/users')
      .then((r) => r.ok ? r.json() : Promise.reject('error'))
      .then((data) => { setUsers(data); setLoading(false) })
      .catch(() => { setError('No se pudieron cargar los usuarios.'); setLoading(false) })
  }

  useEffect(load, [])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar al usuario "${name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setUsers((u) => u.filter((x) => x.id !== id))
    } catch {
      alert('No se pudo eliminar el usuario.')
    } finally {
      setDeleting(null)
    }
  }

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-[22px] font-bold" style={{ color: 'var(--navy)' }}>Usuarios</h2>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text-soft)' }}>{users.length} usuarios registrados</p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              {['Nombre', 'Email', 'Teléfono', 'Rol', 'Registro', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-soft)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3 text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{u.name}</td>
                <td className="px-4 py-3 text-[13px]" style={{ color: 'var(--text-mid)' }}>{u.email}</td>
                <td className="px-4 py-3 text-[13px]" style={{ color: 'var(--text-soft)' }}>{u.phone || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                    style={{
                      background: u.role === 'admin' ? 'var(--sky-mid)' : 'var(--sky)',
                      color: u.role === 'admin' ? 'var(--navy)' : 'var(--blue)',
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--text-soft)' }}>
                  {new Date(u.createdAt).toLocaleDateString('es-AR')}
                </td>
                <td className="px-4 py-3">
                  {u.id !== currentUser?.id && u.role !== 'admin' && (
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      disabled={deleting === u.id}
                      className="px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all duration-150"
                      style={{ background: '#fdf0ee', border: '1px solid rgba(192,57,43,.2)', color: '#c0392b', cursor: 'pointer' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fce8e4' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#fdf0ee' }}
                    >
                      {deleting === u.id ? '...' : 'Eliminar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center py-12 text-[14px]" style={{ color: 'var(--text-soft)' }}>No hay usuarios.</p>
        )}
      </div>
    </div>
  )
}
