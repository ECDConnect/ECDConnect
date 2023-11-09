using ECDLink.AutomatedJobs.Configuration;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Notifications;
using ECDLink.Core.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECDLink.AutomatedJobs
{
    public static class AutomatedJobsStartup
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration config)
        {
            var automatedJobsSection = config.GetSection<AutomatedJobsSection>(AutomatedJobsSection.Name);
            if (automatedJobsSection.Enabled == 0)
            {
                Console.WriteLine("CronJobs: Disabled");
                return;
            }
            Console.WriteLine("CronJobs: Enabled [{0}]", automatedJobsSection.Jobs.Count);

            foreach (var job in automatedJobsSection.Jobs)
            {
                if (job.Enabled == 0) continue;
                Type jobType = Type.GetType(job.Type, false);
                if (jobType == null) 
                {
                    Console.WriteLine("CronJobs: {0} NOT Registered.  Unknown type {1}", job.Name, job.Type);
                    continue;
                }
                var addCronJobMethod = typeof(CronServiceExtensions).GetMethod("AddCronJob").MakeGenericMethod(jobType);
                addCronJobMethod.Invoke(null, new object[] { services, job.Name, job.Cron, job.TimeZone, job.Enabled >= 2 });
            }
        }
    }
}
