using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebScrape.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ScrapeJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    ScheduleType = table.Column<string>(type: "text", nullable: false),
                    CronExpression = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    UseHeadlessBrowser = table.Column<bool>(type: "boolean", nullable: false),
                    HangfireJobId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastRunAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NextRunAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScrapeJobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ScrapeResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ScrapeJobId = table.Column<Guid>(type: "uuid", nullable: false),
                    RawHtml = table.Column<string>(type: "text", nullable: false),
                    ExtractedText = table.Column<string>(type: "text", nullable: true),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    Success = table.Column<bool>(type: "boolean", nullable: false),
                    ErrorMessage = table.Column<string>(type: "text", nullable: true),
                    ScrapedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScrapeResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScrapeResults_ScrapeJobs_ScrapeJobId",
                        column: x => x.ScrapeJobId,
                        principalTable: "ScrapeJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ScrapeResults_ScrapedAt",
                table: "ScrapeResults",
                column: "ScrapedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ScrapeResults_ScrapeJobId",
                table: "ScrapeResults",
                column: "ScrapeJobId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ScrapeResults");

            migrationBuilder.DropTable(
                name: "ScrapeJobs");
        }
    }
}
