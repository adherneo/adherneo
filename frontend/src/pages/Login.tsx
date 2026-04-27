import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useTheme } from '../store/theme'
import { useAuth } from '../store/auth'

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )

const SpinIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
)

export default function Login() {
  const { dark, toggle } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()

  // ── Login state ──────────────────────────────────────────────────────────────
  const [loginForm, setLoginForm]   = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPass, setShowLoginPass] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    if (!loginForm.email.trim() || !loginForm.password) {
      setLoginError('Completá todos los campos.')
      return
    }
    setLoginLoading(true)
    try {
      await login(loginForm.email.trim(), loginForm.password)
      navigate('/')
    } catch {
      setLoginError('Email o contraseña incorrectos.')
    } finally {
      setLoginLoading(false)
    }
  }

  // ── Register state ───────────────────────────────────────────────────────────
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [regError, setRegError]   = useState('')
  const [regSuccess, setRegSuccess] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [showRegPass, setShowRegPass] = useState(false)

  function setReg(key: keyof typeof regForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setRegForm((p) => ({ ...p, [key]: e.target.value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegError('')
    if (!regForm.name.trim())           { setRegError('El nombre es requerido.'); return }
    if (!regForm.email.trim())          { setRegError('El email es requerido.'); return }
    if (regForm.password.length < 8)    { setRegError('Mínimo 8 caracteres.'); return }
    if (regForm.password !== regForm.confirm) { setRegError('Las contraseñas no coinciden.'); return }

    setRegLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     regForm.name.trim(),
          email:    regForm.email.trim(),
          password: regForm.password,
        }),
      })
      if (res.status === 409) { setRegError('Ya existe una cuenta con ese email.'); return }
      if (!res.ok)            { setRegError('Error al crear la cuenta.'); return }

      setRegSuccess(true)
      setRegForm({ name: '', email: '', password: '', confirm: '' })
      // Pre-fill login form with the new email
      setLoginForm((p) => ({ ...p, email: regForm.email.trim() }))
    } catch {
      setRegError('No se pudo conectar con el servidor.')
    } finally {
      setRegLoading(false)
    }
  }

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
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
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
        className="w-full rounded-[20px] overflow-hidden"
        style={{
          maxWidth: 780,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Header */}
        <div className="px-10 pt-9 pb-7 text-center" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="inline-flex justify-center mb-4">
            <Logo height={42} dark={dark} />
          </div>
          <h1 className="font-serif text-[21px] font-bold mb-1" style={{ color: 'var(--navy)' }}>
            Acceso de distribuidores
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            Ingresá o creá tu cuenta para acceder al catálogo y realizar pedidos.
          </p>
        </div>

        {/* Two-panel body */}
        <div className="flex" style={{ minHeight: 0 }}>

          {/* ── Iniciar sesión ── */}
          <div className="flex-1 px-8 py-7">
            <p className="text-[13px] font-bold mb-5" style={{ color: 'var(--text)' }}>Iniciar sesión</p>

            {loginError && (
              <div className="mb-4 px-3 py-2.5 rounded-[8px] text-[12px]" style={{ background: '#fdf0ee', border: '1px solid rgba(192,57,43,.2)', color: '#c0392b' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate className="flex flex-col gap-3.5">
              <div>
                <label htmlFor="l-email" className="block text-[11px] font-semibold mb-1 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                  Email <span style={{ color: '#c0392b' }}>*</span>
                </label>
                <input
                  id="l-email" type="email" autoComplete="email"
                  placeholder="usuario@empresa.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                  className="form-input" disabled={loginLoading}
                />
              </div>

              <div>
                <label htmlFor="l-pass" className="block text-[11px] font-semibold mb-1 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                  Contraseña <span style={{ color: '#c0392b' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    id="l-pass"
                    type={showLoginPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                    className="form-input pr-9" disabled={loginLoading}
                  />
                  <button type="button" onClick={() => setShowLoginPass((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', padding: 0 }}>
                    <EyeIcon open={showLoginPass} />
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loginLoading}
                className="w-full py-3 rounded-[9px] text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 mt-1"
                style={{ background: loginLoading ? 'var(--blue)' : 'var(--navy)', border: 'none', cursor: loginLoading ? 'default' : 'pointer' }}
                onMouseEnter={(e) => { if (!loginLoading) (e.currentTarget as HTMLElement).style.background = 'var(--navy-deep)' }}
                onMouseLeave={(e) => { if (!loginLoading) (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
              >
                {loginLoading ? <><SpinIcon /> Ingresando…</> : 'Ingresar'}
              </button>
            </form>
          </div>

          {/* ── Divider ── */}
          <div className="flex-shrink-0 w-px self-stretch" style={{ background: 'var(--border)' }} />

          {/* ── Crear cuenta ── */}
          <div className="flex-1 px-8 py-7">
            <p className="text-[13px] font-bold mb-5" style={{ color: 'var(--text)' }}>Crear cuenta</p>

            {regSuccess ? (
              <div className="flex flex-col items-center justify-center h-[calc(100%-32px)] text-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#e8f5ee' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1a7c4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="text-[14px] font-semibold" style={{ color: '#1a7c4f' }}>¡Cuenta creada!</p>
                <p className="text-[12px]" style={{ color: 'var(--text-soft)' }}>Ingresá con tu email y contraseña.</p>
              </div>
            ) : (
              <>
                {regError && (
                  <div className="mb-4 px-3 py-2.5 rounded-[8px] text-[12px]" style={{ background: '#fdf0ee', border: '1px solid rgba(192,57,43,.2)', color: '#c0392b' }}>
                    {regError}
                  </div>
                )}

                <form onSubmit={handleRegister} noValidate className="flex flex-col gap-3.5">
                  <div>
                    <label htmlFor="r-name" className="block text-[11px] font-semibold mb-1 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                      Nombre completo <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <input
                      id="r-name" type="text" autoComplete="name"
                      placeholder="Juan Pérez"
                      value={regForm.name} onChange={setReg('name')}
                      className="form-input" disabled={regLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="r-email" className="block text-[11px] font-semibold mb-1 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                      Email <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <input
                      id="r-email" type="email" autoComplete="email"
                      placeholder="usuario@empresa.com"
                      value={regForm.email} onChange={setReg('email')}
                      className="form-input" disabled={regLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="r-pass" className="block text-[11px] font-semibold mb-1 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                      Contraseña <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="r-pass"
                        type={showRegPass ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Mínimo 8 caracteres"
                        value={regForm.password} onChange={setReg('password')}
                        className="form-input pr-9" disabled={regLoading}
                      />
                      <button type="button" onClick={() => setShowRegPass((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', padding: 0 }}>
                        <EyeIcon open={showRegPass} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="r-confirm" className="block text-[11px] font-semibold mb-1 tracking-[.02em]" style={{ color: 'var(--text-mid)' }}>
                      Confirmar contraseña <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <input
                      id="r-confirm"
                      type={showRegPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Repetí la contraseña"
                      value={regForm.confirm} onChange={setReg('confirm')}
                      className="form-input" disabled={regLoading}
                    />
                  </div>

                  <button
                    type="submit" disabled={regLoading}
                    className="w-full py-3 rounded-[9px] text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 mt-1"
                    style={{ background: regLoading ? 'var(--blue)' : 'var(--navy)', border: 'none', cursor: regLoading ? 'default' : 'pointer' }}
                    onMouseEnter={(e) => { if (!regLoading) (e.currentTarget as HTMLElement).style.background = 'var(--navy-deep)' }}
                    onMouseLeave={(e) => { if (!regLoading) (e.currentTarget as HTMLElement).style.background = 'var(--navy)' }}
                  >
                    {regLoading ? <><SpinIcon /> Creando…</> : 'Crear cuenta'}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>

      <p className="mt-5 text-[12px]" style={{ color: 'var(--text-soft)' }}>
        © {new Date().getFullYear()} AdherNeo · La Lonja, Pilar, Buenos Aires
      </p>
    </div>
  )
}
