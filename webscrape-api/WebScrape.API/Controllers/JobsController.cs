using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using WebScrape.Application.DTOs;
using WebScrape.Application.UseCases;
using WebScrape.Domain.Interfaces;
namespace WebScrape.API.Controllers;

[ApiController, Route("api/[controller]")]
public class JobsController(IScrapeJobRepository repo,
    CreateScrapeJobUseCase createUseCase,
    DeleteScrapeJobUseCase deleteUseCase,
    IValidator<CreateScrapeJobDto> validator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var jobs = await repo.GetAllAsync();
        return Ok(jobs.Select(j => new ScrapeJobDto(
            j.Id, j.Name, j.Url, j.ScheduleType, j.CronExpression,
            j.Status, j.UseHeadlessBrowser, j.CreatedAt, j.LastRunAt, j.NextRunAt)));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateScrapeJobDto dto)
    {
        var validation = await validator.ValidateAsync(dto);
        if (!validation.IsValid) return BadRequest(validation.Errors);
        var result = await createUseCase.ExecuteAsync(dto);
        return CreatedAtAction(nameof(GetAll), result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await deleteUseCase.ExecuteAsync(id);
        return NoContent();
    }
}