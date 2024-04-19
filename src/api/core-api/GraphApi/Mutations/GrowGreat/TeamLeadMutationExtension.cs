using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Clinics;
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
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class TeamLeadMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public PortalUserTLModel AddTeamLead(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            AddTeamLeadInputModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var teamLeadRepo = repoFactory.CreateRepository<TeamLead>(userContext: applicationUserId);

            var teamLead = teamLeadRepo.Insert(new TeamLead()
            {
                Id = input.UserId,
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId.ToString(),
                UserId = input.UserId,
                JobTitle = RolesGG.TEAM_LEAD
            });

            return new PortalUserTLModel(teamLead);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public TeamLead UpdateTeamLeadMessage(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            Guid teamLeadUserId,
            string welcomeMessage)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var teamLeadRepo = repoFactory.CreateRepository<TeamLead>(userContext: applicationUserId);

            var teamLead = teamLeadRepo.GetByUserId(teamLeadUserId);
            if (teamLead != null)
            {
                teamLead.WelcomeMessage = welcomeMessage;
                teamLead.UpdatedDate = DateTime.Now;
                teamLead.UpdatedBy = applicationUserId.ToString();
                return teamLeadRepo.Update(teamLead);
            }
            return null;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public async Task<ApplicationUser> SendTeamLeadVerifyPhoneNumberSMS(
            ApplicationUserManager userManager,
            [Service] SecurityNotificationManager securityNotificationManager,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] ILogger<UserMutationExtension> logger,
            Guid userId,
            string pendingPhoneNumber)
        {
            var user = await userManager.FindByIdAsync(userId);
            var userPhoneNumberBeforeChange = user.PhoneNumber;

            // save pending number to phone number
            user.PhoneNumber = UserHelper.NormalizePhoneNumber(replaceIfNotNullOrWhiteSpace(user.PhoneNumber, pendingPhoneNumber));
            user.PendingPhoneNumber = UserHelper.NormalizePhoneNumber(replaceIfNotNullOrWhiteSpace(user.PendingPhoneNumber, pendingPhoneNumber)); ;
            user.PhoneNumberConfirmed = false;
            var updatedUser = await userManager.UpdateAsync(user);

            try
            {
                if (updatedUser.Succeeded)
                {
                    // send sms
                    var apiUrl = new Uri("https://" + TenantExecutionContext.Tenant.AdminSiteAddress.ToString());
                    await securityNotificationManager.RequestVerifyCellphoneNumberAsync(user, apiUrl);
                }

                // revert phone number to old one
                user.PhoneNumber = userPhoneNumberBeforeChange;
                await userManager.UpdateAsync(user);
            }
            catch (Exception exception)
            {
                logger?.LogError("Could not send cellphone number verification for change of user cellphone number.", new { userId = userId, exception });
            }
            
            return user;
        }
        private static string replaceIfNotNullOrWhiteSpace(string original, string @new)
        {
            return string.IsNullOrWhiteSpace(@new) ? original : @new;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<PortalUserTLModel> DeactivateTeamLead(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            ApplicationUserManager userManager,
            Guid teamLeadId)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var teamLeadRepo = repoFactory.CreateRepository<TeamLead>(userContext: applicationUserId);
            var clinicTeamLeadRepo = repoFactory.CreateRepository<ClinicTeamLead>(userContext: applicationUserId);
            var auditInsertRepo = repoFactory.CreateRepository<IntegrationAudit>(userContext: applicationUserId);
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var teamLead = teamLeadRepo.GetById(teamLeadId);
            if (teamLead != null)
            {
                // Archive application user linked to this team lead
                var user = await userManager.FindByIdAsync(teamLead.UserId);
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

                // Archive clinic team lead records linked to this team lead
                var clinicTeamLeads = clinicTeamLeadRepo.GetAll().Where(x => x.TeamLeadId == teamLeadId).ToList();
                foreach (var item in clinicTeamLeads)
                {
                    item.IsActive = false;
                    item.UpdatedDate = DateTime.Now;
                    item.UpdatedBy = applicationUserId.ToString();
                    clinicTeamLeadRepo.Update(item);
                }

                // Archive team lead
                teamLead.IsActive = false;
                teamLead.UpdatedDate = DateTime.Now;
                teamLead.UpdatedBy = applicationUserId.ToString();
                var updatedRecord = teamLeadRepo.Update(teamLead);

                return new PortalUserTLModel(updatedRecord);
            }
            return null;
        }
    }
}
