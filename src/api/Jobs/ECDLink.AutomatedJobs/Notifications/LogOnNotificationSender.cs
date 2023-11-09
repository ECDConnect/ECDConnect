using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Notifications;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Notifications
{
    public class LogOnNotificationSender : CronJobService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public LogOnNotificationSender(IServiceScopeFactory scopeFactory, IScheduleConfig<LogOnNotificationSender> config)
            : base(config)
        {
            _scopeFactory = scopeFactory;
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                TenancyContext.SetTenantContext(scope);

                var dbContext = scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();
                var notificationProviderFactory = scope.ServiceProvider.GetRequiredService<INotificationProviderFactory<ApplicationUser>>();
                var options = scope.ServiceProvider.GetRequiredService<ISystemSetting<SecurityNotificationOptions>>();

                var notifications = dbContext.JobNotifications
                                        .Include(x => x.User)
                                        .ToList();

                var loginUrl = options.Value.Login;

                if (string.IsNullOrWhiteSpace(loginUrl))
                {
                    // log No login reference URL specified
                    return;
                }

                foreach (var notification in notifications)
                {
                    if (notification.UserLastSeen.Date != notification.User.LastSeen.Date)
                    {
                        // Dates don't match means user has logged in between saved data and today
                        continue;
                    }

                    var applicationName = TenantExecutionContext.Tenant.ApplicationName;
                    
                    var notificationProvider = notificationProviderFactory.Create(notification.User);

                    await notificationProvider
                        .SetMessageTemplate(notification.TemplateType)
                        .AddOrUpdateFieldReplacement(MessageTemplateConstants.LoginLink, loginUrl)
                        .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
                        .SendMessageAsync();

                    dbContext.JobNotifications.Remove(notification);
                    dbContext.SaveChanges();
                }
            }
        }
    }
}
