using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
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
          [Service] ApplicationUserManager userManager,
          string userId,
          bool inviteToPortal = false)
        {
            if (inviteToPortal)
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
            
                var userIsAdmin = await userManager.IsInRoleAsync(userToInvite, Roles.ADMINISTRATOR);
                var userIsTL = await userManager.IsInRoleAsync(userToInvite, RolesGG.TEAM_LEAD);
                var userIsHCW = await userManager.IsInRoleAsync(userToInvite, RolesGG.HEALTH_CARE_WORKER);
                if (userIsAdmin)
                {
                    await notificationManager.SendAdminInvitationAsync(userToInvite, token);
                } 
                else if (userIsTL)
                {
                    await notificationManager.SendTeamLeadInvitationAsync(userToInvite, token);
                }
                else if (userIsHCW)
                {
                    await notificationManager.SendInvitationAsync(userToInvite, token);
                }
                else
                {
                    await notificationManager.SendInvitationAsync(userToInvite, token);
                }
            }

            return inviteToPortal;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<BulkInvitationResult> SendBulkInviteToPortal(
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] InvitationNotificationManager notificationManager,
          [Service] ApplicationUserManager userManager,
          IEnumerable<string> userIds)
        {
            // Create result
            var result = new BulkInvitationResult() { Failed = new List<string>(), Success = new List<string>() };

            foreach (var userId in userIds)
            {
                try
                {
                    var userToInvite = await userManager.FindByIdAsync(userId);
                    if (userToInvite == null)
                    {
                        result.Failed.Add(userId);
                        continue;
                    }

                    var token = await invitationManager.GenerateTokenAsync(userToInvite);
                    if (string.IsNullOrWhiteSpace(token))
                    {
                        result.Failed.Add(userToInvite.Id.ToString());
                        continue;
                    }

                    var userIsAdmin = await userManager.IsInRoleAsync(userToInvite, Roles.ADMINISTRATOR);
                    var userIsTL = await userManager.IsInRoleAsync(userToInvite, RolesGG.TEAM_LEAD);
                    var userIsHCW = await userManager.IsInRoleAsync(userToInvite, RolesGG.HEALTH_CARE_WORKER);
                    if (userIsAdmin)
                    {
                        await notificationManager.SendAdminInvitationAsync(userToInvite, token);
                    }
                    else if (userIsTL)
                    {
                        await notificationManager.SendTeamLeadInvitationAsync(userToInvite, token);
                    }
                    else if (userIsHCW)
                    {
                        await notificationManager.SendInvitationAsync(userToInvite, token);
                    }
                    else
                    {
                        await notificationManager.SendInvitationAsync(userToInvite, token);
                    }

                    result.Success.Add(userToInvite.Id.ToString());
                }
                catch
                {
                    result.Failed.Add(userId);
                }
            }

            return result;
        }
    }
}
