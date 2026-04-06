import { useState } from 'react'

/*
  Props:
    - productos : lista completa desde la API
    - lineas    : [{ idProd, nombre, cantidad, precio }]
    - onChange(lineas) : actualiza las líneas en el padre
*/
export default function TablaProductos({ productos, lineas, onChange }) {
  const [modalOpen,   setModalOpen]   = useState(false)
  const [selProd,     setSelProd]     = useState(null)
  const [cantidad,    setCantidad]    = useState(1)
  const [busqueda,    setBusqueda]    = useState('')

  const filtrados = busqueda.trim()
    ? productos.filter(p =>
        (p.nombre ?? p.Nombre ?? '').toLowerCase().includes(busqueda.toLowerCase())
      )
    : productos

  function abrirModal() {
    setSelProd(null)
    setCantidad(1)
    setBusqueda('')
    setModalOpen(true)
  }

  function confirmarAgregar() {
    if (!selProd) return
    const id     = selProd.id     ?? selProd.Id
    const nombre = selProd.nombre ?? selProd.Nombre
    const precio = parseFloat(selProd.precio ?? selProd.Precio ?? 0)
    const cant   = parseInt(cantidad) || 1

    const idx = lineas.findIndex(l => l.idProd === id)
    let nuevas
    if (idx >= 0) {
      nuevas = lineas.map((l, i) => i === idx ? { ...l, cantidad: l.cantidad + cant } : l)
    } else {
      nuevas = [...lineas, { idProd: id, nombre, cantidad: cant, precio }]
    }
    onChange(nuevas)
    setModalOpen(false)
  }

  function eliminar(i) {
    onChange(lineas.filter((_, idx) => idx !== i))
  }

  const subtotal = lineas.reduce((s, l) => s + l.cantidad * l.precio, 0)
  const iva      = subtotal * 0.15
  const total    = subtotal + iva

  return (
    <>
      {/* ── Cabecera de sección ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div className="sec-title" style={{ marginBottom: 0 }}>Detalle de productos</div>
        <button type="button" className="btn btn-primary" onClick={abrirModal}>
          <svg width="13" height="13" viewBox="0 0 16 16">
            <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Agregar producto
        </button>
      </div>

      {/* ── Tabla de líneas ── */}
      <table className="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th className="r">Cant.</th>
            <th className="r">P. Unit.</th>
            <th className="r">Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lineas.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                Presiona "Agregar producto" para comenzar la factura
              </td>
            </tr>
          ) : lineas.map((l, i) => (
            <tr key={i}>
              <td style={{ color: 'var(--hint)', fontSize: 12 }}>{i + 1}</td>
              <td style={{ fontWeight: 500 }}>{l.nombre}</td>
              <td className="r">{l.cantidad}</td>
              <td className="r">${l.precio.toFixed(2)}</td>
              <td className="r">${(l.cantidad * l.precio).toFixed(2)}</td>
              <td>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => eliminar(i)} title="Eliminar">
                  <svg width="12" height="12" viewBox="0 0 16 16">
                    <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Totales ── */}
      <hr className="divider" />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className="totales-box">
          <div className="tot-row">
            <span style={{ color: 'var(--muted)' }}>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="tot-row">
            <span style={{ color: 'var(--muted)' }}>IVA 15 %</span>
            <span>${iva.toFixed(2)}</span>
          </div>
          <div className="tot-row final">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ── Modal selector de productos ── */}
      {modalOpen && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Seleccionar producto</h3>
              <button type="button" className="btn btn-sm" onClick={() => setModalOpen(false)}>✕ Cerrar</button>
            </div>

            <div className="modal-search">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                autoFocus
              />
            </div>

            <div className="prod-list">
              {filtrados.length === 0 ? (
                <div className="empty-state">Sin resultados</div>
              ) : filtrados.map(p => {
                const id     = p.id     ?? p.Id
                const nombre = p.nombre ?? p.Nombre
                const precio = parseFloat(p.precio ?? p.Precio ?? 0)
                const codigo = p.codigo ?? p.Codigo ?? String(id)
                const isSel  = selProd && (selProd.id ?? selProd.Id) === id
                return (
                  <div
                    key={id}
                    className={`prod-item${isSel ? ' sel' : ''}`}
                    onClick={() => setSelProd(p)}
                  >
                    <div className="prod-icon">{codigo.toString().slice(0, 3).toUpperCase()}</div>
                    <div className="prod-info">
                      <div className="prod-nombre">{nombre}</div>
                      <div className="prod-codigo">Cód: {codigo}</div>
                    </div>
                    <div className="prod-precio-tag">${precio.toFixed(2)}</div>
                    {isSel && (
                      <div className="check-circle">
                        <svg width="10" height="10" viewBox="0 0 12 12">
                          <polyline points="2,6 5,9 10,3" stroke="var(--success)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="modal-footer">
              <div className="campo" style={{ width: 90, flexShrink: 0 }}>
                <label>Cantidad</label>
                <input
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                />
              </div>
              <div className="sel-info">
                {selProd ? (
                  <>
                    <strong>{selProd.nombre ?? selProd.Nombre}</strong>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      ${parseFloat(selProd.precio ?? selProd.Precio ?? 0).toFixed(2)} c/u
                    </span>
                  </>
                ) : 'Selecciona un producto'}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmarAgregar}
                disabled={!selProd}
              >
                Agregar a factura
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}