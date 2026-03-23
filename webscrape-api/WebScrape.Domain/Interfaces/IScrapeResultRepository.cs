using WebScrape.Domain.Entities;
namespace WebScrape.Domain.Interfaces;

public interface IScrapeResultRepository
{
    Task<(IEnumerable<ScrapeResult> Items, int Total)>
        GetPagedAsync(int page, int pageSize);
    Task<ScrapeResult?> GetByIdAsync(Guid id);
    Task<ScrapeResult> CreateAsync(ScrapeResult result);
    Task<long> GetTotalBytesAsync();
}