//using ECDLink.Abstractrions.Constants;
//using ECDLink.Abstractrions.Enums;
//using ECDLink.Abstractrions.Notifications;
//using ECDLink.AutomatedJobs.Cron;
//using ECDLink.Core.Extensions;
//using ECDLink.Core.Services.Interfaces;
//using ECDLink.Core.SystemSettings.SystemOptions;
//using ECDLink.DataAccessLayer.Context;
//using ECDLink.DataAccessLayer.Entities;
//using ECDLink.PostgresTenancy.Services;
//using ECDLink.SmartStart.Reports;
//using ECDLink.SmartStart.Reports.Models;
//using ECDLink.Tenancy.Context;
//using Microsoft.EntityFrameworkCore;

//namespace ECDConnect.WorkerService.Notifications;

//public class RequestAttendanceCaptureNotification : CronJobService
//{
//    private readonly IServiceScopeFactory _scopeFactory;

//    public RequestAttendanceCaptureNotification(IServiceScopeFactory scopeFactory, IScheduleConfig<RequestAttendanceCaptureNotification> config)
//            : base(config.CronExpression, config.TimeZoneInfo)
//    {
//        _scopeFactory = scopeFactory;
//    }

//    public override async Task DoWork(CancellationToken cancellationToken)
//    {
//        using (var scope = _scopeFactory.CreateScope())
//        {
//            SetTenantContext(scope);

//            var dbContext = scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();
//            var notificationProviderFactory = scope.ServiceProvider.GetRequiredService<INotificationProviderFactory<ApplicationUser>>();
//            var options = scope.ServiceProvider.GetRequiredService<ISystemSetting<SecurityNotificationOptions>>();
//            var reportService = scope.ServiceProvider.GetRequiredService<MonthlyAttendanceReport>();

//            var startOfWeek = DateTime.UtcNow.StartOfWeek(DayOfWeek.Monday);

//            var loginUrl = options.Value.Login;

//            if (string.IsNullOrWhiteSpace(loginUrl))
//            {
//                throw new Exception("No login reference URL specified");
//            }

//            var practitioners = dbContext.Practitioners
//                                                .Include(x => x.User)
//                                                .Where(x => x.IsActive)
//                                                .ToList();

//            foreach (var practitioner in practitioners)
//            {
//                var classrooms = dbContext.Classrooms
//                                            .Where(x => x.IsActive)
//                                            .Where(x => string.Equals(x.UserId, practitioner.UserId))
//                                            .ToList();

//                var reports = new List<MonthlyAttendanceReportModel>();

//                foreach (var classroom in classrooms)
//                {
//                    var report = reportService.GenerateMonthlyAttendanceReport(practitioner.UserId, classroom.Id, startOfWeek, DateTime.UtcNow).FirstOrDefault();

//                    if (report != default)
//                    {
//                        reports.Add(report);
//                    }
//                }

//                foreach (var report in reports)
//                {
//                    if (report.PercentageAttendance < 100)
//                    {
//                        var notificationProvider = notificationProviderFactory.Create(practitioner.User);

//                        var applicationName = TenantExecutionContext.Tenant.ApplicationName;
//                        var organisationName = TenantExecutionContext.Tenant.ApplicationName;
//                        string firstName = practitioner.User.FirstName;

//                        await notificationProvider
//                            .SetMessageTemplate(TemplateTypeEnum.AttendanceWeekly)
//                            .AddOrUpdateFieldReplacement(MessageTemplateConstants.LoginLink, loginUrl)
//                            .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
//                            .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
//                            .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
//                            .SendMessageAsync();
//                    }
//                }
//            }
//        }
//    }

//    // TODO: Convert to multi-tenancy jobs
//    //Single Tenant for now
//    private void SetTenantContext(IServiceScope scope)
//    {
//        var tenancyRepo = scope.ServiceProvider.GetRequiredService<TenantService>();

//        var tenant = tenancyRepo.GetAllTenants()
//            .Where(x => x.TenantType == ECDLink.Tenancy.Enums.TenantType.Tenant)
//            .OrderBy(x => x.Id)
//            .FirstOrDefault();

//        TenantExecutionContext.SetTenant(tenant);
//    }
//}
