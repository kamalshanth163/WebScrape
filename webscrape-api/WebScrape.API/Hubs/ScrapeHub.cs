using Microsoft.AspNetCore.SignalR;

namespace WebScrape.API.Hubs;

public class ScrapeHub : Hub
{
    // Clients subscribe to this hub
    // Server pushes via IHubContext<ScrapeHub> from HangfireJobService
    // Events: "JobStatusChanged", "JobCompleted"
    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("Connected", Context.ConnectionId);
        await base.OnConnectedAsync();
    }
}