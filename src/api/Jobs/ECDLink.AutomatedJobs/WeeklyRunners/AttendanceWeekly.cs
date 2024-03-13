using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection; 
using System.Threading;
using System.Threading.Tasks;
using ECDLink.AutomatedJobs.Util;
using ECDLink.AutomatedJobs.Anonymise;
using Microsoft.Extensions.Logging;

namespace ECDLink.AutomatedJobs.DailyRunners;

public class AttendanceWeekly : CronJobService
{
    public AttendanceWeekly(IServiceScopeFactory scopeFactory, CronJobConfig<AttendanceWeekly> config, ILogger<AttendanceWeekly> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        var service = Scope.ServiceProvider.GetRequiredService<IIntegrationService>();
        if (service != null && service.Enabled)
        {
            await service.IntegrationAttendanceByDueData();
            await service.IntegrationLeagueData();
        }
    }
}
