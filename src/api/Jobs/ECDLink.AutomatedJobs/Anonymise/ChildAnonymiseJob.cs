using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Anonymise
{
    public class ChildAnonymiseJob : CronJobService
    {
        public ChildAnonymiseJob(IServiceScopeFactory scopeFactory, CronJobConfig<ChildAnonymiseJob> config, ILogger<ChildAnonymiseJob> logger)
            : base(scopeFactory, config, logger)
        {
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            var anonChildService = Scope.ServiceProvider.GetRequiredService<IChildrenAnonymiseService>();
            anonChildService.AnonymiseChild();
        }
    }
}
