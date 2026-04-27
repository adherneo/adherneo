import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Products from './pages/Products'
import Order from './pages/Order'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLayout from './pages/admin/AdminLayout'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProducts from './pages/admin/AdminProducts'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
        <Route path="/productos" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/pedido" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="usuarios" replace />} />
          <Route path="usuarios"  element={<AdminUsers />} />
          <Route path="productos" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
