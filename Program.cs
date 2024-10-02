using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using RRHH_System.Data;

var builder = WebApplication.CreateBuilder(args);

// Configurar el logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Registrar el contexto de MongoDB
builder.Services.AddSingleton<MongoDbContext>(s => 
    new MongoDbContext(builder.Configuration.GetConnectionString("MongoDb"), "rrhh-system"));

// Agregar servicios de controladores
builder.Services.AddControllers();

// Agregar servicios de autorización
builder.Services.AddAuthorization();

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:3000") // Permitir el origen de tu frontend
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Configurar el middleware
app.UseHttpsRedirection();

// Usar la política de CORS antes de la autorización
app.UseCors("AllowSpecificOrigin");

app.UseAuthorization(); 
app.MapControllers(); 
app.Run();