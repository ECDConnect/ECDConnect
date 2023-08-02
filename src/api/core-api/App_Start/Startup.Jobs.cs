using ECDLink.AutomatedJobs.Anonymise;
using ECDLink.AutomatedJobs.Configuration;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.DailyRunners;
using ECDLink.AutomatedJobs.MonthlyRunners;
using ECDLink.AutomatedJobs.Notifications;
using ECDLink.AutomatedJobs.Services.Interfaces;
using ECDLink.AutomatedJobs.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace EcdLink.Api.CoreApi
{
    public partial class Startup
    {
        private void ConfigureJobs(IServiceCollection services)
        {
            services.AddTransient<ISchedulerService, SchedulerService>();

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

                services.AddCronJob<ChildAnonymiseJob>(c =>
                {
                    c.TimeZoneInfo = TimeZoneInfo.Local;
                    c.CronExpression = CronTags.MidnightDaily;
                });

            }
            //run these jobs regardless of environment
            services.AddCronJob<ExpireInvitations>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.EveryFiveMinutes;
            });
            services.AddCronJob<RevertReassignment>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.EveryTenMinutes;
            });
            //services.AddCronJob<PQAsClubsVisitsLicensesRegisters>(c =>
            //{
            //    c.TimeZoneInfo = TimeZoneInfo.Local;
            //    c.CronExpression = CronTags.MidnightDaily;
            //});
            //services.AddCronJob<IntegrationTraineesPractitioners>(c =>
            //{
            //    c.TimeZoneInfo = TimeZoneInfo.Local;
            //    c.CronExpression = CronTags.MidnightDaily;
            //});
            //services.AddCronJob<RevertReassignment>(c =>
            //{
            //    c.TimeZoneInfo = TimeZoneInfo.Local;
            //    c.CronExpression = CronTags.MidnightDaily;
            //});
            services.AddCronJob<IntegrationChanges>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                c.CronExpression = CronTags.EveryTenMinutes;
            });
            //services.AddCronJob<IntegrationWeeklyAttendance>(c =>
            //{
            //    c.TimeZoneInfo = TimeZoneInfo.Local;
            //    c.CronExpression = CronTags.EverySaturday;
            //});
            //services.AddCronJob<IntegrationMontlyAttendance>(c =>
            //{
            //    c.TimeZoneInfo = TimeZoneInfo.Local;
            //    c.CronExpression = CronTags.FirstDayOfMonth;
            //});

            //services.AddCronJob<IncomeStatementSubmit>(c =>
            //{
            //    c.TimeZoneInfo = TimeZoneInfo.Local;
            //    c.CronExpression = CronTags.EveryFiveMinutes;
            //});

            //services.AddCronJob<IncomeStatementsAutoSubmit>(c =>
            //{
            //    c.TimeZoneInfo = TimeZoneInfo.Local;
            //    c.CronExpression = CronTags.NineAmWeekDaily;
            //});

        }
    }
}
