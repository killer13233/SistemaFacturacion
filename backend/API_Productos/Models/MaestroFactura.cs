 namespace API_Productos.Models
{
    public class MaestroFactura
    {
        public int Id { get; set; }
        public string NumeroDocumento { get; set; } = string.Empty;
        public int IdCliente { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
        public List<DetalleFactura> Detalles { get; set; } = new List<DetalleFactura>();
    }
}
