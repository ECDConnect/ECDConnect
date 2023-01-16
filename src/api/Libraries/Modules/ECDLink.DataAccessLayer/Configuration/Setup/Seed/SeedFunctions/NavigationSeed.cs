using ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.NavigationData;
using ECDLink.DataAccessLayer.Entities.Navigation;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedFunctions
{
    public class NavigationSeed
    {
        private readonly IServiceProvider serviceProvider;

        public NavigationSeed(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;

            SeedNavigation<Navigation>();
        }

        private void SeedNavigation<T>()
          where T : Navigation, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var dataset = NavigationSeed<T>.GetNavigations();

            foreach (var data in dataset)
            {
                repo.Insert(data);
            }
        }
    }
}
