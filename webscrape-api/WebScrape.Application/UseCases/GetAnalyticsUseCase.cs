using WebScrape.Application.DTOs;
using WebScrape.Domain.Interfaces;
namespace WebScrape.Application.UseCases;

public class GetAnalyticsUseCase(IScrapeJobRepository jobRepo,
    IScrapeResultRepository resultRepo)
{
    public async Task<AnalyticsDto> ExecuteAsync()
    {
        var total = await jobRepo.GetTotalCountAsync();
        var success = await jobRepo.GetSuccessCountAsync();
        var bytes = await resultRepo.GetTotalBytesAsync();
        var jobs = await jobRepo.GetAllAsync();

        var upcoming = jobs
            .Where(j => j.NextRunAt != null)
            .OrderBy(j => j.NextRunAt)
            .Take(5)
            .Select(j => new ScheduledJobInfo(j.Name, j.NextRunAt));

        return new AnalyticsDto(total, success,
            total > 0 ? Math.Round((double)success / total * 100, 1) : 0,
            bytes, upcoming);
    }
}