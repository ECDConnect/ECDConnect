using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
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
    public class SendInvitationMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<bool> SendInviteToApplication(
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] InvitationNotificationManager notificationManager,
          [Service] UserManager<ApplicationUser> userManager,
          [Service] IHttpContextAccessor accessor,
          string userId,
          bool inviteToPortal = false)
        {
            var userToInvite = await userManager.FindByIdAsync(userId);

            if (userToInvite is default(ApplicationUser))
            {
                return false;
            }

            var token = await invitationManager.GenerateTokenAsync(userToInvite);

            if (string.IsNullOrWhiteSpace(token))
            {
                return false;
            }

            if (inviteToPortal)
            {
                var userToInviteIsAdmin = await userManager.IsInRoleAsync(userToInvite, Roles.ADMINISTRATOR);
                if (userToInviteIsAdmin)
                {
                    var currentUserId = accessor.HttpContext.GetUser().Id;
                    var currentUser = await userManager.FindByIdAsync(currentUserId.ToString());
                    var currentUserIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);
                    if (currentUserIsAdmin)
                        await notificationManager.SendAdminInvitationAsync(userToInvite, token);
                }
            }
            else
            {
                await notificationManager.SendInvitationAsync(userToInvite, token);
            }

            return true;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<BulkInvitationResult> SendBulkInviteToPortal(
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
            var guidUserIds = userIds.Select(x => Guid.Parse(x)).ToList();
            var invitedAdmins = adminUsers.Where(a => guidUserIds.Contains(a.Id));
            var currentUser = adminUsers.FirstOrDefault(u => u.Id == currentUserId);
            var currentUserIsAdmin = currentUser is not null;

            // Portal is for admins, so if there are no admins, no invitations can be sent
            // Only admins can send invitations to admins
            if (!currentUserIsAdmin || invitedAdmins?.Count() < 1)
                return result;

            // Add reqested users that aren't admins to failedInvitations
            result.Failed = guidUserIds.Except(invitedAdmins.Select(a => a.Id)).Select(x => x.ToString()).ToList();

            foreach (var invitedAdmin in invitedAdmins)
            {
                try
                {
                    var token = await invitationManager.GenerateTokenAsync(invitedAdmin);

                    if (string.IsNullOrWhiteSpace(token))
                    {
                        result.Failed.Add(invitedAdmin.Id.ToString());
                        continue;
                    }
                    await notificationManager.SendAdminInvitationAsync(invitedAdmin, token);
                    result.Success.Add(invitedAdmin.Id.ToString());
                }
                catch
                {
                    result.Failed.Add(invitedAdmin.Id.ToString());
                }
            }

            return result;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<BulkInvitationResult> SendBulkInviteToApp(
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] InvitationNotificationManager notificationManager,
          [Service] UserManager<ApplicationUser> userManager,
          [Service] IDbContextFactory<AuthenticationDbContext> dbContextFactory,
          [Service] IHttpContextAccessor accessor,
          IEnumerable<string> userIds)
        {
            // Create result
            var result = new BulkInvitationResult() { Failed = userIds.ToList(), Success = new List<string>() };

            // Get current and other admins
            var currentUserId = accessor.HttpContext.GetUser().Id;
            var currentUser = await userManager.FindByIdAsync(currentUserId.ToString());
            var currentUserIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);
            var guidUserIds = userIds.Select(x => Guid.Parse(x)).ToList();
            var inviteUsers = await userManager.Users.Where(u => guidUserIds.Contains(u.Id) && u.TenantId == TenantExecutionContext.Tenant.Id).ToListAsync();

            // Only admins can send invitations to admins
            if (!currentUserIsAdmin)
                return result;

            // Add reqested users that aren't in the list to failedInvitations
            result.Failed = guidUserIds.Except(inviteUsers.Select(u => u.Id)).Select(x => x.ToString()).ToList();

            foreach (var invitedUser in inviteUsers)
            {
                try
                {
                    var token = await invitationManager.GenerateTokenAsync(invitedUser);

                    if (string.IsNullOrWhiteSpace(token))
                    {
                        result.Failed.Add(invitedUser.Id.ToString());
                        continue;
                    }
                    await notificationManager.SendInvitationAsync(invitedUser, token);
                    result.Success.Add(invitedUser.Id.ToString());
                }
                catch
                {
                    result.Failed.Add(invitedUser.Id.ToString());
                }
            }

            return result;
        }
    }
}
