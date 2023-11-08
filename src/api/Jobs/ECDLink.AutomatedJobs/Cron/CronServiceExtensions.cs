using Microsoft.Extensions.DependencyInjection;
using System;
using static ECDLink.AutomatedJobs.Configuration.AutomatedJobsSection;

namespace ECDLink.AutomatedJobs.Cron
{
    public static class CronServiceExtensions
    {
        public static IServiceCollection AddCronJob<T>(this IServiceCollection services, string name, string cronExpression, string timeZone, bool testMode)
            where T : CronJobService
        {
            var config = new ScheduleConfig<T>()
            {
                Name = name,
                CronExpression = cronExpression,
                TimeZoneInfo = timeZone.ToLower() == "utc" ? TimeZoneInfo.Utc : TimeZoneInfo.Local,
                TestMode  = testMode
            };

            if (string.IsNullOrWhiteSpace(config.CronExpression))
            {
                throw new ArgumentNullException(nameof(ScheduleConfig<T>.CronExpression), @"Empty Cron Expression is not allowed.");
            }
            Console.WriteLine("CronJobs: {0} Registered '{1}' TZ='{2}' [{3}]", config.Name, config.CronExpression, config.TimeZoneInfo.DisplayName, typeof(T).AssemblyQualifiedName);

            services.AddSingleton<IScheduleConfig<T>>(config);
            services.AddHostedService<T>();

            return services;
        }
    }
}
