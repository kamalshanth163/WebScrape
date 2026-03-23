using Cronos;

namespace WebScrape.Infrastructure.Scraping;

public static class CronExpressionHelper
{
    public static DateTime? GetNextOccurrence(string cronExpression)
    {
        try
        {
            // Try standard 5-part first (minute hour day month weekday)
            var format = cronExpression.Split(' ').Length == 6
                ? CronFormat.IncludeSeconds
                : CronFormat.Standard;

            var expression = CronExpression.Parse(cronExpression, format);
            return expression.GetNextOccurrence(DateTime.UtcNow, TimeZoneInfo.Utc);
        }
        catch
        {
            // Return null if expression is invalid — job will still run,
            // NextRunAt just won't be shown in the UI
            return null;
        }
    }
}