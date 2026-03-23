using WebScrape.Domain.Entities;
namespace WebScrape.Domain.Interfaces;

public interface IScrapeJobRepository
{
    Task<IEnumerable<ScrapeJob>> GetAllAsync();
    Task<ScrapeJob?> GetByIdAsync(Guid id);
    Task<ScrapeJob> CreateAsync(ScrapeJob job);
    Task UpdateAsync(ScrapeJob job);
    Task DeleteAsync(Guid id);
    Task<int> GetTotalCountAsync();
    Task<int> GetSuccessCountAsync();
}