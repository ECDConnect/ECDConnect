using ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Notifications;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedFunctions
{
    public class NotificationsSeed
    {
        private readonly IServiceProvider serviceProvider;

        public NotificationsSeed(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;

            SeedTemplates<MessageTemplate>();
        }

        private void SeedTemplates<T>()
          where T : MessageTemplate, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var messages = SeedMessageTemplates<T>.GetMessageTemplates();

            foreach (var template in messages)
            {
                repo.Insert(template);
            }
        }
    }
}
