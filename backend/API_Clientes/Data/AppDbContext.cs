 using Microsoft.EntityFrameworkCore;
using API_Clientes.Models;

namespace API_Clientes.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; }
    }
}
