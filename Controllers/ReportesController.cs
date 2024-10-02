using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using RRHH_System.Models;
using RRHH_System.Data; // Asegúrate de que esto apunte a tu contexto MongoDB

namespace RRHH_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {
        private readonly MongoDbContext _context;

        public ReportesController(MongoDbContext context)
        {
            _context = context;
        }

        // GET: api/reportes/{funcionarioId}?desde={fechaDesde}&hasta={fechaHasta}
        [HttpGet("{funcionarioId}")]
        public async Task<ActionResult<List<Registro>>> GetReportes(string funcionarioId, DateTime desde, DateTime hasta)
        {
            var reportes = await _context.Registros
                .Find(r => r.FuncionarioId == funcionarioId && r.Fecha >= desde && r.Fecha <= hasta)
                .ToListAsync();

            if (reportes == null || reportes.Count == 0)
            {
                return NotFound("No se encontraron reportes para el funcionario en el rango de fechas especificado.");
            }

            return Ok(reportes);
        }
    }
}