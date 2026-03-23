using Microsoft.EntityFrameworkCore;
using WebScrape.Domain.Entities;
using WebScrape.Domain.Interfaces;
namespace WebScrape.Infrastructure.Data.Repositories;

public class ScrapeResultRepository(AppDbContext db) : IScrapeResultRepository
{
    public async Task<(IEnumerable<ScrapeResult>, int)> GetPagedAsync(int page, int pageSize)
    {
        var query = db.ScrapeResults.Include(r => r.ScrapeJob)
            .OrderByDescending(r => r.ScrapedAt);
        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }

    public async Task<ScrapeResult?> GetByIdAsync(Guid id) =>
        await db.ScrapeResults.Include(r => r.ScrapeJob).FirstOrDefaultAsync(r => r.Id == id);

    public async Task<ScrapeResult> CreateAsync(ScrapeResult result)
    {
        db.ScrapeResults.Add(result);
        await db.SaveChangesAsync();
        return result;
    }

    public Task<long> GetTotalBytesAsync() =>
        db.ScrapeResults.SumAsync(r => r.FileSizeBytes);
}