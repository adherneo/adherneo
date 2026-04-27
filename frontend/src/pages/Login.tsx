import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useTheme } from '../store/theme'
import { useAuth } from '../store/auth'

export default function Login() {
  const { dark, toggle } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Completá todos los campos.'); return }
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
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

      {/* Card */}
      <div
        className="w-full max-w-[400px] rounded-[20px] overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
      >
        {/* Header */}
        <div
          className="px-8 pt-10 pb-8 text-center"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="inline-flex justify-center mb-5">
            <Logo height={44} dark={dark} />
          </div>
          <h1 className="font-serif text-[22px] font-bold mb-1" style={{ color: 'var(--navy)' }}>
            Acceso de distribuidores
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            Ingresá con tu cuenta para ver el catálogo y realizar pedidos.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                Email <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-[12px] font-semibold mb-1.5 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                Contraseña <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', padding: 0 }}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? (
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
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-[8px] text-[13px]" style={{ background: '#fdf0ee', border: '1px solid rgba(192,57,43,.25)', color: '#c0392b' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-[10px] text-[15px] font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-65"
              style={{ background: loading ? 'var(--blue)' : 'var(--navy)', border: 'none', cursor: loading ? 'default' : 'pointer' }}
            >
              {loading ? (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Ingresando…
                </>
              ) : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>

      <p className="mt-6 text-[12px]" style={{ color: 'var(--text-soft)' }}>
        © {new Date().getFullYear()} AdherNeo · La Lonja, Pilar, Buenos Aires
      </p>
    </div>
  )
}
