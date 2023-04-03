using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
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

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class UserMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<ApplicationUser> AddUser(
          UserManager<ApplicationUser> userManager,
          UserModel input)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var newUser = new ApplicationUser
            {
                Id = input.Id,
                PhoneNumber = input.PhoneNumber,
                UserName = input?.IdNumber ?? Guid.NewGuid().ToString(),
                IdNumber = input.IdNumber,
                Email = input.Email,
                IsSouthAfricanCitizen = input.IsSouthAfricanCitizen,
                VerifiedByHomeAffairs = input.VerifiedByHomeAffairs,
                DateOfBirth = input.DateOfBirth,
                GenderId = input.GenderId,
                RaceId = input.RaceId,
                FirstName = input.FirstName,
                Surname = input.Surname,
                FullName = $"{input.FirstName} {input.Surname}",
                ContactPreference = input.ContactPreference,
                IsActive = true,
                ProfileImageUrl = input.ProfileImageUrl,
                TenantId = tenantId,
                LanguageId = input.LanguageId
            };

            var userCreatedResult = await userManager.CreateAsync(newUser);

            if (!userCreatedResult.Succeeded)
            {
                throw new Exception(userCreatedResult.Errors.Count() > 0 ? userCreatedResult.Errors.First().Description : "Could not add user");
            }

            if (!string.IsNullOrWhiteSpace(input.Password))
            {
                var passwordCreatedResult = await userManager.AddPasswordAsync(newUser, input.Password);

                if (!passwordCreatedResult.Succeeded)
                {
                    throw new Exception(passwordCreatedResult.Errors.First().Description);
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
          string id,
          UserModel input)
        {
            var user = await userManager.FindByIdAsync(id);
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            input.Id = id;

            user.PhoneNumber = replaceIfNotNullOrWhiteSpace(user.PhoneNumber, input.PhoneNumber);
            user.IdNumber = input.IdNumber;
            user.IsSouthAfricanCitizen = input.IsSouthAfricanCitizen;
            user.VerifiedByHomeAffairs = input.VerifiedByHomeAffairs;
            user.DateOfBirth = input.DateOfBirth;
            user.GenderId = input.GenderId;
            user.RaceId = input.RaceId;
            user.LanguageId = input.LanguageId;
            user.FirstName = input.FirstName;
            user.Surname = input.Surname;
            user.FullName = $"{input.FirstName} {input.Surname}";
            user.ContactPreference = input.ContactPreference;
            user.TenantId = tenantId;

            if (!string.IsNullOrWhiteSpace(input.IdNumber))
            {
                user.UserName = input.IdNumber;
            }

            // If the user changing the email, is different to the user being changed
            // Don't allow changing email address without verification first.
            if (!string.IsNullOrWhiteSpace(input.Email) 
                && !string.IsNullOrWhiteSpace(user.Email) 
                && user.Email != input.Email
                && user.Id != httpContextAccessor.HttpContext.GetUser().Id)
            {
                user.PendingEmail = input.Email;
                try
                {
                    var apiUrl = new Uri("https://" + httpContextAccessor.HttpContext.Request.Host.ToString());
                    await securityNotificationManager.RequestVerifyEmailAsync(user, apiUrl);
                }
                catch (Exception exception)
                {
                    logger?.LogError("Could not change user email address.", new { userId = user.Id, exception });
                }

                // Set email back to original so that it must first be verified.
                input.Email = user.Email;
            }

            // If the email is different (or will become unconfirmed)
            // and if there's an email to set,
            // and if the user is changing their own email (changes from portal must be verified)
            // allow them to change it without verification
            if (user.Email != input.Email 
                && !string.IsNullOrWhiteSpace(input.Email)
                && user.Id == httpContextAccessor.HttpContext.GetUser().Id)
            {
                user.Email = input.Email;
                user.EmailConfirmed = false;
            }

            if (!string.IsNullOrWhiteSpace(input.ProfileImageUrl))
            {
                user.ProfileImageUrl = input.ProfileImageUrl;
            }

            var updateResult = await userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                throw new Exception(updateResult.Errors.First().Description);
            }

            return user;
        }

        private static string replaceIfNotNullOrWhiteSpace(string original, string @new)
        {
            return string.IsNullOrWhiteSpace(@new) ? original : @new;
        }

        private static bool replaceIfNotNull(bool original, bool? @new)
        {
            return @new is null ? original : @new ?? false;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Delete)]
        public async Task<bool> DeleteUser(
          UserManager<ApplicationUser> userManager,
          string id)
        {
            var user = await userManager.FindByIdAsync(id);

            if (user == default(ApplicationUser))
            {
                return false;
            }

            user.IsActive = false;

            var updateResult = await userManager.UpdateAsync(user);

            return updateResult.Succeeded;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public async Task<bool> ResetUserPassword(
          UserManager<ApplicationUser> userManager,
          string id,
          string newPassword)
        {
            var user = await userManager.FindByIdAsync(id);

            var passwordToken = await userManager.GeneratePasswordResetTokenAsync(user);
            var updatedPassword = await userManager.ResetPasswordAsync(user, passwordToken, newPassword);

            if (!updatedPassword.Succeeded)
            {
                throw new Exception("Unable to update password");
            }

            return updatedPassword.Succeeded;
        }
    }
}
