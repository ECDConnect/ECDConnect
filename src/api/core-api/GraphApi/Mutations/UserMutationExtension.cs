using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class UserMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<ApplicationUser> AddUser(
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] ILogger<UserMutationExtension> _logger,
          [Service] IFileService fileService,
          IGenericRepositoryFactory repoFactory,
          AuthenticationDbContext dbContext,
          ApplicationUserManager userManager,
          UserModel input)
        {
            var currentUserId = httpContextAccessor.HttpContext.GetUser().Id;
            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId.ToString());
            bool currentUserIsAdmin = false;
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            if (input is null)
            {
                throw new QueryException("Invalid User input.");
            }
            if (!string.IsNullOrEmpty(input.ProfileImageUrl))
            {
                var parts = input.ProfileImageUrl.Split(';');
                if (parts.Length > 1)
                {
                    if (parts.Length != 2) throw new QueryException("Invalid profile image data.");
                    if (!parts[1].StartsWith("base64,")) throw new QueryException("Invalid profile image data.");
                    if (!fileService.IsImageFileType(parts[1].Substring(7))) throw new QueryException("Invalid profile image file type.");
                }
            }

            if (input?.IsAdmin ?? false)
            {
                currentUserIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR) || await userManager.IsInRoleAsync(currentUser, Roles.SUPER_ADMINISTRATOR);

                if (!currentUserIsAdmin)
                {
                    throw new QueryException("You may not create an admin user.");
                }
            }

            // Check for existing user.
            var newUsername = input?.IdNumber ?? input.Email ?? Guid.NewGuid().ToString();
            //var existingUser = await userManager.FindByNameAsync(newUsername);
            //existingUser ??= await userManager.FindByIdAsync(input.Id);
            // use dbcontext because usernames need to be distinct in table
            var userExists = dbContext.Users.Where(x => x.UserName == newUsername).FirstOrDefault();
            if (userExists is not null)
                throw new QueryException("A user with the same username already exists.");

            // Create new user.
            var id = string.IsNullOrEmpty(input.Id) ? Guid.NewGuid() : Guid.Parse(input.Id);
            var newUser = new ApplicationUser
            {
                Id = id,
                PhoneNumber = input.PhoneNumber,
                UserName = newUsername,
                IdNumber = input.IdNumber,
                Email = input.Email,
                IsSouthAfricanCitizen = input.IsSouthAfricanCitizen ?? false,
                VerifiedByHomeAffairs = input.VerifiedByHomeAffairs ?? false,
                DateOfBirth = input.DateOfBirth ?? DateTime.MinValue,
                GenderId = input.GenderId,
                RaceId = input.RaceId,
                FirstName = input.FirstName,
                Surname = input.Surname,
                FullName = $"{input.FirstName} {input.Surname}",
                ContactPreference = input.ContactPreference ?? MessageTypeConstants.SMS,
                IsActive = true,
                ProfileImageUrl = input.ProfileImageUrl,
                TenantId = tenantId,
                LanguageId = input.LanguageId,
                InsertedDate = DateTime.UtcNow,
                UpdatedDate = null,
            };

            IdentityResult userCreatedResult = null;
            try
            {
                userCreatedResult = await userManager.CreateAsync(newUser);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not add user: {0}\nException:{1}", userCreatedResult?.Errors?.FirstOrDefault()?.Description, ex?.InnerException?.Message ?? ex.Message);
                throw new QueryException("Could not add user.");
            }

            if (!(userCreatedResult?.Succeeded ?? false))
            {
                _logger.LogError("Could not add user: {0}", userCreatedResult?.Errors?.FirstOrDefault()?.Description);
                throw new QueryException("Could not add user.");
            }

            // If requested, and allowed, add the admin role to the new user
            if (input.IsAdmin ?? false)
            {
                if (currentUserIsAdmin)
                {
                    var adminRoleResult = await userManager.AddToRoleAsync(newUser, Roles.ADMINISTRATOR);

                    if (!adminRoleResult.Succeeded)
                    {
                        _logger.LogError(adminRoleResult?.Errors?.FirstOrDefault()?.Description ??
                            "Could not add user to admin role.");
                        throw new QueryException();
                    }
                }
            }

            if (!string.IsNullOrWhiteSpace(input.Password))
            {
                var passwordCreatedResult = await userManager.AddPasswordAsync(newUser, input.Password);

                if (!passwordCreatedResult.Succeeded)
                {
                    _logger.LogError(passwordCreatedResult.Errors.First().Description);
                    throw new QueryException("Could not set user password.");
                }
            }

            // Returns a new user, which just so happens to be an instance of the ApplicationUserInputType
            return newUser;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public async Task<ApplicationUser> UpdateUser(
          ApplicationUserManager userManager,
          [Service] SecurityNotificationManager securityNotificationManager,
          [Service] ILogger<UserMutationExtension> logger,
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] IFileService fileService,
          string id,
          UserModel input)
        {
            var user = await userManager.FindByIdAsync(id);
            var userIsAdmin = await userManager.IsInRoleAsync(user, Roles.ADMINISTRATOR);

            // Check role of user requesting the change
            var currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;
            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId.ToString());
            var currentUserIsSuperAdmin = await userManager.IsInRoleAsync(currentUser, Roles.SUPER_ADMINISTRATOR);

            if (input is null)
                throw new QueryException("Input cannot be null.");

            if (!string.IsNullOrEmpty(input.ProfileImageUrl))
            {
                var parts = input.ProfileImageUrl.Split(';');
                if (parts.Length > 1)
                {
                    if (parts.Length != 2) throw new QueryException("Invalid profile image data.");
                    if (!parts[1].StartsWith("base64,")) throw new QueryException("Invalid profile image data.");
                    if (!fileService.IsImageFileType(parts[1].Substring(7))) throw new QueryException("Invalid profile image file type.");
                }
            }

            if (user is null || currentUserId is null)
                throw new QueryException("User not found.");

            Guid tenantId = TenantExecutionContext.Tenant.Id;

            // Cross tenant, but allow admin user which has no tenant... 
            if (user.TenantId != tenantId && user.TenantId != null)
            {
                throw new QueryException("Cross tenant access denied.");
            }

            input.Id = id;

            if (input.ResetData is not null) {
                user.ResetData = input.ResetData;
            }

            // Phone Number
            if (input.PhoneNumber is not null
                && input.PhoneNumber != user.PhoneNumber)
            {
                user.PhoneNumber = UserHelper.NormalizePhoneNumber(replaceIfNotNullOrWhiteSpace(user.PhoneNumber, input.PhoneNumber));
            }

            if (input.WhatsAppNumber != null
                && input.WhatsAppNumber != user.WhatsAppNumber)
            {
                var normalizedWhatsAppNumber = replaceIfNotNullOrWhiteSpace(user.WhatsAppNumber, input.WhatsAppNumber);
                user.WhatsAppNumber = UserHelper.NormalizePhoneNumber(normalizedWhatsAppNumber);
            }

            if (!string.IsNullOrWhiteSpace(input.IdNumber)
                && input.IdNumber != user.IdNumber)
            {
                user.IdNumber = input.IdNumber;
            }

            if (!string.IsNullOrWhiteSpace(input.UserName))
            {
                user.UserName = input.UserName;
            }

            if (input.IsSouthAfricanCitizen is not null
                && input.IsSouthAfricanCitizen != user.IsSouthAfricanCitizen)
            {
                user.IsSouthAfricanCitizen = input.IsSouthAfricanCitizen ?? false;
            }

            if (input.VerifiedByHomeAffairs is not null
                && input.VerifiedByHomeAffairs != user.VerifiedByHomeAffairs)
            {
                user.VerifiedByHomeAffairs = input.VerifiedByHomeAffairs ?? false;
            }

            if (input.DateOfBirth.HasValue
                && input.DateOfBirth.Value.Date != user.DateOfBirth.Date) //avoid time changes
            {
                user.DateOfBirth = input.DateOfBirth.Value.Date;
            }

            if (input.GenderId is not null
                && input.GenderId != user.GenderId)
            {
                user.GenderId = input.GenderId;
            }

            if (input?.RaceId is not null
                && input.RaceId != user.RaceId)
            {
          
                user.RaceId = input.RaceId;
            }

            if (input.LanguageId is not null
                && input.LanguageId != user.LanguageId)
            {
                user.LanguageId = input.LanguageId;
            }

            if (input.FirstName is not null
                && input.FirstName != user.FirstName)
            {
                user.FirstName = input.FirstName;
                user.FullName = $"{input.FirstName} {user.Surname}"; //use existing surname incase surname unchanged
            }

            if (input.Surname is not null
                && input.Surname != user.Surname)
            {
                user.Surname = input.Surname;
                user.FullName = $"{user.FirstName} {input.Surname}"; //use existing surname incase surname unchanged
            }

            if (!string.IsNullOrWhiteSpace(input.ContactPreference)
                && input.ContactPreference != user.ContactPreference)
            {
                user.ContactPreference = input.ContactPreference;
            }

            if (input.EmergencyContactPhoneNumber != null
                && input.EmergencyContactPhoneNumber != user.EmergencyContactPhoneNumber)
            {
                user.EmergencyContactPhoneNumber = input.EmergencyContactPhoneNumber;
            }

            if (input.EmergencyContactFirstName != null
                && input.EmergencyContactFirstName != user.EmergencyContactFirstName)
            {
                user.EmergencyContactFirstName = input.EmergencyContactFirstName;
            }

            if (input.EmergencyContactSurname != null
                && input.EmergencyContactSurname != user.EmergencyContactSurname)
            {
                user.EmergencyContactSurname = input.EmergencyContactSurname;
            }

            if (input.NextOfKinFirstName != null
                && input.NextOfKinFirstName != user.NextOfKinFirstName)
            {
                user.NextOfKinFirstName = input.NextOfKinFirstName;
            }

            if (input.NextOfKinSurname != null
                && input.NextOfKinSurname != user.NextOfKinSurname)
            {
                user.NextOfKinSurname = input.NextOfKinSurname;
            }

            if (input.NextOfKinContactNumber != null
                && input.NextOfKinContactNumber != user.NextOfKinContactNumber)
            {
                user.NextOfKinContactNumber = input.NextOfKinContactNumber;
            }

            // If userId is null, you're prob. an admin, admins are allowed to log into any tenant. Management.
            user.TenantId = user.TenantId == null ? null : tenantId;

            // If the user changing the email, is different to the user being changed
            // Don't allow changing email address without verification first.
            if (!string.IsNullOrWhiteSpace(input.Email)
                && !string.IsNullOrWhiteSpace(user.Email)
                && user.Email != input.Email
                && user.Id != currentUserId)
            {
                // if current user is super admin and the user is admin, then we don't verify
                if (currentUserIsSuperAdmin && userIsAdmin)
                {
                    user.Email = input.Email;
                    user.EmailConfirmed = false;
                }
                else
                {
                    user.PendingEmail = input.Email;
                    try
                    {
                        var apiUrl = new Uri("https://" + httpContextAccessor.HttpContext.Request.Host.ToString());
                        await securityNotificationManager.RequestVerifyEmailAsync(user, apiUrl);
                    }
                    catch (Exception exception)
                    {
                        logger?.LogError("Could not send email verification for change of user email address.", new { userId = user.Id, exception });
                    }
                    // Set email back to original so that it must first be verified.
                    input.Email = user.Email;
                }

            }

            // If the email is different (or will become unconfirmed)
            // and if there's an email to set,
            // and if the user is changing their own email (changes from portal must be verified)
            // allow them to change it without verification
            if (user.Email != input.Email
                && !string.IsNullOrWhiteSpace(input.Email)
                && user.Id == currentUserId)
            {
                user.Email = input.Email;
                user.EmailConfirmed = false;
            }

            if (!string.IsNullOrWhiteSpace(input.ProfileImageUrl)
                && input.ProfileImageUrl != user.ProfileImageUrl)
            {
                user.ProfileImageUrl = input.ProfileImageUrl;
            }

            user.UpdatedDate = DateTime.UtcNow;
            var updateResult = await userManager.UpdateAsync(user);

            return user;
        }

        private static string replaceIfNotNullOrWhiteSpace(string original, string @new)
        {
            return string.IsNullOrWhiteSpace(@new) ? original : @new;
        }

        // TODO: Don't let users disable each other
        [Permission(PermissionGroups.USER, GraphActionEnum.Delete)]
        public async Task<bool> DeleteUser(
          [Service] IHttpContextAccessor httpContextAccessor,
          IGenericRepositoryFactory repoFactory,
          ApplicationUserManager userManager,
          string id)
        {
            var user = await userManager.FindByIdAsync(id);
            var currentUserId = httpContextAccessor.HttpContext.GetUser().Id;

            if (user == default(ApplicationUser))
            {
                return false;
            }

            // Don't let normal users disable admins...
            var isAdmin = await userManager.IsInRoleAsync(user, Roles.ADMINISTRATOR);
            if (isAdmin)
            {
                var currentUser = await userManager.FindByIdAsync(currentUserId.ToString());
                var isAlsoAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);

                if (!isAlsoAdmin)
                {
                    throw new QueryException("You may not disable an administrator.");
                }
            }

            user.LockoutEnabled = true;
            user.LockoutEnd = DateTime.MaxValue;
            user.IsActive = false;
            user.UpdatedDate = DateTime.UtcNow;

            var updateResult = await userManager.UpdateAsync(user);

            return updateResult.Succeeded;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Delete)]
        public async Task<BulkDeactivateResult> BulkDeleteUser(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ILogger<UserMutationExtension> _logger,
            IGenericRepositoryFactory repoFactory,
            ApplicationUserManager userManager,
            List<string> ids)
        {
            var currentUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var currentUser = await userManager.FindByIdAsync(currentUserId.ToString());
            bool executorIsSuperAdmin = await userManager.IsInRoleAsync(currentUser, Roles.SUPER_ADMINISTRATOR);

            if (ids is null || ids.Count == 0)
            {
                return new BulkDeactivateResult();
            }

            var guidIds = ids.Select(x => Guid.Parse(x)).ToList();
            var users = userManager.Users.Where(u => guidIds.Contains(u.Id)).ToList();

            if (users is null || users.Count == 0)
            {
                return new BulkDeactivateResult();
            }

            var success = new List<string>();
            var failed = new List<string>();

            foreach (var user in users)
            {
                // Don't let normal users disable admins...
                var isAdmin = await userManager.IsInRoleAsync(user, Roles.ADMINISTRATOR);
                if (isAdmin)
                {
                    if (!executorIsSuperAdmin)
                    {
                        failed.Add(user.Id.ToString());
                        continue;
                    }
                }

                user.LockoutEnabled = true;
                user.LockoutEnd = DateTime.MaxValue;
                user.IsActive = false;

                var updateResult = await userManager.UpdateAsync(user);

                if (updateResult.Succeeded)
                {
                    // Remove any roles
                    var roles = userManager.GetRolesAsync(user).Result;
                    foreach (var role in roles)
                    {
                        _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [UserMutationExtension.BulkDeleteUser]", role, user.Id, currentUserId);
                        var result = userManager.RemoveFromRoleAsync(user, role).Result;
                    }

                    success.Add(user.Id.ToString());
                }
                else
                {
                    failed.Add(user.Id.ToString());
                }
            }

            return new BulkDeactivateResult() { Failed = failed, Success = success };
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool BulkReactivateUsers(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ILogger<UserMutationExtension> _logger,
            IGenericRepositoryFactory repoFactory,
            ApplicationUserManager userManager,
            List<Guid> userIds)
        {
            if (userIds == null)
            {
                throw new ArgumentNullException(nameof(userIds));
            }

            var currentUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: currentUserId);
            var coachRepo = repoFactory.CreateRepository<Coach>(userContext: currentUserId);

            var users = userManager.Users.Where(u => userIds.Contains(u.Id)).ToList();

            foreach (var user in users)
            {
                // Reactivate user record
                user.LockoutEnabled = false;
                user.LockoutEnd = DateTime.UtcNow;
                user.IsActive = true;

                userManager.UpdateAsync(user);

                // Reset Roles
                var practitioner = practitionerRepo.GetByUserId(user.Id);

                if (practitioner != null)
                {
                    // If principal add to the principal role
                    if (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value)
                    {
                        userManager.AddToRoleAsync(user, Roles.PRINCIPAL);
                    }
                    else
                    {
                        userManager.AddToRoleAsync(user, Roles.PRACTITIONER);
                    }
                }

                var coach = coachRepo.GetByUserId(user.Id);

                if (coach != null)
                {
                    userManager.AddToRoleAsync(user, Roles.COACH);
                }


            }

            return true;
        }

        // TODO: Shouldn't we check Hierarchy here?
        // TODO: Should a user be able to reset another user's password?
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public async Task<bool> ResetUserPassword(
          ApplicationUserManager userManager,
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] SecurityNotificationManager securityNotificationManager,
          string id,
          string newPassword)
        {
            var user = await userManager.FindByIdAsync(id);
            user.UpdatedDate = DateTime.UtcNow;
            // Don't let normal users reset admin passwords...
            var isAdmin = await userManager.IsInRoleAsync(user, Roles.ADMINISTRATOR);
            if (isAdmin)
            {
                var currentUser = await userManager.FindByIdAsync(httpContextAccessor.HttpContext.GetUser().Id.ToString());
                var isAlsoAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);

                if (!isAlsoAdmin)
                {
                    throw new QueryException("You may not disable an administrator.");
                }
            }

            var passwordToken = await userManager.GeneratePasswordResetTokenAsync(user);
            var updatedPassword = await userManager.ResetPasswordAsync(user, passwordToken, newPassword);

            if (!updatedPassword.Succeeded)
            {
                // Send notification to Super Admin
                await securityNotificationManager.SendAdminPasswordChangedMessageAsync(user);
            }
            return updatedPassword.Succeeded;
        }
    }
}