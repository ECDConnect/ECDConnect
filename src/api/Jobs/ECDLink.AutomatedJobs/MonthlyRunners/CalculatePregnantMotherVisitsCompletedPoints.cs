using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.MonthlyRunners;

public class CalculatePregnantMotherVisitsCompletedPoints : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public CalculatePregnantMotherVisitsCompletedPoints(IServiceScopeFactory scopeFactory, CronJobConfig<CalculatePregnantMotherVisitsCompletedPoints> config, ILogger<CalculatePregnantMotherVisitsCompletedPoints> logger)
            : base(config, logger)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope, "39077d0e-e443-4076-aaf2-978dc6805aa0");
            var service = scope.ServiceProvider.GetRequiredService<IGrowGreatPointsCalculationsService>();

            service.CalculatePregnantMotherVisitsCompletedPoints();
        }
    }
}
