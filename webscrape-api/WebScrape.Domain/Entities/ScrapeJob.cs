using WebScrape.Domain.Enums;

namespace WebScrape.Domain.Entities;

public class ScrapeJob
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public ScheduleType ScheduleType { get; set; }
    public string? CronExpression { get; set; }
    public JobStatus Status { get; set; } = JobStatus.Pending;
    public bool UseHeadlessBrowser { get; set; }
    public string? HangfireJobId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastRunAt { get; set; }
    public DateTime? NextRunAt { get; set; }
    public ICollection<ScrapeResult> Results { get; set; } = [];
}