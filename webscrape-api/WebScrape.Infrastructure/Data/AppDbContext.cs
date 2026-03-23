using Microsoft.EntityFrameworkCore;
using WebScrape.Domain.Entities;
namespace WebScrape.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ScrapeJob> ScrapeJobs => Set<ScrapeJob>();
    public DbSet<ScrapeResult> ScrapeResults => Set<ScrapeResult>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<ScrapeJob>(e => {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Url).IsRequired();
            e.Property(x => x.ScheduleType).HasConversion<string>();
            e.Property(x => x.Status).HasConversion<string>();
            e.HasMany(x => x.Results).WithOne(x => x.ScrapeJob)
                .HasForeignKey(x => x.ScrapeJobId).OnDelete(DeleteBehavior.Cascade);
        });

        mb.Entity<ScrapeResult>(e => {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.ScrapedAt);
            e.HasIndex(x => x.ScrapeJobId);
        });
    }
}