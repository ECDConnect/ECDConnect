using ECDLink.Core.Extensions;
using ECDLink.PostgresTenancy.Configuration.Setup.Seed;
using ECDLink.PostgresTenancy.Context;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Repository;
using ECDLink.Tenancy;
using ECDLink.Tenancy.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.PostgresTenancy
{
    public static class PostgresTenancyStartup
    {
        public static void ConfigureDataAccessServices(IServiceCollection services, IConfiguration config, bool isDevelop = false)
        {
            services.AddTransient<PostgresTenantSeedService>();
            services.AddTransient<ITenancyRepository, TenantRepository>();

            var franchisor = config.GetSection<FranchisorConfiguration>(TenancyConstants.Configuration.TenantSettings);

            services.AddDbContext<PostgresTenancyContext>(options =>
            {
                options.UseNpgsql(franchisor.ConnectionString, b => b.MigrationsAssembly("ECDLink.PostgresTenancy"));
            });

            services.AddIdentityCore<TenancyIdentityUser>()
                .AddEntityFrameworkStores<PostgresTenancyContext>();
        }

        public static void AddDataAccessConfiguration(IApplicationBuilder app, IWebHostEnvironment env)
        {

        }
    }
}
