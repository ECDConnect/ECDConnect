using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Development.Holidays;
using ECDLink.Development.Notifications;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace ECDLink.Development
{
    public static class DevStartup
    {
        public static void ConfigureLocalDevServices(IServiceCollection services, IConfiguration config)
        {
            OverrideHolidayService(services);

        }

        private static void OverrideHolidayService(IServiceCollection services)
        {
            var holidayService = services.FirstOrDefault(x => x.ServiceType == typeof(IHolidayService<>));
            services.Remove(holidayService);

            services.AddTransient(typeof(IHolidayService<Holiday>), typeof(HolidayServiceOverride));
        }

        public static void AddNotificationConfiguration(IApplicationBuilder app)
        {

        }
    }
}
