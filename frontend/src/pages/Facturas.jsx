import FormFactura from '../components/FormFactura.jsx'

export default function Facturas() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2>Nueva Factura</h2>
          <p>Busca o registra el cliente, luego agrega los productos</p>
        </div>
      </div>
      <FormFactura />
    </>
  )
}