using AngleSharp.Text;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class NotificationMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<bool> SendNotificationToUser(
          [Service] UserManager<ApplicationUser> userManager,
          [Service] INotificationService notificationService,
          string userType,
          string templateType, string userId = null, DateTime? startDate = null, DateTime? endDate = null)
        {
            if (startDate == null)
                startDate = DateTime.Now;
            if (userId != null)
            {
                var userToSend = await userManager.FindByIdAsync(userId);
                return await notificationService.SendNotificationAsync(userType, templateType, (DateTime)startDate, userToSend);
            }
            else
            {
                return await notificationService.SendNotificationAsync(userType, templateType, (DateTime)startDate);
            }
        }

        public async Task<bool> DisableNotification([Service] INotificationService notificationService, string notificationId)
        {
            return await notificationService.DisableNotification(notificationId);
        }

        public async Task<bool> MarkAsReadNotification([Service] INotificationService notificationService, string notificationId)
        {
            return await notificationService.MarkAsReadNotification(notificationId);
        }
        public async Task<bool> ExpireNotification([Service] INotificationService notificationService, string notificationId)
        {
            return await notificationService.ExpireNotification(notificationId);
        }

        public async Task<bool> ExpireNotificationsTypesForUser([Service] INotificationService notificationService, string userId, string templateType, string searchCriteria = null)
        {
            return await notificationService.ExpireNotificationsTypesForUser(userId, templateType, searchCriteria);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<BulkInvitationResult> SendNotificationToUser(
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] InvitationNotificationManager notificationManager,
          [Service] UserManager<ApplicationUser> userManager,
          [Service] IHttpContextAccessor accessor,
          IEnumerable<string> userIds)
        {
            // Create result
            var result = new BulkInvitationResult() { Failed = userIds.ToList(), Success = new List<string>() };

            // Get current and other admins
            var currentUserId = accessor.HttpContext.GetUser().Id;
            var adminUsers = await userManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR);
            var admins = adminUsers?.Select(u => u.Id);
            var invitedAdmins = adminUsers.Where(a => userIds.Contains(a.Id));
            var currentUser = adminUsers.FirstOrDefault(u => u.Id == currentUserId);
            var currentUserIsAdmin = currentUser is not null;

            // Portal is for admins, so if there are no admins, no invitations can be sent
            // Only admins can send invitations to admins
            if (!currentUserIsAdmin || invitedAdmins?.Count() < 1)
                return result;

            // Add reqested users that aren't admins to failedInvitations
            result.Failed = userIds.Except(invitedAdmins.Select(a => a.Id)).ToList();

            foreach (var invitedAdmin in invitedAdmins)
            {
                try
                {
                    var token = await invitationManager.GenerateTokenAsync(invitedAdmin);

                    if (string.IsNullOrWhiteSpace(token))
                    {
                        result.Failed.Add(invitedAdmin.Id);
                        continue;
                    }
                    await notificationManager.SendAdminInvitationAsync(invitedAdmin, token);
                    result.Success.Add(invitedAdmin.Id);
                }
                catch
                {
                    result.Failed.Add(invitedAdmin.Id);
                }
            }

            return result;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<BulkInvitationResult> SendBulkInviteToApp(
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] InvitationNotificationManager notificationManager,
          [Service] UserManager<ApplicationUser> userManager,
          [Service] IHttpContextAccessor accessor,
          IEnumerable<string> userIds)
        {
            // Create result
            var result = new BulkInvitationResult() { Failed = userIds.ToList(), Success = new List<string>() };

            // Get current and other admins
            var currentUserId = accessor.HttpContext.GetUser()?.Id;
            var currentUser = await userManager.FindByIdAsync(currentUserId);
            var currentUserIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);

            var inviteUsers = await userManager.Users.Where(u => userIds.Contains(u.Id) && u.TenantId == TenantExecutionContext.Tenant.Id).ToListAsync();

            // Only admins can send invitations to admins
            if (!currentUserIsAdmin)
                return result;

            // Add reqested users that aren't in the list to failedInvitations
            result.Failed = userIds.Except(inviteUsers.Select(u => u.Id)).ToList();

            foreach (var invitedUser in inviteUsers)
            {
                try
                {
                    var token = await invitationManager.GenerateTokenAsync(invitedUser);

                    if (string.IsNullOrWhiteSpace(token))
                    {
                        result.Failed.Add(invitedUser.Id);
                        continue;
                    }
                    await notificationManager.SendInvitationAsync(invitedUser, token);
                    result.Success.Add(invitedUser.Id);
                }
                catch
                {
                    result.Failed.Add(invitedUser.Id);
                }
            }

            return result;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<bool> SaveBulkMessagesForAdmin(
            [Service] IDbContextFactory<AuthenticationDbContext> dbContextFactory,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager,
            IGenericRepositoryFactory repoFactory,
            MessageLogModel input)
        {
            AuthenticationDbContext context = dbContextFactory.CreateDbContext();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var teamLeadRepo = repoFactory.CreateGenericRepository<TeamLead>(userContext: uId);
            var hcwRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            var messageTemplateRepo = repoFactory.CreateGenericRepository<MessageTemplate>(userContext: uId);
            var messageLogRepo = repoFactory.CreateGenericRepository<MessageLog>(userContext: uId);

            if (input.RoleIds.Count == 0)
            {
                return false;
            }

            List<string> userIds = new List<string>();
            List<Practitioner> practitioners = new List<Practitioner>();
            List<Coach> coaches = new List<Coach>();
            List<string> messageUserIds = new List<string>();

            var isTrainee = input.RoleIds.FindIndex(x => x == "trainees") != -1;
            var isPrincipal = input.RoleIds.FindIndex(x => x == "practitioners_principals") != -1;
            var isNonPractitioner = input.RoleIds.FindIndex(x => x == "practitioners_non_principals") != -1;
            var isCoach = input.RoleIds.FindIndex(x => x == "coaches") != -1;
            var isCHW = input.RoleIds.FindIndex(x => x == "chw") != -1;
            var isTeamLead = input.RoleIds.FindIndex(x => x == "team_lead") != -1;

            if (isTrainee || isPrincipal || isNonPractitioner)
            {
                practitioners = practitionerRepo.GetAll().Where(x => x.IsActive == true).ToList();
            }

            // SS roles
            if (isTrainee)
            {
                userIds.AddRange(practitioners.Where(x => x.IsActive == true && x.IsTrainee == true).Select(x => x.UserId).Distinct().ToList());
            }
            if (isPrincipal)
            {
                userIds.AddRange(practitioners.Where(x => x.IsActive == true && (x.IsPrincipal == true || x.IsFundaAppAdmin == true)).Select(x => x.UserId).Distinct().ToList());
            }
            if (isNonPractitioner)
            {
                userIds.AddRange(practitioners.Where(x => x.IsActive == true && (x.IsPrincipal == false && x.IsFundaAppAdmin == false)).Select(x => x.UserId).Distinct().ToList());
            }
            if (isCoach)
            {
                coaches = coachRepo.GetAll().Where(x => x.IsActive == true).ToList();
                userIds.AddRange(coaches.Select(x => x.UserId).Distinct().ToList());
            }
            // GG roles
            if (isCHW)
            {
                userIds.AddRange(hcwRepo.GetAll().Where(x => x.IsActive == true).Select(x => x.UserId).Distinct().ToList());
            }
            if (isTeamLead)
            {
                userIds.AddRange(teamLeadRepo.GetAll().Where(x => x.IsActive == true).Select(x => x.UserId).Distinct().ToList());
            }

            // Finding users for criteria
            if (input.ProvinceId != "" || input.WardName != "")
            {

                if (isTrainee || isPrincipal || isNonPractitioner)
                {
                    if (input.ProvinceId != "" && input.WardName == "")
                    {
                        messageUserIds.AddRange(practitioners
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.ProvinceId.ToString() == input.ProvinceId)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (input.ProvinceId == "" && input.WardName != "")
                    {
                        messageUserIds.AddRange(practitioners
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(practitioners
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.ProvinceId.ToString() == input.ProvinceId && x.SiteAddress?.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                }
                if (isCoach)
                {
                    if (input.ProvinceId != "" && input.WardName == "")
                    {
                        messageUserIds.AddRange(coaches
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.ProvinceId.ToString() == input.ProvinceId)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (input.ProvinceId == "" && input.WardName != "")
                    {
                        messageUserIds.AddRange(coaches
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(coaches
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.ProvinceId.ToString() == input.ProvinceId && x.SiteAddress?.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                }
                
            } else
            {
                messageUserIds = userIds;
            }

            if (messageUserIds.Count > 0)
            {
                MessageTemplate template = messageTemplateRepo.GetAll().Where(x => x.Protocol == "push" && x.TemplateType == "generic-message" && x.IsActive).FirstOrDefault();
                List<TagsReplacements> replacements = new List<TagsReplacements>();

                if (input.IsEdit)
                {
                    // first delete current records for edit functionality and then create again.
                    foreach (var logId in input.MessageLogIds)
                    {
                        messageLogRepo.Delete(logId);
                    }
                }
                var timeItems = input.MessageTime.Split(":");
                int hour = Int32.Parse(timeItems[0]);
                int minutes = Int32.Parse(timeItems[1]);
                var timeSpan = new TimeSpan(hour, minutes, 0);
                DateTime messageDate = new DateTime(input.MessageDate.Year, input.MessageDate.Month, input.MessageDate.Day).Add(timeSpan);
                foreach (var userId in messageUserIds)
                {
                    var userToSend = await userManager.FindByIdAsync(userId);
                    await notificationService.SendGenericMessage(userId, input.ToGroups, input.Message, input.Subject, messageDate, template, null);
                }
            }
            return true;
                       
        }

    }
}
