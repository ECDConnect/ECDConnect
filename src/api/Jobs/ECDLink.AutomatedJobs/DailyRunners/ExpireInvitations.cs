using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class ExpireInvitations : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public ExpireInvitations(IServiceScopeFactory scopeFactory, CronJobConfig<ExpireInvitations> config, ILogger<ExpireInvitations> logger)
            : base(config, logger)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<IReassignmentService>();
            service.ExpireRelationshipLinks();
        }
    }
}
