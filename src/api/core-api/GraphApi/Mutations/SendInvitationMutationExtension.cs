using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
                    var currentUser = await userManager.FindByIdAsync(currentUserId);
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
    }
}
