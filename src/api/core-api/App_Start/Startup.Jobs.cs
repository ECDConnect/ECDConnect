using ECDLink.AutomatedJobs.Anonymise;
using ECDLink.AutomatedJobs.Configuration;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.DailyRunners;
using ECDLink.AutomatedJobs.MonthlyRunners;
using ECDLink.AutomatedJobs.Notifications;
using ECDLink.Core.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace EcdLink.Api.CoreApi
{
    public partial class Startup
    {
        private void ConfigureJobs(IServiceCollection services)
        {
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
                c.CronExpression = CronTags.NinePmEverySaturday;
            });
            services.AddCronJob<IncomeStatementsAutoSubmit>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.EighthOfEveryMonth;
            });
            services.AddCronJob<RemovePractitioners>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.MidnightDaily;
            });

            //run all daily notification based checks in here
            services.AddCronJob<DailyNotificationChecks>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.MidnightDaily;
            });
        }
    }
}
