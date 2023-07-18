using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.Factories;
using ECDLink.Notifications.Smtp;
using ECDLink.Notifications.Templates;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.Notifications
{
    public static class NotificationsStartup
    {
        public static void ConfigureNotificationServices(IServiceCollection services, IConfiguration config)
        {
            services.AddTransient<INotificationProviderFactory<ApplicationUser>, NotificationProviderFactory>();
            services.AddTransient<IMessageFactory, MessageFactory>();
            services.AddTransient<BulkSms.SmsSender>();
            services.AddTransient<NoSms.SmsSender>();
            services.AddTransient<SMSPortal.SmsSender>();
            services.AddTransient<iTouch.SmsSender>();
            services.AddTransient<EmailSmtpSender>();

            services.AddTransient<TemplateFilters>();
            services.AddTransient<TemplateProcessor>();
        }

        public static void AddNotificationConfiguration(IApplicationBuilder app)
        {

        }
    }
}
