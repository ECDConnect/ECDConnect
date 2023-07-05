//using ECDLink.Abstractrions.Constants;
//using ECDLink.Abstractrions.Notifications;
//using ECDLink.AutomatedJobs.Cron;
//using ECDLink.Core.Services.Interfaces;
//using ECDLink.Core.SystemSettings.SystemOptions;
//using ECDLink.DataAccessLayer.Context;
//using ECDLink.DataAccessLayer.Entities;
//using ECDLink.PostgresTenancy.Services;
//using ECDLink.Tenancy.Context;
//using Microsoft.EntityFrameworkCore;

//namespace ECDConnect.WorkerService.Notifications;

//public class LogOnNotificationSender : CronJobService
//{
//    private readonly IServiceScopeFactory _scopeFactory;

//    public LogOnNotificationSender(IServiceScopeFactory scopeFactory, IScheduleConfig<LogOnNotificationSender> config)
//        : base(config.CronExpression, config.TimeZoneInfo)
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

//            var notifications = dbContext.JobNotifications
//                                    .Include(x => x.User)
//                                    .ToList();

//            var loginUrl = options.Value.Login;

//            if (string.IsNullOrWhiteSpace(loginUrl))
//            {
//                // log No login reference URL specified
//                return;
//            }

//            foreach (var notification in notifications)
//            {
//                if (notification.UserLastSeen.Date != notification.User.LastSeen.Date)
//                {
//                    // Dates don't match means user has logged in between saved data and today
//                    continue;
//                }

//                var notificationProvider = notificationProviderFactory.Create(notification.User);

//                var applicationName = TenantExecutionContext.Tenant.ApplicationName;
//                var organisationName = TenantExecutionContext.Tenant.ApplicationName;
//                string firstName = notification.User.FirstName;

//                await notificationProvider
//                    .SetMessageTemplate(notification.TemplateType)
//                    // TODO: Make a standard set of replacements with functions
//                    .AddOrUpdateFieldReplacement(MessageTemplateConstants.LoginLink, loginUrl)
//                    .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
//                    .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
//                    .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
//                    .SendMessageAsync();

//                dbContext.JobNotifications.Remove(notification);
//                dbContext.SaveChanges();
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
