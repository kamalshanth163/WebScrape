using FluentValidation;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.EntityFrameworkCore;
using WebScrape.API.Hubs;
using WebScrape.Application.DTOs;
using WebScrape.Application.UseCases;
using WebScrape.Application.Validators;
using WebScrape.Infrastructure.Data;
using WebScrape.Infrastructure.Data.Repositories;
using WebScrape.Infrastructure.Scraping;
using WebScrape.Domain.Interfaces;

var builder = WebApplication.CreateBuilder(args);
var conn = builder.Configuration.GetConnectionString("DefaultConnection")!;

// Database
builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(conn));

// Hangfire (uses same PostgreSQL DB)
builder.Services.AddHangfire(cfg => cfg
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(conn));
builder.Services.AddHangfireServer();

// Repositories
builder.Services.AddScoped<IScrapeJobRepository, ScrapeJobRepository>();
builder.Services.AddScoped<IScrapeResultRepository, ScrapeResultRepository>();

// Services
builder.Services.AddScoped<IScraperService, ScraperService>();
builder.Services.AddScoped<IHangfireJobService, HangfireJobService>();

// Use Cases
builder.Services.AddScoped<CreateScrapeJobUseCase>();
builder.Services.AddScoped<DeleteScrapeJobUseCase>();
builder.Services.AddScoped<GetAnalyticsUseCase>();
builder.Services.AddScoped<GetScrapeResultsUseCase>();

// Validation
builder.Services.AddScoped<IValidator<CreateScrapeJobDto>, CreateScrapeJobValidator>();

// Caching
builder.Services.AddMemoryCache();

// SignalR
builder.Services.AddSignalR();

// CORS for React frontend
builder.Services.AddCors(o => o.AddPolicy("AllowFrontend", p =>
    p.WithOrigins("http://localhost:5173",
                  builder.Configuration["FRONTEND_URL"] ?? "")
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-run migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

app.UseSwagger(); app.UseSwaggerUI();
app.UseCors("AllowFrontend");
app.UseHangfireDashboard("/hangfire");
app.MapControllers();
app.MapHub<ScrapeHub>("/hubs/scrape");
app.Run();