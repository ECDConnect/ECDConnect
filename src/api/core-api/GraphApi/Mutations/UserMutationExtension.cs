using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
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
using ECDLink.Abstractrions.Constants;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class UserMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<ApplicationUser> AddUser(
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] ILogger<UserMutationExtension> _logger,
          IGenericRepositoryFactory repoFactory,
          UserManager<ApplicationUser> userManager,
          UserModel input)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;
            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);
            bool currentUserIsAdmin = false;
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            if (input is null || currentUserId is null)
            {
                throw new QueryException("Invalid User input.");
            }

            if (input?.IsAdmin ?? false)
            {
                currentUserIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);

                if (!currentUserIsAdmin)
                {
                    throw new QueryException("You may not create an admin user.");
                }
            }
            
            // Check for existing user.
            var newUsername = input?.IdNumber ?? input.Email ?? Guid.NewGuid().ToString();
            var existingUser = await userManager.FindByNameAsync(newUsername);
            existingUser ??= await userManager.FindByIdAsync(input.Id);

            if (existingUser is not null)
                throw new QueryException("User already exists.");

            // Create new user.
            var newUser = new ApplicationUser
            {
                Id = input.Id ?? Guid.NewGuid().ToString(),
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
                UpdatedDate = null
            };

            IdentityResult userCreatedResult = null;
            try
            {
                userCreatedResult = await userManager.CreateAsync(newUser);
            } catch (Exception ex)
            {
                _logger.LogError("Could not add user: {0}\nException:{1}", userCreatedResult?.Errors?.FirstOrDefault()?.Description, ex?.InnerException?.Message ?? ex.Message);
                throw new QueryException("Could not add user.");
            }

            if (!(userCreatedResult?.Succeeded ?? false))
            {
                _logger.LogError("Could not add user: {0}", userCreatedResult?.Errors?.FirstOrDefault()?.Description);
                throw new QueryException("Could not add user.");
            }

            DoAudit(currentUserId, repoFactory, null, newUser.Id);

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

                    // Audit log the role change
                    DoAudit(
                        currentUserId,
                        repoFactory, new List<AuditChanges>() { new AuditChanges() {
                            FieldName = "Roles",
                            ValueBefore  = "",
                            ValueAfter = Roles.ADMINISTRATOR } },
                        newUser.Id);
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
          UserManager<ApplicationUser> userManager,
          [Service] SecurityNotificationManager securityNotificationManager,
          [Service] ILogger<UserMutationExtension> logger,
          [Service] IHttpContextAccessor httpContextAccessor,
          IGenericRepositoryFactory repoFactory,
          //IntegrationHelperManager integrationHelperManager,
          string id,
          UserModel input)
        {
            var user = await userManager.FindByIdAsync(id);
            var currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;

            if (input is null)
                throw new QueryException("Input cannot be null.");

            if (user is null || currentUserId is null)
                throw new QueryException("User not found.");
            
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            // Cross tenant, but allow admin user which has no tenant... 
            if (user.TenantId != tenantId && user.TenantId != null)
            {
                throw new QueryException("Cross tenant access denied.");
            }

            input.Id = id;

            //audit user changes
            List<AuditChanges> auditFields = new List<AuditChanges>();

            if (input.PhoneNumber is not null 
                && input.PhoneNumber != user.PhoneNumber)
            {
                auditFields.Add(new AuditChanges() { FieldName = "PhoneNumber", ValueBefore = user.PhoneNumber, ValueAfter = input.PhoneNumber });
                user.PhoneNumber = UserHelper.NormalizePhoneNumber(replaceIfNotNullOrWhiteSpace(user.PhoneNumber, input.PhoneNumber));
                user.PendingPhoneNumber = null;
            }

            if (input.WhatsAppNumber is not null
                && input.WhatsAppNumber != user.WhatsAppNumber)
            {
                auditFields.Add(new AuditChanges() { FieldName = "WhatsAppNumber", ValueBefore = user.WhatsAppNumber, ValueAfter = input.WhatsAppNumber });
                var normalizedWhatsAppNumber = replaceIfNotNullOrWhiteSpace(user.WhatsAppNumber, input.WhatsAppNumber);
                user.WhatsAppNumber = UserHelper.NormalizePhoneNumber(normalizedWhatsAppNumber);
                user.PendingPhoneNumber = null;
            }

            if (input.IdNumber is not null 
                && input.IdNumber != user.IdNumber)
            {
                auditFields.Add(new AuditChanges() { FieldName = "IdNumber", ValueBefore = user.IdNumber, ValueAfter = input.IdNumber });
                user.IdNumber = input.IdNumber;
            }

            if (input.IsSouthAfricanCitizen is not null 
                && input.IsSouthAfricanCitizen != user.IsSouthAfricanCitizen)
            {
                auditFields.Add(new AuditChanges() { FieldName = "IsSouthAfricanCitizen", ValueBefore = ((bool)user.IsSouthAfricanCitizen).ToString(), ValueAfter = ((bool)input.IsSouthAfricanCitizen).ToString() });
                user.IsSouthAfricanCitizen = input.IsSouthAfricanCitizen ?? false;
            }

            if (input.VerifiedByHomeAffairs is not null 
                && input.VerifiedByHomeAffairs != user.VerifiedByHomeAffairs)
            {
                auditFields.Add(new AuditChanges() { FieldName = "VerifiedByHomeAffairs", ValueBefore = ((bool)user?.VerifiedByHomeAffairs).ToString(), ValueAfter = ((bool)input.VerifiedByHomeAffairs).ToString() });
                user.VerifiedByHomeAffairs = input.VerifiedByHomeAffairs ?? false;
            }

            if (input.DateOfBirth.HasValue
                && input.DateOfBirth.Value.Date != user.DateOfBirth.Date) //avoid time changes
            {
                auditFields.Add(new AuditChanges() { FieldName = "DateOfBirth", ValueBefore = user.DateOfBirth.ToString(), ValueAfter = input.DateOfBirth.Value.ToString() });
                user.DateOfBirth = input.DateOfBirth.Value.Date;
            }

            if (input.GenderId is not null 
                && input.GenderId != user.GenderId)
            {
                auditFields.Add(new AuditChanges() { FieldName = "GenderId", ValueBefore = user?.GenderId?.ToString(), ValueAfter = (input.GenderId != null ? input.GenderId.ToString() : null) });
                user.GenderId = input.GenderId;
            }

            if (input?.RaceId is not null 
                && input.RaceId != user.RaceId)
            {
                
                    auditFields.Add(new AuditChanges() { FieldName = "RaceId", ValueBefore = (user.RaceId != null ? user.RaceId.ToString() : null), ValueAfter = (input.RaceId != null ? input.RaceId.ToString() : null) });
                user.RaceId = input.RaceId;
            }

            if (input.LanguageId is not null)
            {
                if (input.LanguageId != user.LanguageId)
                    auditFields.Add(new AuditChanges() { FieldName = "LanguageId", ValueBefore = (user.LanguageId != null ? user.LanguageId.ToString() : null), ValueAfter = (input.LanguageId != null ? input.LanguageId.ToString() : null) });
                user.LanguageId = input.LanguageId;
            }

            if (input.FirstName is not null
                && input.FirstName != user.FirstName)
            {
                if (input.FirstName != user.FirstName)
                    auditFields.Add(new AuditChanges() { FieldName = "FirstName", ValueBefore = user.FirstName, ValueAfter = input.FirstName });
                user.FirstName = input.FirstName;
                user.FullName = $"{input.FirstName} {user.Surname}"; //use existing surname incase surname unchanged
            }

            if (input.Surname is not null
                && input.Surname != user.Surname)
            {
                auditFields.Add(new AuditChanges() { FieldName = "Surname", ValueBefore = user.Surname, ValueAfter = input.Surname });
                user.Surname = input.Surname;
                user.FullName = $"{user.FirstName} {input.Surname}"; //use existing surname incase surname unchanged
            }

            if (!string.IsNullOrWhiteSpace(input.ContactPreference)
                && input.ContactPreference != user.ContactPreference)
            {
                auditFields.Add(new AuditChanges() { FieldName = "ContactPreference", ValueBefore = user.ContactPreference, ValueAfter = input.ContactPreference });
                user.ContactPreference = input.ContactPreference;
            }

            if (input.EmergencyContactPhoneNumber != null
                && input.EmergencyContactPhoneNumber != user.EmergencyContactPhoneNumber)
            {
                auditFields.Add(new AuditChanges() { FieldName = "EmergencyContactPhoneNumber", ValueBefore = user.EmergencyContactPhoneNumber, ValueAfter = input.EmergencyContactPhoneNumber });
                user.EmergencyContactPhoneNumber = input.EmergencyContactPhoneNumber;
            }

            if (input.EmergencyContactFirstName != null
                && input.EmergencyContactFirstName != user.EmergencyContactFirstName)
            {
                auditFields.Add(new AuditChanges() { FieldName = "EmergencyContactFirstName", ValueBefore = user.EmergencyContactFirstName, ValueAfter = input.EmergencyContactFirstName });
                user.EmergencyContactFirstName = input.EmergencyContactFirstName;
            }

            if (input.EmergencyContactSurname != null
                && input.EmergencyContactSurname != user.EmergencyContactSurname)
            {
                    auditFields.Add(new AuditChanges() { FieldName = "EmergencyContactSurname", ValueBefore = user.EmergencyContactSurname, ValueAfter = input.EmergencyContactSurname });
                user.EmergencyContactSurname = input.EmergencyContactSurname;
            }

            if (input.NextOfKinFirstName != null
                && input.NextOfKinFirstName != user.NextOfKinFirstName)
            {
                auditFields.Add(new AuditChanges() { FieldName = "NextOfKinFirstName", ValueBefore = user.NextOfKinFirstName, ValueAfter = input.NextOfKinFirstName });
                user.NextOfKinFirstName = input.NextOfKinFirstName;
            }

            if (input.NextOfKinSurname != null
                && input.NextOfKinSurname != user.NextOfKinSurname)
            {
                auditFields.Add(new AuditChanges() { FieldName = "NextOfKinSurname", ValueBefore = user.NextOfKinSurname, ValueAfter = input.NextOfKinSurname });
                user.NextOfKinSurname = input.NextOfKinSurname;
            }

            if (input.NextOfKinContactNumber != null)
            {
                if (input.NextOfKinContactNumber != user.NextOfKinContactNumber)
                    auditFields.Add(new AuditChanges() { FieldName = "NextOfKinContactNumber", ValueBefore = user.NextOfKinContactNumber, ValueAfter = input.NextOfKinContactNumber });
                user.NextOfKinContactNumber = input.NextOfKinContactNumber;
            }

            if (input.WhatsAppNumber != null
                && input.WhatsAppNumber != user.WhatsAppNumber)
            {
                auditFields.Add(new AuditChanges() { FieldName = "WhatsAppNumber", ValueBefore = user.WhatsAppNumber, ValueAfter = input.WhatsAppNumber });
                user.WhatsAppNumber = replaceIfNotNullOrWhiteSpace(user.WhatsAppNumber, input.WhatsAppNumber);
            }

            // If userId is null, you're prob. an admin, admins are allowed to log into any tenant. Management.
            user.TenantId = user.TenantId == null ? null : tenantId;

            if (!string.IsNullOrWhiteSpace(input.IdNumber)
                && input.IdNumber != user.IdNumber)
            {
                auditFields.Add(new AuditChanges() { FieldName = "UserName", ValueBefore = user.UserName, ValueAfter = input.IdNumber });
                user.UserName = input.IdNumber;
            }

            // If the user changing the email, is different to the user being changed
            // Don't allow changing email address without verification first.
            if (!string.IsNullOrWhiteSpace(input.Email)
                && !string.IsNullOrWhiteSpace(user.Email)
                && user.Email != input.Email
                && user.Id != currentUserId)
            {
                user.PendingEmail = input.Email;
                auditFields.Add(new AuditChanges() { FieldName = "Email", ValueBefore = user.Email, ValueAfter = input.Email });
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
                auditFields.Add(new AuditChanges() { FieldName = "Email", ValueBefore = user.Email, ValueAfter = input.Email });
            }

            // If the email is different (or will become unconfirmed)
            // and if there's an email to set,
            // and if the user is changing their own email (changes from portal must be verified)
            // allow them to change it without verification
            if (user.Email != input.Email
                && !string.IsNullOrWhiteSpace(input.Email)
                && user.Id == currentUserId)
            {
                auditFields.Add(new AuditChanges() { FieldName = "Email", ValueBefore = user.Email, ValueAfter = input.Email });
                user.Email = input.Email;
                user.EmailConfirmed = false;                
            }

            if (!string.IsNullOrWhiteSpace(input.ProfileImageUrl)
                && input.ProfileImageUrl != user.ProfileImageUrl)
            {
                auditFields.Add(new AuditChanges() { FieldName = "ProfileImageUrl", ValueBefore = user.ProfileImageUrl, ValueAfter = input.ProfileImageUrl });
                user.ProfileImageUrl = input.ProfileImageUrl;
            }
            if (auditFields.Count > 0)
            {
                user.UpdatedDate = DateTime.UtcNow;
                var updateResult = await userManager.UpdateAsync(user);

                DoAudit(currentUserId, repoFactory, auditFields, id);

                if (!updateResult.Succeeded)
                {
                    throw new QueryException(updateResult.Errors.First().Description);
                }
            }

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
          [Service] IPointsEngineService pointsEngineService,
          UserManager<ApplicationUser> userManager,
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
                var currentUser = await userManager.FindByIdAsync(currentUserId);
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
            DoAudit(currentUserId, repoFactory, null, id);

            // Manage points for user
            pointsEngineService.CalculateChildrenRegistrationRemoval(currentUserId, DateTime.UtcNow);

            return updateResult.Succeeded;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Delete)]
        public async Task<BulkDeactivateResult> BulkDeleteUser(
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] ILogger<UserMutationExtension> _logger,
          IGenericRepositoryFactory repoFactory,
          [Service] IPointsEngineService pointsEngineService,
          UserManager<ApplicationUser> userManager,
          List<string> ids)
        {
            var currentUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var currentUser = await userManager.FindByIdAsync(currentUserId);
            var executorIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);

            if (ids is null || ids.Count == 0)
            {
                return new BulkDeactivateResult();
            }

            var users = userManager.Users.Where(u => ids.Contains(u.Id)).ToList();
            
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
                    if (!executorIsAdmin)
                    {
                        failed.Add(user.Id);
                        continue;
                    }
                }

                user.LockoutEnabled = true;
                user.LockoutEnd = DateTime.MaxValue;
                user.IsActive = false;
                user.UpdatedDate = DateTime.UtcNow;

                var updateResult = await userManager.UpdateAsync(user);
                
                if (updateResult.Succeeded)
                {
                    // Manage points for user
                    var isPractitioner = await userManager.IsInRoleAsync(user, Roles.PRACTITIONER);
                    if (isPractitioner)
                        pointsEngineService.CalculateChildrenRegistrationRemoval(currentUserId, DateTime.UtcNow);

                    // Remove any roles
                    var roles = userManager.GetRolesAsync(user).Result;
                    foreach (var role in roles)
                    {
                        _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [UserMutationExtension.BulkDeleteUser]", role, user.Id, currentUserId);
                        var result = userManager.RemoveFromRoleAsync(user, role).Result;
                    }

                    success.Add(user.Id);
                    DoAudit(currentUserId, repoFactory, null, user.Id, "Delete"); 
                } else
                {
                    failed.Add(user.Id);
                }
            }

            return new BulkDeactivateResult() { Failed = failed, Success = success };
        }

        // TODO: Shouldn't we check Hierarchy here?
        // TODO: Should a user be able to reset another user's password?
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public async Task<bool> ResetUserPassword(
          UserManager<ApplicationUser> userManager,
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
                var currentUser = await userManager.FindByIdAsync(httpContextAccessor.HttpContext.GetUser().Id);
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

        private bool DoAudit(string userId,
            IGenericRepositoryFactory repoFactory,
            List<AuditChanges> changes, string id, string changeType = "Update")
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var auditInsertRepo = repoFactory.CreateRepository<IntegrationAudit>(userContext: userId);
            //Populate Audit records
            switch (changeType)
            {
                case "Delete":
                    auditInsertRepo.Insert(new IntegrationAudit()
                    {
                        ChangeType = changeType,
                        Entity = "ApplicationUser",
                        Property = "IsActive",
                        ValueAfter = "false",
                        ValueBefore = "true",
                        UserId = userId,
                        RelatedId = id,
                        TenantId = tenantId
                    });
                    break;
                case "Insert":
                    auditInsertRepo.Insert(new IntegrationAudit()
                    {
                        ChangeType = changeType,
                        Entity = "ApplicationUser",
                        UserId = userId,
                        RelatedId = id,
                        TenantId = tenantId
                    });
                    break;
                default:
                    if (changes != null && changes.Any())
                    {
                        IEnumerable<IntegrationAudit> changesList = changes.Select(change => new IntegrationAudit()
                        {
                            ChangeType = changeType,
                            Entity = "ApplicationUser",
                            Property = change.FieldName,
                            ValueBefore = change.ValueBefore,
                            ValueAfter = change.ValueAfter,
                            UserId = userId,
                            RelatedId = id,
                            TenantId = tenantId
                        });

                        auditInsertRepo.InsertMany(changesList);
                    }
                    break;
            }
            return true;
        }
    }
}