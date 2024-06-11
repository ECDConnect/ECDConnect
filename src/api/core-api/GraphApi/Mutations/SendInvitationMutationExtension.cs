using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Managers;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;
using ECDLink.Security.Extensions;
using Microsoft.IdentityModel.Tokens;
using ECDLink.Security.Helpers;
using Newtonsoft.Json;
using Azure.Storage.Blobs.Models;
using static EcdLink.Api.CoreApi.Constants;
using ECDLink.Tenancy.Context;
using ECDLink.Abstractrions.Constants;
using System.Net.Http;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.Core.Helpers;
using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class SendInvitationMutationExtension
    {
       // [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<bool> SendInviteToApplication(
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] InvitationNotificationManager notificationManager,
          [Service] ApplicationUserManager userManager,
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
                var userIsAdmin = await userManager.IsInRoleAsync(userToInvite, Roles.ADMINISTRATOR);
                var userIsTL = await userManager.IsInRoleAsync(userToInvite, RolesGG.TEAM_LEAD);
                if (userIsAdmin)
                {
                    await notificationManager.SendAdminInvitationAsync(userToInvite, token);
                } 
                else if (userIsTL)
                {
                    await notificationManager.SendTeamLeadInvitationAsync(userToInvite, token);
                }
            } else
            {
                await notificationManager.SendInvitationAsync(userToInvite, token);
            }
            return true;
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

        public async Task<string> SendPractitionerInviteToPreSchool(
                 [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
                 [Service] InvitationNotificationManager notificationManager,
                 [Service] ApplicationUserManager userManager,
                 Guid userId,
                 string principalFirstName,
                 string preSchoolName)
        {
            if (string.IsNullOrEmpty(userId.ToString()))
            {
                throw new ArgumentException("UserId is empty");
            }
            if (string.IsNullOrEmpty(principalFirstName))
            {
                throw new ArgumentException("Principal first name is empty");
            }
            if (string.IsNullOrEmpty(preSchoolName))
            {
                throw new ArgumentException("Pre-school name is empty");
            }
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new QueryException("User not found");
            }

            var token = await invitationManager.GenerateTokenAsync(user);
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new QueryException("Token generation failed");
            }

            await notificationManager.SendPreSchoolInvitationAsync(user, principalFirstName, preSchoolName, token);

            return token;
        }

        public async Task<string> SendPrincipalInviteToApplication(
                [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
                [Service] InvitationNotificationManager notificationManager,
                [Service] ApplicationUserManager userManager,
                [Service] IHttpContextAccessor httpContext,
                string principalPhoneNumber,
                Guid practitionerUserId)
        {

            if (string.IsNullOrEmpty(principalPhoneNumber.ToString()))
            {
                throw new ArgumentException("Principal phone number is empty");
            }
            if (string.IsNullOrEmpty(practitionerUserId.ToString()))
            {
                throw new ArgumentException("Practitioner UserId is empty");
            }

            var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(principalPhoneNumber);
            var userId = httpContext.HttpContext.GetUser().Id;
            var tenantId = TenantExecutionContext.Tenant.Id;
            var user = new ApplicationUser
            {
                UserName = $"External_Edit_{Guid.NewGuid()}",
                IsActive = true,
                TenantId = tenantId,
                PhoneNumber = normalizePhoneNumber,
                ContactPreference = MessageTypeConstants.SMS
            };

            var userByPhoneNumber = userManager.Users.FirstOrDefault(user => user.PhoneNumber == normalizePhoneNumber
                                    && (user.TenantId == TenantExecutionContext.Tenant.Id || user.TenantId == null));

            if (userByPhoneNumber == null)
            {
                await userManager.CreateAsync(user);
                await userManager.AddToRoleAsync(user, "Principal");
            } else
            {
                user = userByPhoneNumber;
            }

            var tokenWrapper = new PrincipalTokenWrapperModel
            {
                AddedByUserId = userId,
                Token = await tokenManager.GenerateTokenAsync(user),
                PrincipalUserId = user.Id
            };

            var token = TokenHelper.EncodeToken(JsonConvert.SerializeObject(tokenWrapper));
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new QueryException("Token generation failed");
            }

            var practitioner = await userManager.FindByIdAsync(practitionerUserId);
            await notificationManager.SendPrincipalInvitationAsync(user, practitioner.FullName, token);

            return token;
        }
    }
}
