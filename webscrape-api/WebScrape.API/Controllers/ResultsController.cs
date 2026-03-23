using Microsoft.AspNetCore.Mvc;
using WebScrape.Application.DTOs;
using WebScrape.Application.UseCases;
using WebScrape.Domain.Interfaces;

[ApiController, Route("api/[controller]")]
public class ResultsController(GetScrapeResultsUseCase getUseCase,
    IScrapeResultRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPaged(int page = 1, int pageSize = 20) =>
        Ok(await getUseCase.ExecuteAsync(page, pageSize));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var r = await repo.GetByIdAsync(id);
        if (r == null) return NotFound();
        return Ok(new ScrapeResultDetailDto(r.Id, r.ScrapeJob.Name, r.ScrapeJob.Url,
            r.RawHtml, r.ExtractedText, r.FileSizeBytes, r.ScrapedAt));
    }

    [HttpGet("{id}/download")]
    public async Task<IActionResult> Download(Guid id, string format = "json")
    {
        var r = await repo.GetByIdAsync(id);
        if (r == null) return NotFound();
        if (format == "html")
            return File(System.Text.Encoding.UTF8.GetBytes(r.RawHtml),
                "text/html", $"result-{r.Id}.html");
        var json = System.Text.Json.JsonSerializer.Serialize(new {
            r.Id, r.ScrapeJob.Url, r.ScrapedAt, r.RawHtml, r.ExtractedText });
        return File(System.Text.Encoding.UTF8.GetBytes(json),
            "application/json", $"result-{r.Id}.json");
    }
}