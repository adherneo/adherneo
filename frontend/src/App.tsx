import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Products from './pages/Products'
import Order from './pages/Order'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
        <Route path="/productos" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/pedido" element={<ProtectedRoute><Order /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
