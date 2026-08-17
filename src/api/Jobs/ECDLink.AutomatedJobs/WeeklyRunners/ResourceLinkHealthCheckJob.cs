using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.WeeklyRunners;

public class ResourceLinkHealthCheckJob : CronJobService
{
    public ResourceLinkHealthCheckJob(
        IServiceScopeFactory scopeFactory,
        CronJobConfig<ResourceLinkHealthCheckJob> config,
        ILogger<ResourceLinkHealthCheckJob> logger)
        : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = GetRequiredService<IResourceLinkHealthCheckService>();
        await service.RunHealthChecksAsync(cancellationToken);
    }
}
