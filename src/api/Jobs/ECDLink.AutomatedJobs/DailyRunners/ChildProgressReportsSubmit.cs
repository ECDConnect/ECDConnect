using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System.Threading;
using System.Threading.Tasks;
using ECDLink.AutomatedJobs.Util;
using Microsoft.Extensions.Logging;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class ChildProgressReportsSubmit : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public ChildProgressReportsSubmit(IServiceScopeFactory scopeFactory, CronJobConfig<ChildProgressReportsSubmit> config, ILogger<ChildProgressReportsSubmit> logger)
            : base(config, logger)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<IIntegrationService>();
            if (service != null && service.Enabled)
            {
                await service.PushChildProgressReports();
            }
        }
    }
}
