using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.PostgresTenancy
{
    public static class PostgresTenancyStartup
    {
        public static void ConfigureDataAccessServices(IServiceCollection services, IConfiguration config, bool isDevelop = false)
        {
        }

        public static void AddDataAccessConfiguration(IApplicationBuilder app, IWebHostEnvironment env)
        {
        }
    }
}
