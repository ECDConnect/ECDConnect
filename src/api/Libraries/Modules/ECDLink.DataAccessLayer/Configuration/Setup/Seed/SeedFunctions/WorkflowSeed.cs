using ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Workflow;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedFunctions
{
    public class WorkflowSeed
    {
        private readonly IServiceProvider serviceProvider;

        public WorkflowSeed(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;

            SeedWorkflowStatusTypes<WorkflowStatusType>();

            SeedWorkflowStatuses<WorkflowStatus>();
        }

        private void SeedWorkflowStatuses<T>()
          where T : WorkflowStatus, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var dataset = WorkflowStatusSeed<T>.GetWorkflowStatuses();

            foreach (var data in dataset)
            {
                repo.Insert(data);
            }
        }

        private void SeedWorkflowStatusTypes<T>()
          where T : WorkflowStatusType, new()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var repo = repositoryFactory.CreateRepository<T>();

            var dataset = WorkflowStatusTypeSeed<T>.GetWorkflowStatuses();

            foreach (var data in dataset)
            {
                repo.Insert(data);
            }
        }
    }
}
