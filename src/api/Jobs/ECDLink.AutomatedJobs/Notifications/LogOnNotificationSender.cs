using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Notifications;
using ECDLink.AutomatedJobs.Cron;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.AutomatedJobs.Notifications
{
    public class LogOnNotificationSender : CronJobService
    {
        public LogOnNotificationSender(IServiceScopeFactory scopeFactory, CronJobConfig<LogOnNotificationSender> config, ILogger<LogOnNotificationSender> logger)
            : base(scopeFactory, config, logger)
        {
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            var dbContext = Scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();
            var notificationProviderFactory = Scope.ServiceProvider.GetRequiredService<INotificationProviderFactory<ApplicationUser>>();
            var options = Scope.ServiceProvider.GetRequiredService<ISystemSetting<SecurityNotificationOptions>>();

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
