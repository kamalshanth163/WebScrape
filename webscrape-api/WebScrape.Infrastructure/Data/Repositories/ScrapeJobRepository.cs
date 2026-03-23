using Microsoft.EntityFrameworkCore;
using WebScrape.Domain.Entities;
using WebScrape.Domain.Enums;
using WebScrape.Domain.Interfaces;
namespace WebScrape.Infrastructure.Data.Repositories;

public class ScrapeJobRepository(AppDbContext db) : IScrapeJobRepository
{
    public async Task<IEnumerable<ScrapeJob>> GetAllAsync() =>
        await db.ScrapeJobs.OrderByDescending(j => j.CreatedAt).ToListAsync();

    public async Task<ScrapeJob?> GetByIdAsync(Guid id) =>
        await db.ScrapeJobs.FindAsync(id);

    public async Task<ScrapeJob> CreateAsync(ScrapeJob job)
    {
        db.ScrapeJobs.Add(job);
        await db.SaveChangesAsync();
        return job;
    }

    public async Task UpdateAsync(ScrapeJob job)
    {
        db.ScrapeJobs.Update(job);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var job = await db.ScrapeJobs.FindAsync(id);
        if (job != null) { db.ScrapeJobs.Remove(job); await db.SaveChangesAsync(); }
    }

    public Task<int> GetTotalCountAsync() => db.ScrapeJobs.CountAsync();

    public Task<int> GetSuccessCountAsync() =>
        db.ScrapeJobs.CountAsync(j => j.Status == JobStatus.Completed);
}