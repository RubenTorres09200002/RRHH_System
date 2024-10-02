using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RRHH_System.Models
{
    public class Registro
    {
        [BsonId] // Indica que este es el Id del documento en MongoDB
        public string Id { get; set; } = Guid.NewGuid().ToString(); // Asigna un ID por defecto
        public string FuncionarioId { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan HoraEntrada { get; set; }
        public TimeSpan HoraSalida { get; set; }
    }
}