import { useState, useEffect, useRef } from 'react'
import { crearCliente, buscarClientePorCedula } from "../services/clienteService";

/*
  Props:
    - cliente       : { cedula, nombre, telefono, email, direccion }
    - onChange(obj) : callback cuando cambia cualquier campo
    - onClienteEnBD(bool): informa si el cliente ya estaba en BD
*/
export default function FormCliente({ cliente, onChange, onClienteEnBD }) {
  const [estado, setEstado] = useState(null) // null | 'buscando' | 'encontrado' | 'nuevo' | 'error'
  const timerRef = useRef(null)

  function handleChange(e) {
    onChange({ ...cliente, [e.target.name]: e.target.value })
  }

  function handleCedulaChange(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 13)
    onChange({ cedula: val, nombre: '', telefono: '', email: '', direccion: '' })
    onClienteEnBD(false)
    setEstado(null)
    clearTimeout(timerRef.current)
    if (val.length >= 10) {
      timerRef.current = setTimeout(() => buscar(val), 500)
    }
  }

  async function buscar(cedula) {
    setEstado('buscando')
    try {
      const found = await buscarClientePorCedula(cedula)
      if (found) {
        onChange({
          cedula,
          nombre:    found.nombre    ?? found.Nombre    ?? '',
          telefono:  found.telefono  ?? found.Telefono  ?? '',
          email:     found.email     ?? found.Email     ?? '',
          direccion: found.direccion ?? found.Direccion ?? '',
        })
        setEstado('encontrado')
        onClienteEnBD(true)
      } else {
        setEstado('nuevo')
        onClienteEnBD(false)
      }
    } catch {
      setEstado('error')
      onClienteEnBD(false)
    }
  }

  // Badge de estado
  const estadoBadge = {
    buscando:   <span className="badge badge-info">Buscando...</span>,
    encontrado: <span className="badge badge-success">✓ Cliente en base de datos</span>,
    nuevo:      <span className="badge badge-warn">Cliente nuevo — completa los datos</span>,
    error:      <span className="badge badge-danger">Error al consultar la API</span>,
  }

  return (
    <div className="card">
      <div className="sec-title">Datos del cliente</div>

      {/* Cédula */}
      <div className="grid-3" style={{ marginBottom: 12 }}>
        <div className="campo">
          <label>Cédula / RUC</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              name="cedula"
              value={cliente.cedula}
              onChange={handleCedulaChange}
              placeholder="0000000000"
              maxLength={13}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn"
              style={{ padding: '0 11px', flexShrink: 0 }}
              onClick={() => cliente.cedula.length >= 10 && buscar(cliente.cedula)}
              title="Buscar"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div style={{ minHeight: 20, marginTop: 2 }}>
            {estado && estadoBadge[estado]}
          </div>
        </div>

        <div className="campo">
          <label>Nombre / Razón social</label>
          <input
            name="nombre"
            value={cliente.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
            readOnly={estado === 'encontrado'}
          />
        </div>

        <div className="campo">
          <label>Teléfono</label>
          <input
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
            placeholder="0999999999"
            readOnly={estado === 'encontrado'}
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="campo">
          <label>Correo electrónico</label>
          <input
            name="email"
            type="email"
            value={cliente.email}
            onChange={handleChange}
            placeholder="cliente@email.com"
            readOnly={estado === 'encontrado'}
          />
        </div>
        <div className="campo">
          <label>Dirección</label>
          <input
            name="direccion"
            value={cliente.direccion}
            onChange={handleChange}
            placeholder="Dirección del cliente"
            readOnly={estado === 'encontrado'}
          />
        </div>
      </div>
    </div>
  )
}