using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class UserMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public ApplicationUser AddUser(
          [Service] UserManager<ApplicationUser> userManager,
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

            var userCreatedResult = userManager.CreateAsync(newUser).Result;

            if (!userCreatedResult.Succeeded)
            {
                throw new Exception(userCreatedResult.Errors.Count() > 0 ? userCreatedResult.Errors.First().Description : "Could not add user");
            }

            if (!string.IsNullOrWhiteSpace(input.Password))
            {
                var passwordCreatedResult = userManager.AddPasswordAsync(newUser, input.Password).Result;

                if (!passwordCreatedResult.Succeeded)
                {
                    throw new Exception(passwordCreatedResult.Errors.First().Description);
                }
            }

            // Returns a new user, which just so happens to be an instance of the ApplicationUserInputType
            return newUser;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public ApplicationUser UpdateUser(
          [Service] UserManager<ApplicationUser> userManager,
          string id,
          UserModel input)
        {
            var user = userManager.FindByIdAsync(id).Result;
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            input.Id = id;

            if (user == default(ApplicationUser))
            {
                return AddUser(userManager, input);
            }

            user.PhoneNumber = input.PhoneNumber;
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

            if (!string.IsNullOrWhiteSpace(input.Email))
            {
                user.Email = input.Email;
            }

            if (!string.IsNullOrWhiteSpace(input.ProfileImageUrl))
            {
                user.ProfileImageUrl = input.ProfileImageUrl;
            }

            var updateResult = userManager.UpdateAsync(user).Result;

            if (!updateResult.Succeeded)
            {
                throw new Exception(updateResult.Errors.First().Description);
            }

            return user;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Delete)]
        public bool DeleteUser(
          [Service] UserManager<ApplicationUser> userManager,
          string id)
        {
            var user = userManager.FindByIdAsync(id).Result;

            if (user == default(ApplicationUser))
            {
                return false;
            }

            user.IsActive = false;

            var updateResult = userManager.UpdateAsync(user).Result;

            // var deleteResult = userManager.DeleteAsync(user).Result;

            return updateResult.Succeeded;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public bool ResetUserPassword(
          [Service] UserManager<ApplicationUser> userManager,
          string id,
          string newPassword)
        {
            var user = userManager.FindByIdAsync(id).Result;

            var passwordToken = userManager.GeneratePasswordResetTokenAsync(user).Result;
            var updatedPassword = userManager.ResetPasswordAsync(user, passwordToken, newPassword).Result;

            if (!updatedPassword.Succeeded)
            {
                throw new Exception("Unable to update password");
            }

            return updatedPassword.Succeeded;
        }
    }
}
