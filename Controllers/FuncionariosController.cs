using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; // Asegúrate de tener esta directiva
using MongoDB.Driver;
using RRHH_System.Data;
using RRHH_System.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RRHH_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FuncionariosController : ControllerBase
    {
        private readonly MongoDbContext _context;
        private readonly ILogger<FuncionariosController> _logger;

        public FuncionariosController(MongoDbContext context, ILogger<FuncionariosController> logger)
        {
            _context = context;
            _logger = logger; // Inyección del logger
        }

        [HttpGet]
        public async Task<ActionResult<List<Funcionario>>> Get()
        {
            try
            {
                var funcionarios = await _context.Funcionarios.Find(_ => true).ToListAsync();
                return Ok(funcionarios);
            }
            catch (Exception ex)
            {
                // Log the exception message
                _logger.LogError($"Error en Get: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Funcionario>> GetById(string id)
        {
            try
            {
                var funcionario = await _context.Funcionarios.Find(f => f.Id == id).FirstOrDefaultAsync();
                if (funcionario == null)
                {
                    return NotFound();
                }
                return Ok(funcionario);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error en GetById: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Funcionario>> Post([FromBody] Funcionario funcionario)
        {
            // Validar el modelo antes de insertarlo
            if (funcionario == null)
            {
                return BadRequest("Funcionario no puede ser nulo.");
            }

            // Genera un nuevo Id solo si el Id enviado está vacío
            if (string.IsNullOrEmpty(funcionario.Id))
            {
                funcionario.Id = Guid.NewGuid().ToString();
            }

            await _context.Funcionarios.InsertOneAsync(funcionario);
            return CreatedAtAction(nameof(GetById), new { id = funcionario.Id }, funcionario);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(string id, [FromBody] Funcionario funcionario)
        {
            if (funcionario == null)
            {
                return BadRequest("Funcionario no puede ser nulo.");
            }

            
            if (funcionario.Id != id)
            {
                return BadRequest("El ID del funcionario no coincide con el ID en la URL.");
            }

            try
            {
                var result = await _context.Funcionarios.ReplaceOneAsync(f => f.Id == id, funcionario);
                if (result.ModifiedCount == 0)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error en Update: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
