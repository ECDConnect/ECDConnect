using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class IncomeStatementSubmit : CronJobService
{
    public IncomeStatementSubmit(IServiceScopeFactory scopeFactory,
        CronJobConfig<IncomeStatementSubmit> config, ILogger<IncomeStatementSubmit> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = GetRequiredService<IIntegrationService>();
        if (service != null && service.Enabled)
        {
            await service.IntegrationStatementsData();
        }
    }
}
