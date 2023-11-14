using ECDLink.AutomatedJobs.Anonymise;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

/// <summary>
/// Removes any practitioners who have been scheduled for removal by their principal
/// </summary>
public class RemovePractitioners : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public RemovePractitioners(IServiceScopeFactory scopeFactory, IScheduleConfig<RemovePractitioners> config, ILogger<RemovePractitioners> logger)
            : base(config, logger)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);

            var service = scope.ServiceProvider.GetRequiredService<IAutomatedProcessService>();

            service.ProcessPractitionerRemovals();
        }
    }
}
