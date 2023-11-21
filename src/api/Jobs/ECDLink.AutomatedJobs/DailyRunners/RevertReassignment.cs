using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class RevertReassignment : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public RevertReassignment(IServiceScopeFactory scopeFactory, IScheduleConfig<ExpireInvitations> config, ILogger<RevertReassignment> logger)
            : base(config, logger)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var service = scope.ServiceProvider.GetRequiredService<IReassignmentService>();

            TenancyContext.SetTenantContext(scope);            

            service.ReassignAbsentees();
        }
    }
}
