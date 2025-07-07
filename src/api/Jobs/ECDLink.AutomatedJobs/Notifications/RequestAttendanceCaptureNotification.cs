using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Notifications
{
    public class RequestAttendanceCaptureNotification : CronJobService
    {
        public RequestAttendanceCaptureNotification(IServiceScopeFactory scopeFactory, CronJobConfig<RequestAttendanceCaptureNotification> config, ILogger<RequestAttendanceCaptureNotification> logger)
            : base(scopeFactory, config, logger)
        {
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            var dbContext = Scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();
            var notificationProviderFactory = Scope.ServiceProvider.GetRequiredService<INotificationProviderFactory<ApplicationUser>>();
            var options = Scope.ServiceProvider.GetRequiredService<ISystemSetting<SecurityNotificationOptions>>();
            //var reportService = Scope.ServiceProvider.GetRequiredService<MonthlyAttendanceReport>();

            var startOfWeek = DateTime.UtcNow.StartOfWeek(DayOfWeek.Monday);

            var loginUrl = options.Value.Login;

            if (string.IsNullOrWhiteSpace(loginUrl))
            {
                throw new Exception("No login reference URL specified");
            }

            var practitioners = dbContext.Practitioners
                                                .Include(x => x.User)
                                                .Where(x => x.IsActive)
                                                .ToList();

            foreach (var practitioner in practitioners)
            {
                var classrooms = dbContext.Classrooms
                                            .Where(x => x.IsActive)
                                            .Where(x => x.UserId == practitioner.UserId)
                                            .ToList();

                //      var reports = new List<MonthlyAttendanceReportModel>();
                foreach (var classroom in classrooms)
                {
                    //     var report = reportService.GenerateMonthlyAttendanceReport(practitioner.UserId.ToString(), startOfWeek, DateTime.UtcNow).FirstOrDefault();

                    //    if (report != default)
                    //     {
                    //         reports.Add(report);
                    //    }
                }

                /*foreach (var report in reports)
                {
                    if (report.PercentageAttendance < 100)
                    {
                        var notificationProvider = notificationProviderFactory.Create(practitioner.User);
                            
                        var applicationName = TenantExecutionContext.Tenant.ApplicationName;
                        var organisationName = TenantExecutionContext.Tenant.ApplicationName;
                        string firstName = practitioner.User.FirstName;

                        await notificationProvider
                            .SetMessageTemplate(TemplateTypeEnum.AttendanceWeekly)
                            .AddOrUpdateFieldReplacement(MessageTemplateConstants.LoginLink, loginUrl)
                            .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
                            .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
                            .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
                            .SendMessageAsync();
                    }
                }*/
            }
        }
    }
}
