import { useState, useEffect } from "react";
import { buscarClientePorCedula } from '../services/clienteService.js'
import { getProductos } from "../services/productoService";
import { createFactura, getFacturas } from "../services/facturaService";
import { crearCliente } from "../services/clienteService";

const estiloInput = {
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  padding: "0.5rem 0.8rem",
  color: "#1e293b",
  fontSize: "13px",
  width: "100%",
  outline: "none"
};

const estiloInputEditable = {
  background: "#eff6ff",
  border: "1px solid #3b82f6",
  borderRadius: "6px",
  padding: "0.5rem 0.8rem",
  color: "#1e293b",
  fontSize: "13px",
  width: "100%",
  outline: "none"
};

const estiloLabel = {
  fontSize: "11px",
  color: "#64748b",
  letterSpacing: "0.08em",
  marginBottom: "4px",
  display: "block"
};

export default function FormFactura() {
  const [cedula, setCedula] = useState("");
  const [cliente, setCliente] = useState(null);
  const [clienteNuevo, setClienteNuevo] = useState(false);
  const [detalles, setDetalles] = useState([]);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [cantidadEdit, setCantidadEdit] = useState(1);
  const [numeroFactura, setNumeroFactura] = useState("#0001");

  useEffect(() => {
    const cargarUltimoNumero = async () => {
      try {
        const facturas = await getFacturas();
        if (facturas && facturas.length > 0) {
          const ultimo = facturas[facturas.length - 1];
          const siguiente = parseInt(ultimo.numeroDocumento.replace("#", "")) + 1;
          setNumeroFactura(`#${String(siguiente).padStart(4, "0")}`);
        }
      } catch (error) {
        console.error(error);
      }
    };
    cargarUltimoNumero();
  }, []);

  const fecha = new Date().toLocaleDateString("es-EC", {
    day: "numeric", month: "long", year: "numeric"
  });

  const buscarCliente = async () => {
    if (!cedula) return;
    const data = await buscarClientePorCedula(cedula);
    if (data && data.id) {
      setCliente(data);
      setClienteNuevo(false);
    } else {
      setCliente({ id: 0, cedula, nombre: "", apellido: "", email: "", telefono: "", direccion: "" });
      setClienteNuevo(true);
      alert("Cliente no encontrado. Puedes llenar los datos manualmente.");
    }
  };

  const abrirProductos = async () => {
    const data = await getProductos();
    setProductos(data);
    setMostrarProductos(true);
  };

  const agregarProducto = (producto) => {
    const existe = detalles.find(d => d.idProducto === producto.id);
    if (existe) {
      setDetalles(detalles.map(d =>
        d.idProducto === producto.id
          ? { ...d, cantidad: d.cantidad + 1, subtotal: (d.cantidad + 1) * d.precioUnitario }
          : d
      ));
    } else {
      setDetalles([...detalles, {
        idProducto: producto.id,
        nombreProducto: producto.nombre,
        cantidad: 1,
        precioUnitario: producto.precio,
        subtotal: producto.precio
      }]);
    }
    setMostrarProductos(false);
  };

  const editarCantidad = (index) => {
    setEditando(index);
    setCantidadEdit(detalles[index].cantidad);
  };

  const guardarCantidad = (index) => {
    const nuevos = [...detalles];
    nuevos[index].cantidad = cantidadEdit;
    nuevos[index].subtotal = cantidadEdit * nuevos[index].precioUnitario;
    setDetalles(nuevos);
    setEditando(null);
  };

  const eliminarDetalle = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const subtotal = detalles.reduce((acc, d) => acc + d.subtotal, 0);
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  const limpiar = () => {
    setCliente(null);
    setCedula("");
    setDetalles([]);
    setClienteNuevo(false);
  };

  const guardarFactura = async () => {
    if (!cliente) return alert("Busca un cliente primero");
    if (detalles.length === 0) return alert("Agrega al menos un producto");

    let idCliente = cliente.id;

   if (clienteNuevo) {
    try {
        const nuevoCliente = await crearCliente({ ...cliente, cedula });
        idCliente = nuevoCliente.id;
    } catch (error) {
        const clienteCreado = await buscarClientePorCedula(cedula);
        if (clienteCreado && clienteCreado.id) {
            idCliente = clienteCreado.id;
        } else {
            alert("Error al crear el cliente");
            return;
        }
    }
}

    const factura = {
      numeroDocumento: numeroFactura,
      idCliente,
      fecha: new Date(),
      total,
      detalles: detalles.map(d => ({
        productoId: d.idProducto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      }))
    };

    try {
      await createFactura(factura);
      alert("Factura guardada correctamente");
      const siguiente = parseInt(numeroFactura.replace("#", "")) + 1;
      setNumeroFactura(`#${String(siguiente).padStart(4, "0")}`);
      limpiar();
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al guardar factura");
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>

      {/* Tarjeta cliente */}
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontWeight: "700", fontSize: "20px", color: "#0f172a" }}>Venta de Productos</div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>RUC: 1750736776 · Ambato, Ecuador</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#64748b" }}>N.° de Factura</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#2563eb" }}>{numeroFactura}</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>{fecha}</div>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.08em" }}>DATOS DEL CLIENTE</div>
            {clienteNuevo && (
              <span style={{ fontSize: "11px", background: "#3b82f6", color: "white", padding: "2px 8px", borderRadius: "4px" }}>
                Cliente nuevo
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
            <div>
              <label style={estiloLabel}>Cédula</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  style={estiloInput}
                  placeholder="0000000000"
                  value={cedula}
                  onChange={e => { setCedula(e.target.value); setCliente(null); setClienteNuevo(false); }}
                  onKeyDown={e => e.key === "Enter" && buscarCliente()}
                />
                <button onClick={buscarCliente} style={{
                  background: "#2563eb", border: "none", borderRadius: "6px",
                  color: "white", padding: "0 10px", cursor: "pointer", fontSize: "14px"
                }}>⌕</button>
              </div>
            </div>
            <div>
              <label style={estiloLabel}>Nombre</label>
              <input
                style={clienteNuevo ? estiloInputEditable : estiloInput}
                value={cliente?.nombre || ""}
                readOnly={!clienteNuevo}
                placeholder="Nombre"
                onChange={e => clienteNuevo && setCliente({ ...cliente, nombre: e.target.value })}
              />
            </div>
            <div>
              <label style={estiloLabel}>Apellido</label>
              <input
                style={clienteNuevo ? estiloInputEditable : estiloInput}
                value={cliente?.apellido || ""}
                readOnly={!clienteNuevo}
                placeholder="Apellido"
                onChange={e => clienteNuevo && setCliente({ ...cliente, apellido: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem" }}>
            <div>
              <label style={estiloLabel}>Teléfono</label>
              <input
                style={clienteNuevo ? estiloInputEditable : estiloInput}
                value={cliente?.telefono || ""}
                readOnly={!clienteNuevo}
                placeholder="0999999999"
                onChange={e => clienteNuevo && setCliente({ ...cliente, telefono: e.target.value })}
              />
            </div>
            <div>
              <label style={estiloLabel}>Correo electrónico</label>
              <input
                style={clienteNuevo ? estiloInputEditable : estiloInput}
                value={cliente?.email || ""}
                readOnly={!clienteNuevo}
                placeholder="cliente@email.com"
                onChange={e => clienteNuevo && setCliente({ ...cliente, email: e.target.value })}
              />
            </div>
            <div>
              <label style={estiloLabel}>Dirección</label>
              <input
                style={clienteNuevo ? estiloInputEditable : estiloInput}
                value={cliente?.direccion || ""}
                readOnly={!clienteNuevo}
                placeholder="Dirección del cliente"
                onChange={e => clienteNuevo && setCliente({ ...cliente, direccion: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta productos */}
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "1.5rem", border: "1px solid #e2e8f0", marginTop: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.08em" }}>DETALLE DE PRODUCTOS</div>
          <button onClick={abrirProductos} style={{
            background: "#2563eb", border: "none", borderRadius: "6px",
            color: "white", padding: "0.4rem 1rem", cursor: "pointer", fontSize: "13px", fontWeight: "500"
          }}>+ Agregar producto</button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ textAlign: "left", padding: "0.4rem", fontWeight: "500" }}>#</th>
              <th style={{ textAlign: "left", padding: "0.4rem", fontWeight: "500" }}>Producto</th>
              <th style={{ textAlign: "center", padding: "0.4rem", fontWeight: "500" }}>Cant.</th>
              <th style={{ textAlign: "right", padding: "0.4rem", fontWeight: "500" }}>P. Unit.</th>
              <th style={{ textAlign: "right", padding: "0.4rem", fontWeight: "500" }}>Subtotal</th>
              <th style={{ textAlign: "center", padding: "0.4rem", fontWeight: "500" }}></th>
            </tr>
          </thead>
          <tbody>
            {detalles.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontStyle: "italic" }}>
                  Presiona "Agregar producto" para comenzar
                </td>
              </tr>
            ) : (
              detalles.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.6rem 0.4rem", color: "#94a3b8" }}>{i + 1}</td>
                  <td style={{ padding: "0.6rem 0.4rem", color: "#1e293b" }}>{d.nombreProducto}</td>
                  <td style={{ padding: "0.6rem 0.4rem", textAlign: "center" }}>
                    {editando === i ? (
                      <input type="number" value={cantidadEdit} min={1}
                        onChange={e => setCantidadEdit(Number(e.target.value))}
                        onBlur={() => guardarCantidad(i)}
                        onKeyDown={e => e.key === "Enter" && guardarCantidad(i)}
                        style={{ ...estiloInput, width: "60px", textAlign: "center" }} autoFocus />
                    ) : (
                      <span onDoubleClick={() => editarCantidad(i)} style={{ cursor: "pointer", padding: "2px 8px", borderRadius: "4px", background: "#f1f5f9", color: "#1e293b" }}>
                        {d.cantidad}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "0.6rem 0.4rem", textAlign: "right", color: "#1e293b" }}>${d.precioUnitario.toFixed(2)}</td>
                  <td style={{ padding: "0.6rem 0.4rem", textAlign: "right", color: "#1e293b" }}>${d.subtotal.toFixed(2)}</td>
                  <td style={{ padding: "0.6rem 0.4rem", textAlign: "center" }}>
                    <button onClick={() => eliminarDetalle(i)} style={{
                      background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px"
                    }}>×</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ marginTop: "1rem", borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "240px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", color: "#64748b", fontSize: "13px" }}>
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", color: "#64748b", fontSize: "13px" }}>
                <span>IVA 15%</span><span>${iva.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderTop: "1px solid #e2e8f0", marginTop: "0.3rem", fontWeight: "700", fontSize: "15px", color: "#0f172a" }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "1rem" }}>
          <button onClick={limpiar} style={{
            background: "none", border: "1px solid #cbd5e1", borderRadius: "6px",
            color: "#64748b", padding: "0.5rem 1.5rem", cursor: "pointer", fontSize: "13px"
          }}>Limpiar</button>
          <button onClick={guardarFactura} style={{
            background: "#2563eb", border: "none", borderRadius: "6px",
            color: "white", padding: "0.5rem 1.5rem", cursor: "pointer", fontSize: "13px", fontWeight: "600"
          }}>Guardar factura</button>
        </div>
      </div>

      {/* Modal productos */}
      {mostrarProductos && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#ffffff", borderRadius: "12px", padding: "1.5rem", width: "480px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontWeight: "600", color: "#0f172a" }}>Seleccionar producto</span>
              <button onClick={() => setMostrarProductos(false)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "20px" }}>×</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ textAlign: "left", padding: "0.4rem" }}>Producto</th>
                  <th style={{ textAlign: "right", padding: "0.4rem" }}>Precio</th>
                  <th style={{ textAlign: "right", padding: "0.4rem" }}>Stock</th>
                  <th style={{ textAlign: "right", padding: "0.4rem" }}>Caducidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.6rem 0.4rem", color: "#1e293b" }}>{p.nombre}</td>
                    <td style={{ padding: "0.6rem 0.4rem", textAlign: "right", color: "#1e293b" }}>${p.precio.toFixed(2)}</td>
                    <td style={{ padding: "0.6rem 0.4rem", textAlign: "right", color: "#1e293b" }}>{p.stock}</td>
                    <td style={{ padding: "0.6rem 0.4rem", textAlign: "right", color: "#1e293b" }}>
                      {new Date(p.fechaCaducidad).toLocaleDateString("es-EC")}
                    </td>
                    <td style={{ padding: "0.6rem 0.4rem", textAlign: "right" }}>
                      <button onClick={() => agregarProducto(p)} style={{
                        background: "#2563eb", border: "none", borderRadius: "4px",
                        color: "white", padding: "0.3rem 0.8rem", cursor: "pointer", fontSize: "12px"
                      }}>Agregar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}