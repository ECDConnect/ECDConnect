using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Helpers;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class SendInvitationMutationExtension
    {
        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Create)]
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
                var userIsAdmin = await userManager.IsInRoleAsync(userToInvite, Roles.ADMINISTRATOR) || await userManager.IsInRoleAsync(userToInvite, Roles.SUPER_ADMINISTRATOR);
                if (userIsAdmin)
                {
                    await notificationManager.SendAdminInvitationAsync(userToInvite, token);
                } 
                else 
                {
                    await notificationManager.SendInvitationAsync(userToInvite, token);
                }
            } else
            {
                await notificationManager.SendInvitationAsync(userToInvite, token);
            }
            return true;
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Create)]
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

                    var userIsAdmin = await userManager.IsInRoleAsync(userToInvite, Roles.ADMINISTRATOR) || await userManager.IsInRoleAsync(userToInvite, Roles.SUPER_ADMINISTRATOR);

                    if (userToInvite == null)
                    {
                        result.Failed.Add($"{userId} : user not found for id");
                        continue;
                    }
                    if (userToInvite != null && string.IsNullOrWhiteSpace(userToInvite.PhoneNumber) && !userIsAdmin)
                    {
                        result.Failed.Add($"{userId} : phone number not found for id");
                        continue;
                    }
                    if (userToInvite != null && string.IsNullOrWhiteSpace(userToInvite.Email) && userIsAdmin)
                    {
                        result.Failed.Add($"{userId} : email not found for id");
                        continue;
                    }
                    var token = await invitationManager.GenerateTokenAsync(userToInvite);
                    if (string.IsNullOrWhiteSpace(token))
                    {
                        result.Failed.Add($"{userToInvite.Id} : token failure");
                        continue;
                    }
                    
                    if (userIsAdmin)
                    {
                        await notificationManager.SendAdminInvitationAsync(userToInvite, token);
                    }
                    else 
                    {
                        await notificationManager.SendInvitationAsync(userToInvite, token);
                    }
                    
                    await Task.Delay(1000);
                    result.Success.Add(userToInvite.Id.ToString());
                }
                catch
                {
                    result.Failed.Add($"{userId} : failure on sending invitation");
                }
            }

            return result;
        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Create)]
        public async Task<string> SendPractitionerInviteToPreSchool(
                [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
                [Service] InvitationNotificationManager notificationManager,
                [Service] ApplicationUserManager userManager,
                [Service] InvitationManager inviteManager,
                [Service] IHttpContextAccessor httpContext,
                IGenericRepositoryFactory repoFactory,
                 string practitionerPhoneNumber,
                 string preSchoolNameCode,
                 string preSchoolName,
                 Guid principalUserId,
                 string? idOrPassport)
        {
            if (string.IsNullOrEmpty(practitionerPhoneNumber))
            {
                throw new ArgumentException("Practitioner phone number is empty");
            }
            if (string.IsNullOrEmpty(principalUserId.ToString()))
            {
                throw new ArgumentException("Principal UserId is empty");
            }
            if (string.IsNullOrEmpty(preSchoolName))
            {
                throw new ArgumentException("Preschool name is empty");
            }

            var principal = await userManager.FindByIdAsync(principalUserId);
            if (principal == null)
            {
                throw new ArgumentException("Principal with id not available in application");
            }

            var callerUserId = httpContext.HttpContext.GetUser().Id;
            var principalPractRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: callerUserId);
            var principalPractitioner = principalPractRepo.GetByUserId(principalUserId);
            if (principalPractitioner == null)
            {
                throw new ArgumentException("Principal practitioner record not available in application");
            }

            var normalizedPhone = UserHelper.NormalizePhoneNumber(practitionerPhoneNumber);

            // Block duplicate OA invites for the same phone number
            var existingPhoneInvite = inviteManager.GetPendingUserInviteByPhone(normalizedPhone);
            if (existingPhoneInvite != null)
            {
                throw new QueryException(
                    "An invitation has already been sent to this phone number.");
            }

            var userId = callerUserId;
            var tenantId = TenantExecutionContext.Tenant.Id;
            var user = new ApplicationUser
            {
                UserName = $"External_Edit_{Guid.NewGuid()}",
                IsActive = true,
                TenantId = tenantId,
                PhoneNumber = normalizedPhone,
                ContactPreference = MessageTypeConstants.SMS,
                IdNumber = idOrPassport
            };

            await userManager.CreateAsync(user);
            // PrincipalId on Invite references Practitioner.Id (not ApplicationUser.Id)
            inviteManager.CreateUserInvitation(user.Id, principalPractitioner.Id);
            
            var tokenWrapper = new PrincipalPractitionerTokenWrapperModel
            {
                AddedByUserId = userId,
                Token = await tokenManager.GenerateTokenAsync(user),
                AddedToUserId = user.Id,
                PreSchoolNameCode = preSchoolNameCode,
                PhoneNumber = user.PhoneNumber
            };

            var token = TokenHelper.EncodeToken(JsonConvert.SerializeObject(tokenWrapper));
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new QueryException("Token generation failed");
            }
            
            await notificationManager.SendPreSchoolInvitationAsync(user, principal.FullName,  preSchoolName, token);

            await Task.Delay(1000);
            user.IsActive = false;
            await userManager.UpdateAsync(user);

            return token;

        }

        [Permission(PermissionGroups.NOTIFICATIONS, GraphActionEnum.Create)]
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
            var practitionerUser = await userManager.FindByIdAsync(practitionerUserId);
            if (practitionerUser == null)
            {
                throw new ArgumentException("Practitioner with id not available in application");
            }

            var normalizePhoneNumber = UserHelper.NormalizePhoneNumber(principalPhoneNumber);

            var tenantId = TenantExecutionContext.Tenant.Id;
            var user = new ApplicationUser
            {
                UserName = $"External_Edit_{Guid.NewGuid()}",
                IsActive = true,
                TenantId = tenantId,
                PhoneNumber = normalizePhoneNumber,
                ContactPreference = MessageTypeConstants.SMS
            };
            await userManager.CreateAsync(user);

            var tokenWrapper = new PrincipalPractitionerTokenWrapperModel
            {
                AddedByUserId = practitionerUserId,
                Token = await tokenManager.GenerateTokenAsync(user),
                PhoneNumber = user.PhoneNumber,
                IdNumber = practitionerUser.IdNumber,
                UserName = practitionerUser.UserName
            };

            var token = TokenHelper.EncodeToken(JsonConvert.SerializeObject(tokenWrapper));
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new QueryException("Token generation failed");
            }
            var practitionerName = string.IsNullOrEmpty(practitionerUser.FullName) ? practitionerUser.UserName : practitionerUser.FullName;
            await notificationManager.SendPrincipalInvitationAsync(user, practitionerName, token);

            await Task.Delay(1000);
            user.IsActive = false;
            await userManager.UpdateAsync(user);

            return token;
        }
    }
}
