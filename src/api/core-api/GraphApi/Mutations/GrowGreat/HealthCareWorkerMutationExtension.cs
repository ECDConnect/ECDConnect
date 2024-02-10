using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
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

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat {
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class HealthCareWorkerMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public HealthCareWorker AddHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HealthCareWorkerModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;

            var healthCareWorker = new HealthCareWorker()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId.ToString(),
                UserId = Guid.Parse(input.UserId),
                LanguageId = input.LanguageId,
                TeamLeadId = input.TeamLeadId,
                ClickedVisitTab = false,
                ClickedProgressTab = false,
                ClickedReferralsTab = false,
                ClickedContactTab = false,
                ClickedDashboardClientsTab = false,
                ClickedDashboardVisitsTab = false,
                ClickedDashboardHighlightsTab = false
            };

            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
            return healthCareWorkerRepo.Insert(healthCareWorker);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public HealthCareWorker UpdateHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId,
            HealthCareWorkerModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
            var healthCareWorkerToUpdate = healthCareWorkerRepo.GetByUserId(userId);

            if (input.IsRegistered)
            {
                healthCareWorkerToUpdate.IsRegistered = input.IsRegistered;
            }

            if (input.LanguageId != null)
            {
                healthCareWorkerToUpdate.LanguageId = input.LanguageId;
            }

            if (input.TeamLeadId != null)
            {
                healthCareWorkerToUpdate.TeamLeadId = input.TeamLeadId;
            }

            if (input.User?.PhoneNumber != null)
            {
                healthCareWorkerToUpdate.User.PhoneNumber = input.User.PhoneNumber;
            }

            if (input.User?.Email != null)
            {
                healthCareWorkerToUpdate.User.Email = input.User.Email;
            }

            return healthCareWorkerRepo.Update(healthCareWorkerToUpdate);
        }


        
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public HealthCareWorker UpdateHealthCareWorkerTabs(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HealthCareWorkerModel input,
            string userId)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
            var healthCareWorkerToUpdate = healthCareWorkerRepo.GetById(new Guid(userId));

            if (input.ClickedVisitTab != null)
            {
                healthCareWorkerToUpdate.ClickedVisitTab = input.ClickedVisitTab;
            }
            if (input.ClickedProgressTab != null)
            {
                healthCareWorkerToUpdate.ClickedProgressTab = input.ClickedProgressTab;
            }
            if (input.ClickedReferralsTab != null)
            {
                healthCareWorkerToUpdate.ClickedReferralsTab = input.ClickedReferralsTab;
            }
            if (input.ClickedContactTab != null)
            {
                healthCareWorkerToUpdate.ClickedContactTab = input.ClickedContactTab;
            }
            if (input.ClickedDashboardClientsTab != null)
            {
                healthCareWorkerToUpdate.ClickedDashboardClientsTab = input.ClickedDashboardClientsTab;
            }
            if (input.ClickedDashboardVisitsTab != null)
            {
                healthCareWorkerToUpdate.ClickedDashboardVisitsTab = input.ClickedDashboardVisitsTab;
            }
            if (input.ClickedDashboardHighlightsTab != null)
            {
                healthCareWorkerToUpdate.ClickedDashboardHighlightsTab = input.ClickedDashboardHighlightsTab;
            }

            return healthCareWorkerRepo.Update(healthCareWorkerToUpdate);
        }
    }
}
