using RRHH_System.Models;

namespace RRHH_System.Data;

using MongoDB.Driver;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(string connectionString, string dbName)
    {
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(dbName);
    }

    public IMongoCollection<Funcionario> Funcionarios => _database.GetCollection<Funcionario>("Funcionarios");
    public IMongoCollection<Registro> Registros => _database.GetCollection<Registro>("Registros");
}