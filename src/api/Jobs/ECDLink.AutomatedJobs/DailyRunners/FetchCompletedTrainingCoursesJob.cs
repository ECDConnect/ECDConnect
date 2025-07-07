using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.DailyRunners
{
    internal class FetchCompletedTrainingCoursesJob : CronJobService
    {
        public FetchCompletedTrainingCoursesJob(IServiceScopeFactory scopeFactory, CronJobConfig<FetchCompletedTrainingCoursesJob> config, ILogger<FetchCompletedTrainingCoursesJob> logger)
                : base(scopeFactory, config, logger)
        {
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            var service = GetRequiredService<ITrainingService>();
            await service.SyncCompletedCourses();
        }
    }
}
