using FluentValidation;
using WebScrape.Application.DTOs;
using WebScrape.Domain.Enums;
namespace WebScrape.Application.Validators;

public class CreateScrapeJobValidator : AbstractValidator<CreateScrapeJobDto>
{
    public CreateScrapeJobValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Url).NotEmpty().Must(BeValidUrl)
            .WithMessage("Must be a valid URL starting with http:// or https://");
        RuleFor(x => x.CronExpression)
            .NotEmpty().When(x => x.ScheduleType == ScheduleType.Recurring)
            .WithMessage("Cron expression required for recurring jobs");
    }

    private static bool BeValidUrl(string url) =>
        Uri.TryCreate(url, UriKind.Absolute, out var u) &&
        (u.Scheme == Uri.UriSchemeHttp || u.Scheme == Uri.UriSchemeHttps);
}