using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class Visits : CronJobService
{
    public Visits(IServiceScopeFactory scopeFactory,
        CronJobConfig<Visits> config, ILogger<Visits> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        // var service = GetRequiredService<IIntegrationService>();
        // if (service != null && service.Enabled)
        // {
        //     // await service.PushSmartSpaceVisitsData();
        //     // await service.PushPQAData();
        //     // await service.PushReAccreditationData();
        // }
    }
}
