 using API_Clientes.Data;
using API_Clientes.Models;
using Microsoft.EntityFrameworkCore;

namespace API_Clientes.Services
{
    public class ClienteService
    {
        private readonly AppDbContext _context;

        public ClienteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Cliente>> GetAllAsync()
        {
            return await _context.Clientes.ToListAsync();
        }

        public async Task<Cliente?> GetByIdAsync(int id)
        {
            return await _context.Clientes.FindAsync(id);
        }
        public async Task<Cliente?> GetByCedulaAsync(string cedula)
{
    return await _context.Clientes.FirstOrDefaultAsync(c => c.Cedula == cedula);
}

        public async Task<Cliente> CreateAsync(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
            return cliente;
        }

        public async Task<Cliente?> UpdateAsync(int id, Cliente cliente)
        {
            var existing = await _context.Clientes.FindAsync(id);
            if (existing == null) return null;

            existing.Nombre = cliente.Nombre;
            existing.Apellido = cliente.Apellido;
            existing.Email = cliente.Email;
            existing.Telefono = cliente.Telefono;
            existing.Direccion = cliente.Direccion;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Clientes.FindAsync(id);
            if (existing == null) return false;

            _context.Clientes.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
