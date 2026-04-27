import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useTheme } from '../store/theme'

export default function Register() {
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name.trim())  { setError('El nombre es requerido.'); return }
    if (!form.email.trim()) { setError('El email es requerido.'); return }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.trim(),
          password: form.password,
          phone:    form.phone.trim() || undefined,
        }),
      })

      if (res.status === 409) { setError('Ya existe una cuenta con ese email.'); return }
      if (!res.ok) { setError('Error al crear la cuenta. Intentá de nuevo.'); return }

      navigate('/login', { state: { registered: true } })
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = ({ open }: { open: boolean }) => open ? (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'var(--bg)', transition: 'background .3s' }}
    >
      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150"
        style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-mid)' }}
        aria-label="Cambiar tema"
      >
        {dark ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      <div
        className="w-full max-w-[440px] rounded-[20px] overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
      >
        {/* Header */}
        <div className="px-8 pt-10 pb-7 text-center" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="inline-flex justify-center mb-5">
            <Logo height={44} dark={dark} />
          </div>
          <h1 className="font-serif text-[22px] font-bold mb-1" style={{ color: 'var(--navy)' }}>
            Crear cuenta
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            Completá tus datos para acceder al catálogo.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-7">
          <form onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                Nombre completo <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <input
                id="name" type="text" autoComplete="name"
                placeholder="Juan Pérez"
                value={form.name} onChange={set('name')}
                className="form-input" disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="reg-email" className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                Email <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <input
                id="reg-email" type="email" autoComplete="email"
                placeholder="usuario@empresa.com"
                value={form.email} onChange={set('email')}
                className="form-input" disabled={loading}
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                Teléfono (opcional)
              </label>
              <input
                id="phone" type="tel" autoComplete="tel"
                placeholder="+54 11 1234-5678"
                value={form.phone} onChange={set('phone')}
                className="form-input" disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="reg-password" className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                Contraseña <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password} onChange={set('password')}
                  className="form-input pr-10" disabled={loading}
                />
                <button
                  type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', padding: 0 }}
                  aria-label={showPass ? 'Ocultar' : 'Mostrar'}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="mb-6">
              <label htmlFor="confirm" className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                Confirmar contraseña <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <input
                id="confirm"
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repetí la contraseña"
                value={form.confirm} onChange={set('confirm')}
                className="form-input" disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-[8px] text-[13px]" style={{ background: '#fdf0ee', border: '1px solid rgba(192,57,43,.25)', color: '#c0392b' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-[10px] text-[15px] font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-65"
              style={{ background: loading ? 'var(--blue)' : 'var(--navy)', border: 'none', cursor: loading ? 'default' : 'pointer' }}
            >
              {loading ? (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Creando cuenta…
                </>
              ) : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center mt-5 text-[13px]" style={{ color: 'var(--text-soft)' }}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="font-semibold transition-colors duration-150" style={{ color: 'var(--blue)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--navy)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--blue)' }}>
              Ingresar
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-[12px]" style={{ color: 'var(--text-soft)' }}>
        © {new Date().getFullYear()} AdherNeo · La Lonja, Pilar, Buenos Aires
      </p>
    </div>
  )
}
