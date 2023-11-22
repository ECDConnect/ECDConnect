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
        private readonly IServiceScopeFactory _scopeFactory;

        public ChildAnonymiseJob(IServiceScopeFactory scopeFactory, IScheduleConfig<ChildAnonymiseJob> config, ILogger<ChildAnonymiseJob> logger)
            : base(config, logger)
        {
            _scopeFactory = scopeFactory;
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                TenancyContext.SetTenantContext(scope);

                var anonChildService = scope.ServiceProvider.GetRequiredService<IChildrenAnonymiseService>();

                anonChildService.AnonymiseChild();
            }
        }
    }
}
