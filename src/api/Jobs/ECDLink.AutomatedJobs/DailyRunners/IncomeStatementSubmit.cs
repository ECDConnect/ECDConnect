using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System.Threading;
using System.Threading.Tasks;
using ECDLink.AutomatedJobs.Util;
using ECDLink.AutomatedJobs.Services;
using HotChocolate;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class IncomeStatementSubmit : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private SchedulerService _scheduler;
    private string _jobId = "IntegrationStatementsData";
    public IncomeStatementSubmit(IServiceScopeFactory scopeFactory, 
        IScheduleConfig<IncomeStatementSubmit> config//,  [Service] SchedulerService scheduler
        )
        : base(config.CronExpression, config.TimeZoneInfo)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            TenancyContext.SetTenantContext(scope);
            var service = scope.ServiceProvider.GetRequiredService<IIntegrationService>();

            await service.IntegrationStatementsData();
        }
    }
}
