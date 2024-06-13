using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.BulkSms;
using ECDLink.Notifications.Factories;
using ECDLink.Notifications.Managers;
using ECDLink.Notifications.MessageLogs;
using ECDLink.Notifications.Model;
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
            services.AddTransient<BulkSms.SmsSender>();
            services.AddTransient<NoSms.SmsSender>();
            services.AddTransient<SMSPortal.SmsSender>();
            services.AddTransient<iTouch.SmsSender>();
            services.AddTransient<EmailSmtpSender>();
            services.AddTransient<INotificationProviderFactory<ApplicationUser>, NotificationProviderFactory>();
            services.AddTransient<IMessageFactory, MessageFactory>();
            services.AddTransient<TemplateFilters>();
            services.AddTransient<TemplateProcessor>();
            services.AddTransient<IMessageLogger<BulkSmsMessage>, SmsMessageLogger>();
            services.AddTransient<IMessageLogger<IEmailMessage>, EmailMessageLogger>();
            services.AddTransient<MessageLogManager>();
        }

        public static void AddNotificationConfiguration(IApplicationBuilder app)
        {

        }
    }
}
