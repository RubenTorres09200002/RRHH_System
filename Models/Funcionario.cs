using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RRHH_System.Models
{
    public class Funcionario
    {
        [BsonId] // Indica que este es el Id del documento en MongoDB
        public string Id { get; set; } = Guid.NewGuid().ToString(); // Asigna un ID por defecto

        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Cedula { get; set; }
        public DateTime FechaNacimiento { get; set; }
    }
}