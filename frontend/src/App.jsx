import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Facturas  from './pages/Facturas.jsx'
import Clientes  from './pages/Clientes.jsx'
import Productos from './pages/Productos.jsx'
 
const IconFactura = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="1" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="5" y1="11" x2="8"  y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)
 
const IconCliente = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)
 
const IconProducto = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="7" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)
 
export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>FacturaSys</h1>
            <span>v1.0 · .NET + React</span>
          </div>
          <nav>
            <NavLink to="/"         end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <IconFactura /> Facturación
            </NavLink>
            <NavLink to="/clientes"    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <IconCliente /> Clientes
            </NavLink>
            <NavLink to="/productos"   className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <IconProducto /> Productos
            </NavLink>
          </nav>
        </aside>
 
        <main className="main-content">
          <Routes>
            <Route path="/"          element={<Facturas />} />
            <Route path="/clientes"  element={<Clientes />} />
            <Route path="/productos" element={<Productos />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}