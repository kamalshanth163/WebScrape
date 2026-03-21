# 1. Create root folder and solution
mkdir webscrape-api && cd webscrape-api
dotnet new sln -n WebScrape

# 2. Create all four class library / web projects
dotnet new classlib -n WebScrape.Domain -f net10.0
dotnet new classlib -n WebScrape.Application -f net10.0
dotnet new classlib -n WebScrape.Infrastructure -f net10.0
dotnet new webapi -n WebScrape.API -f net10.0

# 3. Add all projects to solution
dotnet sln add WebScrape.Domain/WebScrape.Domain.csproj
dotnet sln add WebScrape.Application/WebScrape.Application.csproj
dotnet sln add WebScrape.Infrastructure/WebScrape.Infrastructure.csproj
dotnet sln add WebScrape.API/WebScrape.API.csproj

# 4. Wire up project references (Clean Architecture dependency flow)
dotnet add WebScrape.Application/WebScrape.Application.csproj reference WebScrape.Domain/WebScrape.Domain.csproj
dotnet add WebScrape.Infrastructure/WebScrape.Infrastructure.csproj reference WebScrape.Domain/WebScrape.Domain.csproj
dotnet add WebScrape.Infrastructure/WebScrape.Infrastructure.csproj reference WebScrape.Application/WebScrape.Application.csproj
dotnet add WebScrape.API/WebScrape.API.csproj reference WebScrape.Application/WebScrape.Application.csproj
dotnet add WebScrape.API/WebScrape.API.csproj reference WebScrape.Infrastructure/WebScrape.Infrastructure.csproj

# 5. Install NuGet packages for each project
cd WebScrape.Application
dotnet add package FluentValidation
dotnet add package FluentValidation.DependencyInjectionExtensions
cd ..

cd WebScrape.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Hangfire.Core
dotnet add package Hangfire.AspNetCore
dotnet add package Hangfire.PostgreSql
dotnet add package AngleSharp
dotnet add package PuppeteerSharp
dotnet add package Microsoft.Extensions.Caching.Memory
cd ..

cd WebScrape.API
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.SignalR
dotnet add package Swashbuckle.AspNetCore
dotnet add package Microsoft.AspNetCore.Cors
cd ..
