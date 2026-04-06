using Microsoft.EntityFrameworkCore;
using API_Productos.Models;

namespace API_Productos.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Producto> Productos { get; set; }
        public DbSet<MaestroFactura> MaestroFacturas { get; set; }
        public DbSet<DetalleFactura> DetalleFacturas { get; set; }
    }
}