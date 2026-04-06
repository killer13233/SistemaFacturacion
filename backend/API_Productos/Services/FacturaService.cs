 using API_Productos.Data;
using API_Productos.Models;
using Microsoft.EntityFrameworkCore;

namespace API_Productos.Services
{
    public class FacturaService
    {
        private readonly AppDbContext _context;

        public FacturaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MaestroFactura>> GetAllAsync()
        {
            return await _context.MaestroFacturas
                .Include(f => f.Detalles)
                .ThenInclude(d => d.Producto)
                .ToListAsync();
        }

        public async Task<MaestroFactura?> GetByIdAsync(int id)
        {
            return await _context.MaestroFacturas
                .Include(f => f.Detalles)
                .ThenInclude(d => d.Producto)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

public async Task<MaestroFactura> CreateAsync(MaestroFactura factura)
{
    var ultimo = await _context.MaestroFacturas
        .OrderByDescending(f => f.Id)
        .FirstOrDefaultAsync();

    int siguiente = (ultimo?.Id ?? 0) + 1;
    factura.NumeroDocumento = $"#{siguiente:D4}";
    factura.Fecha = DateTime.Now;

    foreach (var detalle in factura.Detalles)
    {
        var producto = await _context.Productos
            .FirstOrDefaultAsync(p => p.Id == detalle.ProductoId);

        if (producto == null)
            throw new Exception($"Producto con ID {detalle.ProductoId} no existe");

        if (producto.Stock < detalle.Cantidad)
            throw new Exception($"No hay suficiente stock para {producto.Nombre}");

        producto.Stock -= detalle.Cantidad;
    }

    decimal subtotal = factura.Detalles.Sum(d => d.Subtotal);
    factura.Total = subtotal * 1.15m;

    _context.MaestroFacturas.Add(factura);
    await _context.SaveChangesAsync();

    return factura;
}
        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.MaestroFacturas.FindAsync(id);
            if (existing == null) return false;

            _context.MaestroFacturas.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
