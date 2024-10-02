using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RRHH_System.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RRHH_System.Data;

namespace RRHH_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrosController : ControllerBase
    {
        private readonly MongoDbContext _context;

        public RegistrosController(MongoDbContext context)
        {
            _context = context;
        }

        // POST: api/registros
        [HttpPost]
        public async Task<ActionResult<Registro>> Post([FromBody] Registro registro)
        {
            if (registro == null)
            {
                return BadRequest("El registro no puede ser nulo.");
            }

            // Generar un ID aleatorio si no se proporciona o viene vacío
            if (string.IsNullOrEmpty(registro.Id))
            {
                registro.Id = Guid.NewGuid().ToString();
            }

            // Verificar que el FuncionarioId exista en la colección Funcionarios
            var funcionario = await _context.Funcionarios.Find(f => f.Id == registro.FuncionarioId).FirstOrDefaultAsync();
            if (funcionario == null)
            {
                return BadRequest($"No se encontró un funcionario con el ID: {registro.FuncionarioId}.");
            }

            // Verificar que la hora de entrada sea menor a la hora de salida
            if (registro.HoraEntrada >= registro.HoraSalida)
            {
                return BadRequest("La hora de entrada debe ser menor que la hora de salida.");
            }

            // Insertar el registro
            await _context.Registros.InsertOneAsync(registro);
            return CreatedAtAction(nameof(GetById), new { id = registro.Id }, registro);
        }

        // GET: api/registros/{funcionarioId}
        [HttpGet("{funcionarioId}")]
        public async Task<ActionResult<List<Registro>>> GetRegistrosByFuncionario(string funcionarioId)
        {
            var registros = await _context.Registros.Find(r => r.FuncionarioId == funcionarioId).ToListAsync();
            return Ok(registros);
        }

        // GET: api/registros/{id}
        [HttpGet("registro/{id}")]
        public async Task<ActionResult<Registro>> GetById(string id)
        {
            var registro = await _context.Registros.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (registro == null)
            {
                return NotFound();
            }
            return Ok(registro);
        }
        
    }
}
