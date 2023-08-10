using ECDLink.AutomatedJobs.Anonymise;
using ECDLink.AutomatedJobs.Configuration;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.DailyRunners;
using ECDLink.AutomatedJobs.Notifications;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace EcdLink.Api.CoreApi
{
    public partial class Startup
    {
        private void ConfigureJobs(IServiceCollection services)
        {
            if (Environment.IsProduction())
            {
                //Hard - coded times for now, consider using ISystemSettings and move the cron expressions to DB
                services.AddCronJob<RequestLogOnNotification>(c =>
                {
                    c.TimeZoneInfo = TimeZoneInfo.Local;
                    c.CronExpression = CronTags.MidnightDaily;
                });

                services.AddCronJob<LogOnNotificationSender>(c =>
                {
                    c.TimeZoneInfo = TimeZoneInfo.Local;
                    c.CronExpression = CronTags.NineAmWeekDaily;
                });

                services.AddCronJob<RequestAttendanceCaptureNotification>(c =>
                {
                    c.TimeZoneInfo = TimeZoneInfo.Local;
                    c.CronExpression = CronTags.FourPmEveryFriday;
                });
            }
            //run these jobs regardless of environment
            services.AddCronJob<ChildAnonymiseJob>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.MidnightDaily;
            });
            services.AddCronJob<ExpireInvitations>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.MidnightDaily;
            });
            services.AddCronJob<IntegrationChanges>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.EveryTwentyMinutes;
            });
            services.AddCronJob<AttendanceWeekly>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.NinePmEveryFriday;
            });
        }
    }
}
