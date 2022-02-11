using ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedFunctions;
using ECDLink.DataAccessLayer.Configuration.Setup.Seed.TestSeedData;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed
{
    public class PostgresDataSeed
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IWebHostEnvironment _env;

        public PostgresDataSeed(IServiceProvider serviceProvider, IWebHostEnvironment env)
        {
            _serviceProvider = serviceProvider;
            _env = env;
        }

        public void Seed()
        {
            new AuthenticationSeed(_serviceProvider);

            new NotificationsSeed(_serviceProvider);

            new WorkflowSeed(_serviceProvider);

            new NavigationSeed(_serviceProvider);

            new StaticDataSeed(_serviceProvider);

            new DocumentTypeSeed(_serviceProvider);

            if (_env.IsDevelopment())
            {
                new TestSeed(_serviceProvider);
            } 
        }
    }
}
