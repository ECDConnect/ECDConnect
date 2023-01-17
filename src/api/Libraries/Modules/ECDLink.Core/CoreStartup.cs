using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.Core.Models;
using ECDLink.Core.Services;
using ECDLink.Core.Services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.Core
{
    public static class CoreStartup
    {
        public static void ConfigureCoreServices(IServiceCollection services, IConfiguration configuration, bool isDevelop = false)
        {
            services.AddMemoryCache();
            services.AddTransient<ICacheService<IGlobalCache>, MemoryCacheWrapper>();

            services.AddTransient<IHolidayService<Holiday>, HolidayService>();
            services.AddTransient<IFileGenerationService, FileGenerationService>();
            services.AddTransient(typeof(ISystemSetting<>), typeof(SystemSetting<>));
            services.AddTransient<JsonFileService>();
        }

        public static void AddCoreConfiguration(IApplicationBuilder app)
        {
        }
    }
}
