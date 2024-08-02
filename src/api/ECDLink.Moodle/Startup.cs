using EcdLink.Moodle.Services;
using ECDLink.Core.Services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.Moodle
{
    public static class MoodleStartup
    {
        public static void ConfigureMoodleServices(IServiceCollection services, IConfiguration config)
        {
            services.AddTransient<ITrainingService, TrainingMoodleService>();
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

