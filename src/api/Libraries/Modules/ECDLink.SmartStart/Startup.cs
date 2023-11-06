using ECDLink.SmartStart.Reports;
using ECDLink.SmartStart.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.SmartStart
{
    public static class SmartStartStartup
    {
        public static void ConfigureSmartStartServices(IServiceCollection services, bool isDevelop = false)
        {
            services.AddTransient<MonthlyAttendanceReport>();
            services.AddTransient<ChildAttendanceReport>();
            services.AddTransient<ChildProgressReportService>();
        }

        public static void AddSmartStartConfiguration(IApplicationBuilder app, IWebHostEnvironment env)
        {
        }
    }
}
