namespace WebScrape.Application.DTOs;

public record ScrapeResultDto(
    Guid Id, Guid ScrapeJobId, string JobName, string Url,
    string ScheduleType, bool Success, string? ErrorMessage,
    long FileSizeBytes, DateTime ScrapedAt
);

public record ScrapeResultDetailDto(
    Guid Id, string JobName, string Url,
    string RawHtml, string? ExtractedText,
    long FileSizeBytes, DateTime ScrapedAt
);

public record PagedResultsDto(
    IEnumerable<ScrapeResultDto> Items,
    int Total, int Page, int PageSize
);

public record AnalyticsDto(
    int TotalJobs, int SuccessfulJobs,
    double SuccessRate, long TotalBytesCollected,
    IEnumerable<ScheduledJobInfo> UpcomingJobs
);

public record ScheduledJobInfo(string Name, DateTime? NextRun);