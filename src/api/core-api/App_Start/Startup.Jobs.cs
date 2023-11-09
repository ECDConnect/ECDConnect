using Microsoft.Extensions.DependencyInjection;

namespace EcdLink.Api.CoreApi
{
    public partial class Startup
    {
        private void ConfigureJobs(IServiceCollection services)
        {
            ECDLink.AutomatedJobs.AutomatedJobsStartup.ConfigureAutomatedJobs(services, Configuration);
        }
    }
}
