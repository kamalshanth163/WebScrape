using WebScrape.Application.DTOs;
using WebScrape.Domain.Entities;
using WebScrape.Domain.Enums;
using WebScrape.Domain.Interfaces;
namespace WebScrape.Application.UseCases;

public interface IHangfireJobService
{
    string EnqueueOneTime(Guid jobId);
    string EnqueueRecurring(Guid jobId, string cronExpression);
    void CancelJob(string hangfireJobId, bool isRecurring);
}

public class CreateScrapeJobUseCase(IScrapeJobRepository repo, IHangfireJobService hangfire)
{
    public async Task<ScrapeJobDto> ExecuteAsync(CreateScrapeJobDto dto)
    {
        var job = new ScrapeJob
        {
            Name = dto.Name, Url = dto.Url,
            ScheduleType = dto.ScheduleType,
            CronExpression = dto.CronExpression,
            UseHeadlessBrowser = dto.UseHeadlessBrowser
        };

        await repo.CreateAsync(job);

        job.HangfireJobId = dto.ScheduleType == ScheduleType.OneTime
            ? hangfire.EnqueueOneTime(job.Id)
            : hangfire.EnqueueRecurring(job.Id, dto.CronExpression!);

        await repo.UpdateAsync(job);
        return MapToDto(job);
    }

    private static ScrapeJobDto MapToDto(ScrapeJob j) =>
        new(j.Id, j.Name, j.Url, j.ScheduleType, j.CronExpression,
            j.Status, j.UseHeadlessBrowser, j.CreatedAt, j.LastRunAt, j.NextRunAt);
}