using WebScrape.Domain.Enums;
namespace WebScrape.Application.DTOs;

public record CreateScrapeJobDto(
    string Name,
    string Url,
    ScheduleType ScheduleType,
    string? CronExpression,
    bool UseHeadlessBrowser
);