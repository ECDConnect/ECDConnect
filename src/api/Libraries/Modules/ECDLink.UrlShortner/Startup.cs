using ECDLink.UrlShortner.Managers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.UrlShortner
{
    public static class UrlShortnerStartup
    {

        // This method gets called by the runtime. Use this method to add services to the container.
        public static void ConfigureUrlShortnerServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<ShortUrlManager>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public static void ConfigureUrlShortner(IApplicationBuilder app, IWebHostEnvironment env)
        {

        }
    }
}
