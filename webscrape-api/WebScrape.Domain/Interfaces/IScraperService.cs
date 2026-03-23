namespace WebScrape.Domain.Interfaces;

public record ScrapeOutput(bool Success, string RawHtml,
    string? ExtractedText, string? ErrorMessage);

public interface IScraperService
{
    Task<ScrapeOutput> ScrapeAsync(string url, bool useHeadless);
}