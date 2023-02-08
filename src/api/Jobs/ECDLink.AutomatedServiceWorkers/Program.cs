using ECDLink.AutomatedServiceWorkers.Anonymise;
using ECDLink.AutomatedServiceWorkers.ExpireInvitations;
using ECDLink.AutomatedServiceWorkers.Assignments;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ECDLink.AutomatedServiceWorkers
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<ExpireInvitationsJob>();
                    services.AddHostedService<ChildAnonymiseJob>();
                    services.AddHostedService<ReassignFutureDatedJob>();
                    services.AddHostedService<RevertReassignmentJob>();


                });

    }
}
