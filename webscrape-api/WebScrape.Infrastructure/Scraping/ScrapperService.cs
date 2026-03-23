using AngleSharp;
using PuppeteerSharp;
using WebScrape.Domain.Interfaces;
namespace WebScrape.Infrastructure.Scraping;

public class ScraperService : IScraperService
{
    public async Task<ScrapeOutput> ScrapeAsync(string url, bool useHeadless)
    {
        try
        {
            return useHeadless
                ? await ScrapeWithPuppeteerAsync(url)
                : await ScrapeWithAngleSharpAsync(url);
        }
        catch (Exception ex)
        {
            return new ScrapeOutput(false, string.Empty, null, ex.Message);
        }
    }

    private static async Task<ScrapeOutput> ScrapeWithAngleSharpAsync(string url)
    {
        using var http = new HttpClient();
        http.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (compatible; WebScrapeBot/1.0)");

        var html = await http.GetStringAsync(url);
        var config = Configuration.Default;
        var context = BrowsingContext.New(config);
        var doc = await context.OpenAsync(req => req.Content(html));

        var text = doc.Body?.TextContent?.Trim() ?? string.Empty;
        return new ScrapeOutput(true, html, text, null);
    }

    private static async Task<ScrapeOutput> ScrapeWithPuppeteerAsync(string url)
    {
        await new BrowserFetcher().DownloadAsync();
        await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
        {
            Headless = true,
            Args = ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        await using var page = await browser.NewPageAsync();
        await page.GoToAsync(url, WaitUntilNavigation.Networkidle0);
        var html = await page.GetContentAsync();
        var text = await page.EvaluateExpressionAsync<string>("document.body.innerText");
        return new ScrapeOutput(true, html, text, null);
    }
}