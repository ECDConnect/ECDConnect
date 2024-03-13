using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class HealthCareWorkerMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public PortalUserHCWModel AddHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            AddHealthCareWorkerInputModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;

            var healthCareWorker = new HealthCareWorker()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId.ToString(),
                UserId = input.UserId,
                ClinicId = input.ClinicId,
                ClickedVisitTab = false,
                ClickedProgressTab = false,
                ClickedReferralsTab = false,
                ClickedContactTab = false,
                ClickedDashboardClientsTab = false,
                ClickedDashboardVisitsTab = false,
                ClickedDashboardHighlightsTab = false
            };

            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
            var newHealthCareWorker = healthCareWorkerRepo.Insert(healthCareWorker);

            return new PortalUserHCWModel(newHealthCareWorker);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public PortalUserHCWModel UpdateHealthCareWorkerClinic(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            Guid userId,
            Guid clinicId)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
            var healthCareWorkerToUpdate = healthCareWorkerRepo.GetByUserId(userId);

            healthCareWorkerToUpdate.ClinicId = clinicId;
            healthCareWorkerToUpdate.UpdatedDate = DateTime.Now;
            healthCareWorkerToUpdate.UpdatedBy = applicationUserId.ToString();

            var updatedHealthCareWorker = healthCareWorkerRepo.Update(healthCareWorkerToUpdate);
            return new PortalUserHCWModel(updatedHealthCareWorker);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<PortalUserHCWModel> DeactivateHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            ApplicationUserManager userManager,
            Guid hcwId)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var hcwRepo = repoFactory.CreateRepository<HealthCareWorker>(userContext: applicationUserId);
            var auditInsertRepo = repoFactory.CreateRepository<IntegrationAudit>(userContext: applicationUserId);
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var hcw = hcwRepo.GetById(hcwId);
            if (hcw != null)
            {
                // Archive application user linked to this hcw
                var user = await userManager.FindByIdAsync(hcw.UserId);
                user.LockoutEnabled = true;
                user.LockoutEnd = DateTime.MaxValue;
                user.IsActive = false;
                user.UpdatedDate = DateTime.UtcNow;
                await userManager.UpdateAsync(user);

                auditInsertRepo.Insert(new IntegrationAudit()
                {
                    ChangeType = "Delete",
                    Entity = "ApplicationUser",
                    Property = "IsActive",
                    ValueAfter = "false",
                    ValueBefore = "true",
                    UserId = applicationUserId,
                    RelatedId = user.Id.ToString(),
                    TenantId = tenantId
                });

                // Archive hcw
                hcw.IsActive = false;
                hcw.UpdatedDate = DateTime.Now;
                hcw.UpdatedBy = applicationUserId.ToString();
                var updatedRecord = hcwRepo.Update(hcw);

                return new PortalUserHCWModel(updatedRecord);
            }

            return null;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public HealthCareWorkerModel UpdateHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId,
            UpdateHealthCareWorkerInputModel input)
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

            var updatedHealthCareWorker = healthCareWorkerRepo.Update(healthCareWorkerToUpdate);

            return new HealthCareWorkerModel(updatedHealthCareWorker);
        }
                
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public HealthCareWorkerModel UpdateHealthCareWorkerTabs(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            UpdateHealthCareWorkerTabsInputModel input,
            string userId)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
            var healthCareWorkerToUpdate = healthCareWorkerRepo.GetById(new Guid(userId));

            if (input.ClickedVisitTab != null)
            {
                healthCareWorkerToUpdate.ClickedVisitTab = input.ClickedVisitTab.Value;
            }
            if (input.ClickedProgressTab != null)
            {
                healthCareWorkerToUpdate.ClickedProgressTab = input.ClickedProgressTab.Value;
            }
            if (input.ClickedReferralsTab != null)
            {
                healthCareWorkerToUpdate.ClickedReferralsTab = input.ClickedReferralsTab.Value;
            }
            if (input.ClickedContactTab != null)
            {
                healthCareWorkerToUpdate.ClickedContactTab = input.ClickedContactTab.Value;
            }
            if (input.ClickedDashboardClientsTab != null)
            {
                healthCareWorkerToUpdate.ClickedDashboardClientsTab = input.ClickedDashboardClientsTab.Value;
            }
            if (input.ClickedDashboardVisitsTab != null)
            {
                healthCareWorkerToUpdate.ClickedDashboardVisitsTab = input.ClickedDashboardVisitsTab.Value;
            }
            if (input.ClickedDashboardHighlightsTab != null)
            {
                healthCareWorkerToUpdate.ClickedDashboardHighlightsTab = input.ClickedDashboardHighlightsTab.Value;
            }

            var updatedHealthCareWorker = healthCareWorkerRepo.Update(healthCareWorkerToUpdate);

            return new HealthCareWorkerModel(updatedHealthCareWorker);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public HealthCareWorkerModel UpdateHealthCareWorkerWelcomeMessage(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            Guid healthcareWorkerId,
            string welcomeMessage,
            bool shareContactInfo)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: applicationUserId);
            var healthCareWorkerToUpdate = healthCareWorkerRepo.GetById(healthcareWorkerId);

            if (healthCareWorkerToUpdate == null)
            {
                throw new ArgumentException("Invalid healthCareWorkerId, HCW not found");
            }

            healthCareWorkerToUpdate.WelcomeMessage = welcomeMessage;
            healthCareWorkerToUpdate.IsNewAtClinic = false;
            healthCareWorkerToUpdate.ShareContactInfo = shareContactInfo;

            var updatedHealthCareWorker = healthCareWorkerRepo.Update(healthCareWorkerToUpdate);

            return new HealthCareWorkerModel(updatedHealthCareWorker);
        }
    }
}
