using WebScrape.Application.DTOs;
using WebScrape.Domain.Interfaces;
namespace WebScrape.Application.UseCases;

public class GetScrapeResultsUseCase(IScrapeResultRepository repo)
{
    public async Task<PagedResultsDto> ExecuteAsync(int page, int pageSize)
    {
        var (items, total) = await repo.GetPagedAsync(page, pageSize);
        var dtos = items.Select(r => new ScrapeResultDto(
            r.Id, r.ScrapeJobId, r.ScrapeJob.Name, r.ScrapeJob.Url,
            r.ScrapeJob.ScheduleType.ToString(), r.Success,
            r.ErrorMessage, r.FileSizeBytes, r.ScrapedAt));
        return new PagedResultsDto(dtos, total, page, pageSize);
    }
}