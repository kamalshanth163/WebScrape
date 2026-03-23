using WebScrape.Domain.Enums;
namespace WebScrape.Application.DTOs;

public record ScrapeJobDto(
    Guid Id, string Name, string Url,
    ScheduleType ScheduleType, string? CronExpression,
    JobStatus Status, bool UseHeadlessBrowser,
    DateTime CreatedAt, DateTime? LastRunAt, DateTime? NextRunAt
);