import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Products from './pages/Products'
import Order from './pages/Order'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/pedido"    element={<Order />} />
      </Routes>
    </BrowserRouter>
  )
}
