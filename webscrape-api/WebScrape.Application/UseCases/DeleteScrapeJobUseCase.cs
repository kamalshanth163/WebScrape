using WebScrape.Domain.Interfaces;
using WebScrape.Domain.Enums;
namespace WebScrape.Application.UseCases;

public class DeleteScrapeJobUseCase(IScrapeJobRepository repo, IHangfireJobService hangfire)
{
    public async Task ExecuteAsync(Guid id)
    {
        var job = await repo.GetByIdAsync(id);
        if (job == null) return;

        if (!string.IsNullOrEmpty(job.HangfireJobId))
        {
            var isRecurring = job.ScheduleType == ScheduleType.Recurring;
            hangfire.CancelJob(job.HangfireJobId, isRecurring);
        }

        await repo.DeleteAsync(id);
    }
}
