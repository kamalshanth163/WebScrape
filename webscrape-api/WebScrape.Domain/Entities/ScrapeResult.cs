namespace WebScrape.Domain.Entities;

public class ScrapeResult
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ScrapeJobId { get; set; }
    public string RawHtml { get; set; } = string.Empty;
    public string? ExtractedText { get; set; }
    public long FileSizeBytes { get; set; }
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime ScrapedAt { get; set; } = DateTime.UtcNow;
    public ScrapeJob ScrapeJob { get; set; } = null!;
}