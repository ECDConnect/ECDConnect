using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class HealthCareWorkerMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public HealthCareWorker AddHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            HealthCareWorkerModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;       

            var healthCareWorker = new HealthCareWorker()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId,
                UserId = input.UserId,
                LanguageId = input.LangaugeId,
                SiteAddress = input.SiteAddress,
                TeamLeadId = input.TeamLeadId
            };

            var healthCareWorkerRepo = repoFactory.CreateRepository<HealthCareWorker>(userContext: applicationUserId);
            return healthCareWorkerRepo.Insert(healthCareWorker);

        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public HealthCareWorker UpdateHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string id,
            HealthCareWorkerModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateRepository<HealthCareWorker>(userContext: applicationUserId);
            var healthCareWorkerToUpdate = healthCareWorkerRepo.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).FirstOrDefault();

            healthCareWorkerToUpdate.UpdatedDate = DateTime.Now;
            healthCareWorkerToUpdate.UpdatedBy = applicationUserId;
            healthCareWorkerToUpdate.LanguageId = input.LangaugeId;
            healthCareWorkerToUpdate.SiteAddress = input.SiteAddress;
            healthCareWorkerToUpdate.TeamLeadId = input.TeamLeadId;

            return healthCareWorkerRepo.Update(healthCareWorkerToUpdate);
        }
    }
}
