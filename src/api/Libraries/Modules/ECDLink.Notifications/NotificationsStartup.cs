using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.BulkSms;
using ECDLink.Notifications.Factories;
using ECDLink.Notifications.SendGrid;
using ECDLink.Notifications.Templates;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECDLink.Notifications
{
    public static class NotificationsStartup
    {
        public static void ConfigureNotificationServices(IServiceCollection services, IConfiguration config)
        {
            services.AddTransient<INotificationProviderFactory<ApplicationUser>, NotificationProviderFactory>();
            services.AddTransient<IMessageFactory, MessageFactory>();
            services.AddTransient<INotificationProvider<ApplicationUser>, SmsSender>();
            services.AddTransient<INotificationProvider<ApplicationUser>, EmailSender>();

            services.AddTransient<TemplateFilters>();
            services.AddTransient<TemplateProcessor>();
        }

        public static void AddNotificationConfiguration(IApplicationBuilder app)
        {

        }
    }
}
