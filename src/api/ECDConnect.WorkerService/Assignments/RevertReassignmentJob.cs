using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;

namespace ECDConnect.WorkerService.Assignments;

public class RevertReassignmentJob : CronJobService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public RevertReassignmentJob(IServiceScopeFactory scopeFactory, IScheduleConfig<RevertReassignmentJob> config)
        : base(config.CronExpression, config.TimeZoneInfo)
    {
        _scopeFactory = scopeFactory;
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var anonChildService = scope.ServiceProvider.GetRequiredService<IChildrenAnonymiseService>();

            //anonChildService.AnonymiseChild();

            //AssignFutureAbsentees //settle Future dated absentees first
            //ReassignAbsentees
        }
    }
}
