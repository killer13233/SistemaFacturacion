 using API_Clientes.Models;
using API_Clientes.Services;
using Microsoft.AspNetCore.Mvc;

namespace API_Clientes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteService _service;

        public ClienteController(ClienteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clientes = await _service.GetAllAsync();
            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cliente = await _service.GetByIdAsync(id);
            if (cliente == null) return NotFound();
            return Ok(cliente);
        }
        [HttpGet("cedula/{cedula}")]
public async Task<IActionResult> GetByCedula(string cedula)
{
    var cliente = await _service.GetByCedulaAsync(cedula);
    if (cliente == null) return NotFound();
    return Ok(cliente);
}

        [HttpPost]
        public async Task<IActionResult> Create(Cliente cliente)
        {
            var nuevo = await _service.CreateAsync(cliente);
            return CreatedAtAction(nameof(GetById), new { id = nuevo.Id }, nuevo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Cliente cliente)
        {
            var actualizado = await _service.UpdateAsync(id, cliente);
            if (actualizado == null) return NotFound();
            return Ok(actualizado);
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