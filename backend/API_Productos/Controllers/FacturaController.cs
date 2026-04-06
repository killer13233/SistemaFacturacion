using API_Productos.Models;
using API_Productos.Services;
using Microsoft.AspNetCore.Mvc;

namespace API_Productos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacturaController : ControllerBase
    {
        private readonly FacturaService _service;

        public FacturaController(FacturaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var facturas = await _service.GetAllAsync();
            return Ok(facturas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var factura = await _service.GetByIdAsync(id);
            if (factura == null) return NotFound();
            return Ok(factura);
        }

        [HttpPost]
public async Task<IActionResult> Create(MaestroFactura factura)
{
    try
    {
        var nueva = await _service.CreateAsync(factura);
        return CreatedAtAction(nameof(GetById), new { id = nueva.Id }, nueva);
    }
    catch (Exception ex)
    {
        return BadRequest(new { mensaje = ex.Message });
    }
}

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var resultado = await _service.DeleteAsync(id);
            if (!resultado) return NotFound();
            return NoContent();
        }
    }
}