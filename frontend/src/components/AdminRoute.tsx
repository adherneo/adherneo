import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuth((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}
