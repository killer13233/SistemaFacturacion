using System.Text.Json.Serialization;

namespace API_Productos.Models
{
    public class DetalleFactura
    {
        public int Id { get; set; }

        // 🔹 Claves foráneas con nombres correctos
        public int MaestroFacturaId { get; set; }
        public int ProductoId { get; set; }

        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }

        // 🔹 Propiedades de navegación
        [JsonIgnore]
        public MaestroFactura? MaestroFactura { get; set; }

        [JsonIgnore]
        public Producto? Producto { get; set; }
    }
}