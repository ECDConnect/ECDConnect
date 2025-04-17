using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Development.Holidays;
using ECDLink.Development.Notifications;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;

namespace ECDLink.Development
{
    public static class DevStartup
    {
        public static void ConfigureLocalDevServices(IServiceCollection services, IConfiguration config, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) {
                OverrideNotifications(services);
            }
            OverrideHolidayService(services);

        }

        private static void OverrideHolidayService(IServiceCollection services)
        {
            var holidayService = services.FirstOrDefault(x => x.ServiceType == typeof(IHolidayService<>));
            services.Remove(holidayService);

            services.AddScoped(typeof(IHolidayService<Holiday>), typeof(HolidayServiceOverride));
        }

        private static void OverrideNotifications(IServiceCollection services)
        {
            if (System.Environment.GetEnvironmentVariable("OVERRIDE_NOTIFICATIONS") == "1")
            {
                Console.WriteLine("Overriding notifications");
                var notificationFactory = services.FirstOrDefault(x => x.ServiceType == typeof(INotificationProviderFactory<ApplicationUser>));
                services.Remove(notificationFactory);

                services.AddTransient<INotificationProviderFactory<ApplicationUser>, DevNotificationProviderFactory>();
                services.AddTransient<INotificationProvider<ApplicationUser>, DevNotificationProvider>();
            }
        }

        public static void AddNotificationConfiguration(IApplicationBuilder app)
        {

        }
    }
}
