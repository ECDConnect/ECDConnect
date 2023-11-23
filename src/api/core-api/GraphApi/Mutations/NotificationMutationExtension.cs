using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Notifications.NoSms;
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

        public async Task<bool> ExpireNotification([Service] INotificationService notificationService, string notificationId)
        {
            return await notificationService.ExpireNotification(notificationId);
        }

        public async Task<bool> ExpireNotificationsTypesForUser([Service] INotificationService notificationService, string userId, string templateType)
        {
            return await notificationService.ExpireNotificationsTypesForUser(userId, templateType);
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
            [Service] RoleManager<ApplicationIdentityRole> roleManager,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager,
            IGenericRepositoryFactory repoFactory,
            MessageLogModel input)
        {

            var tenantId = TenantExecutionContext.Tenant.Id;
            AuthenticationDbContext context = dbContextFactory.CreateDbContext();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var franchisorRepo = repoFactory.CreateGenericRepository<Franchisor>(userContext: uId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var messageTemplateRepo = repoFactory.CreateGenericRepository<MessageTemplate>(userContext: uId);

            if (input.ToGroups == "")
            {
                return false;
            }

            var roles = roleManager.Roles.Where(x => input.ToGroups.Contains(x.Id) && (x.TenantId == null || x.TenantId == tenantId)).ToList();
            List<string> userIds = (from user in context.Users.Where(x => x.IsActive == true)
                                    join userRoles in context.UserRoles on user.Id equals userRoles.UserId
                                    join role in context.Roles.Where(x => input.ToGroups.Contains(x.Id)) on userRoles.RoleId equals role.Id
                                    select user.Id).ToList();

            List<string> messageUserIds = new List<string>();

            // Finding users for criteria
            if (input.ProvinceId != "" || input.WardName != "")
            {
                var practitionerCount = roles.Where(x => x.Name == Roles.PRACTITIONER).Count();
                var coachCount = roles.Where(x => x.Name == Roles.COACH).Count();
                var principalCount = roles.Where(x => x.Name == Roles.PRINCIPAL).Count();
                var franchisorCount = roles.Where(x => x.Name == Roles.FRANCHISOR).Count();

                if (practitionerCount > 0)
                {
                    if (input.ProvinceId != "" && input.WardName == "")
                    {
                        messageUserIds.AddRange(practitionerRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == input.ProvinceId)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (input.ProvinceId == "" && input.WardName != "")
                    {
                        messageUserIds.AddRange(practitionerRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(practitionerRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == input.ProvinceId && x.SiteAddress.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                }
                if (coachCount > 0)
                {
                    if (input.ProvinceId != "" && input.WardName == "")
                    {
                        messageUserIds.AddRange(coachRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == input.ProvinceId)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (input.ProvinceId == "" && input.WardName != "")
                    {
                        messageUserIds.AddRange(coachRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(coachRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == input.ProvinceId && x.SiteAddress.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                }
                if (principalCount > 0)
                {
                    if (input.ProvinceId != "" && input.WardName == "")
                    {
                        messageUserIds.AddRange(practitionerRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.IsPrincipal == true && x.SiteAddress.ProvinceId.ToString() == input.ProvinceId)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (input.ProvinceId == "" && input.WardName != "")
                    {
                        messageUserIds.AddRange(practitionerRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.IsPrincipal == true && x.SiteAddress.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(practitionerRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.IsPrincipal == true && x.SiteAddress.ProvinceId.ToString() == input.ProvinceId && x.SiteAddress.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                }
                if (franchisorCount > 0)
                {
                    if (input.ProvinceId != "" && input.WardName == "")
                    {
                        messageUserIds.AddRange(franchisorRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == input.ProvinceId)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (input.ProvinceId == "" && input.WardName != "")
                    {
                        messageUserIds.AddRange(franchisorRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.Ward == input.WardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(franchisorRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == input.ProvinceId && x.SiteAddress.Ward == input.WardName)
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
                MessageTemplate template = messageTemplateRepo.GetAll().Where(x => x.Protocol == "push" && x.TemplateType == "generic-message").FirstOrDefault();
                string toGroups = String.Join(",", roles.Select(x => x.Name).ToList());
                List<TagsReplacements> replacements = new List<TagsReplacements>();

                foreach (var userId in messageUserIds)
                {
                    var userToSend = await userManager.FindByIdAsync(userId);
                    await notificationService.SendGenericMessage(userId, toGroups, input.Message, input.Subject, input.MessageDate, template, null);
                }
            }

            return true;
                       
        }

    }
}
