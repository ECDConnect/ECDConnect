using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ECDLink.Moodle.Managers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ECDLink.Moodle
{
    public static class MoodleStartup
    {
        public static void ConfigureMoodleServices(IServiceCollection services, IConfiguration config)
        {
            services.AddTransient<MoodleManager>();
            services.AddControllers();
        }

        public static void AddMoodleConfiguration(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

