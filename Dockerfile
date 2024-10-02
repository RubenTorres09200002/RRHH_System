# Usar la imagen base de ASP.NET
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Usar la imagen SDK para construir el proyecto
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["RRHH_System.csproj", "./"]
RUN dotnet restore "RRHH_System.csproj"
COPY . .
WORKDIR "/src/ClientApp"

# Instalar Node.js y npm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Instalar dependencias y construir la aplicación React
RUN npm install --prefix /src && npm run build --prefix /src

# Construir el proyecto .NET
WORKDIR /src
RUN dotnet build "RRHH_System.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publicar el proyecto
FROM build AS publish
RUN dotnet publish "RRHH_System.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Fase final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=build /src/build ./wwwroot
ENTRYPOINT ["dotnet", "RRHH_System.dll"]
