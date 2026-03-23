using Hangfire;
using Microsoft.AspNetCore.SignalR;
using WebScrape.Application.UseCases;
using WebScrape.Domain.Entities;
using WebScrape.Domain.Enums;
using WebScrape.Domain.Interfaces;

namespace WebScrape.Infrastructure.Scraping;

public class HangfireJobService(IScrapeJobRepository jobRepo,
    IScrapeResultRepository resultRepo, IScraperService scraper,
    IHubContext<Hub> hub) : IHangfireJobService
{
    public string EnqueueOneTime(Guid jobId) =>
        BackgroundJob.Enqueue(() => ExecuteScrapeAsync(jobId));

    public string EnqueueRecurring(Guid jobId, string cronExpression)
    {
        var recurringId = $"scrape-{jobId}";
        RecurringJob.AddOrUpdate(recurringId, () => ExecuteScrapeAsync(jobId), cronExpression);
        return recurringId;
    }

    public void CancelJob(string hangfireJobId, bool isRecurring)
    {
        if (isRecurring) RecurringJob.RemoveIfExists(hangfireJobId);
        else BackgroundJob.Delete(hangfireJobId);
    }

    [AutomaticRetry(Attempts = 3)]
    public async Task ExecuteScrapeAsync(Guid jobId)
    {
        var job = await jobRepo.GetByIdAsync(jobId);
        if (job == null) return;

        job.Status = JobStatus.Running;
        job.LastRunAt = DateTime.UtcNow;
        await jobRepo.UpdateAsync(job);
        await hub.Clients.All.SendAsync("JobStatusChanged", job.Id, "Running");

        var output = await scraper.ScrapeAsync(job.Url, job.UseHeadlessBrowser);

        var result = new ScrapeResult
        {
            ScrapeJobId = job.Id,
            RawHtml = output.RawHtml,
            ExtractedText = output.ExtractedText,
            FileSizeBytes = System.Text.Encoding.UTF8.GetByteCount(output.RawHtml),
            Success = output.Success,
            ErrorMessage = output.ErrorMessage
        };

        await resultRepo.CreateAsync(result);

        job.Status = output.Success ? JobStatus.Completed : JobStatus.Failed;
        job.NextRunAt = job.ScheduleType == ScheduleType.Recurring
            ? CronExpressionHelper.GetNextOccurrence(job.CronExpression!) : null;
        await jobRepo.UpdateAsync(job);

        await hub.Clients.All.SendAsync("JobCompleted", job.Id,
            job.Status.ToString(), result.Id);
    }
}