using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Services;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
using ECDLink.AutomatedJobs.Util;
using HotChocolate;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class IncomeStatementSubmit : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private string _jobId = "IntegrationStatementsData";
    public IncomeStatementSubmit(IServiceScopeFactory scopeFactory,
        CronJobConfig<IncomeStatementSubmit> config, ILogger<IncomeStatementSubmit> logger)
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
                await service.IntegrationStatementsData();
            }
        }
    }
}
