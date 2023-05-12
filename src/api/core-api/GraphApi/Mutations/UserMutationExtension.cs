using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Repositories.Factories;
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
          IGenericRepositoryFactory repoFactory,
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

            DoAudit(httpContextAccessor, repoFactory, null, newUser.Id);

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
          IGenericRepositoryFactory repoFactory,
          string id,
          UserModel input)
        {
            var user = await userManager.FindByIdAsync(id);
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            input.Id = id;

            //audit user changes
            List<AuditChanges> fields = new List<AuditChanges>();
            if (input.PhoneNumber != user.PhoneNumber)
                fields.Add(new AuditChanges() { FieldName = "PhoneNumber", ValueBefore = user.PhoneNumber, ValueAfter = input.PhoneNumber });
            user.PhoneNumber = replaceIfNotNullOrWhiteSpace(user.PhoneNumber, input.PhoneNumber);
            if (input.IdNumber != user.IdNumber)
                fields.Add(new AuditChanges() { FieldName = "IdNumber", ValueBefore = user.IdNumber, ValueAfter = input.IdNumber });
            user.IdNumber = input.IdNumber;
            if (input.IsSouthAfricanCitizen != user.IsSouthAfricanCitizen)
                fields.Add(new AuditChanges() { FieldName = "IsSouthAfricanCitizen", ValueBefore = ((bool)user.IsSouthAfricanCitizen).ToString(), ValueAfter = ((bool)input.IsSouthAfricanCitizen).ToString() });
            user.IsSouthAfricanCitizen = input.IsSouthAfricanCitizen;
            if (input.VerifiedByHomeAffairs != user.VerifiedByHomeAffairs)
                fields.Add(new AuditChanges() { FieldName = "VerifiedByHomeAffairs", ValueBefore = ((bool)user.VerifiedByHomeAffairs).ToString(), ValueAfter = ((bool)input.VerifiedByHomeAffairs).ToString() });
            user.VerifiedByHomeAffairs = input.VerifiedByHomeAffairs;
            if (input.DateOfBirth != user.DateOfBirth)
                fields.Add(new AuditChanges() { FieldName = "DateOfBirth", ValueBefore = user.DateOfBirth.ToString(), ValueAfter = input.DateOfBirth.ToString() });
            user.DateOfBirth = input.DateOfBirth;
            if (input.GenderId != user.GenderId)
                fields.Add(new AuditChanges() { FieldName = "GenderId", ValueBefore = (user.GenderId != null ? user.GenderId.ToString() : null), ValueAfter = (input.GenderId != null ? input.GenderId.ToString() : null) });
            user.GenderId = input.GenderId;
            if (input.RaceId != user.RaceId)
                fields.Add(new AuditChanges() { FieldName = "RaceId", ValueBefore = (user.RaceId != null ? user.RaceId.ToString() : null), ValueAfter = (input.RaceId != null ? input.RaceId.ToString() : null) });
            user.RaceId = input.RaceId;
            if (input.LanguageId != user.LanguageId)
                fields.Add(new AuditChanges() { FieldName = "LanguageId", ValueBefore = (user.LanguageId != null ? user.LanguageId.ToString() : null), ValueAfter = (input.LanguageId != null ? input.LanguageId.ToString() : null) });
            user.LanguageId = input.LanguageId;
            if (input.FirstName != user.FirstName)
                fields.Add(new AuditChanges() { FieldName = "FirstName", ValueBefore = user.FirstName, ValueAfter = input.FirstName });
            user.FirstName = input.FirstName;
            if (input.Surname != user.Surname)
                fields.Add(new AuditChanges() { FieldName = "Surname", ValueBefore = user.Surname, ValueAfter = input.Surname });
            user.Surname = input.Surname;
            user.FullName = $"{input.FirstName} {input.Surname}";
            if (input.ContactPreference != user.ContactPreference)
                fields.Add(new AuditChanges() { FieldName = "ContactPreference", ValueBefore = user.ContactPreference, ValueAfter = input.ContactPreference });
            user.ContactPreference = input.ContactPreference;
            if (input.EmergencyContactPhoneNumber != null)
            {
                if (input.EmergencyContactPhoneNumber != user.EmergencyContactPhoneNumber)
                    fields.Add(new AuditChanges() { FieldName = "EmergencyContactPhoneNumber", ValueBefore = user.EmergencyContactPhoneNumber, ValueAfter = input.EmergencyContactPhoneNumber });
                user.EmergencyContactPhoneNumber = input.EmergencyContactPhoneNumber;
            }
            if (input.EmergencyContactFirstName != null)
            {
                if (input.EmergencyContactFirstName != user.EmergencyContactFirstName)
                    fields.Add(new AuditChanges() { FieldName = "EmergencyContactFirstName", ValueBefore = user.EmergencyContactFirstName, ValueAfter = input.EmergencyContactFirstName });
                user.EmergencyContactFirstName = input.EmergencyContactFirstName;
            }
            if (input.EmergencyContactSurname != null)
            {
                if (input.EmergencyContactSurname != user.EmergencyContactSurname)
                    fields.Add(new AuditChanges() { FieldName = "EmergencyContactSurname", ValueBefore = user.EmergencyContactSurname, ValueAfter = input.EmergencyContactSurname });
                user.EmergencyContactSurname = input.EmergencyContactSurname;
            }
            if (input.NextOfKinFirstName != null)
            {
                if (input.NextOfKinFirstName != user.NextOfKinFirstName)
                    fields.Add(new AuditChanges() { FieldName = "NextOfKinFirstName", ValueBefore = user.NextOfKinFirstName, ValueAfter = input.NextOfKinFirstName });
                user.NextOfKinFirstName = input.NextOfKinFirstName;
            }
            if (input.NextOfKinSurname != null)
            {
                if (input.NextOfKinSurname != user.NextOfKinSurname)
                    fields.Add(new AuditChanges() { FieldName = "NextOfKinSurname", ValueBefore = user.NextOfKinSurname, ValueAfter = input.NextOfKinSurname });
                user.NextOfKinSurname = input.NextOfKinSurname;
            }
            if (input.NextOfKinContactNumber != null)
            {
                if (input.NextOfKinContactNumber != user.NextOfKinContactNumber)
                    fields.Add(new AuditChanges() { FieldName = "NextOfKinContactNumber", ValueBefore = user.NextOfKinContactNumber, ValueAfter = input.NextOfKinContactNumber });
                user.NextOfKinContactNumber = input.NextOfKinContactNumber;
            }
            if (input.WhatsAppNumber != null)
            {
                if (input.WhatsAppNumber != user.WhatsAppNumber)
                    fields.Add(new AuditChanges() { FieldName = "WhatsAppNumber", ValueBefore = user.WhatsAppNumber, ValueAfter = input.WhatsAppNumber });
                user.WhatsAppNumber = replaceIfNotNullOrWhiteSpace(user.WhatsAppNumber, input.WhatsAppNumber);
            }

            user.TenantId = tenantId;

            if (!string.IsNullOrWhiteSpace(input.IdNumber))
            {
                if (input.IdNumber != user.IdNumber)
                {
                    user.UserName = input.IdNumber;
                    fields.Add(new AuditChanges() { FieldName = "UserName", ValueBefore = user.UserName, ValueAfter = input.IdNumber });
                }
            }

            // If the user changing the email, is different to the user being changed
            // Don't allow changing email address without verification first.
            if (!string.IsNullOrWhiteSpace(input.Email) 
                && !string.IsNullOrWhiteSpace(user.Email) 
                && user.Email != input.Email
                && user.Id != httpContextAccessor.HttpContext.GetUser().Id)
            {
                user.PendingEmail = input.Email;
                fields.Add(new AuditChanges() { FieldName = "Email", ValueBefore = user.Email, ValueAfter = input.Email });
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
                fields.Add(new AuditChanges() { FieldName = "Email", ValueBefore = user.Email, ValueAfter = input.Email });
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
                fields.Add(new AuditChanges() { FieldName = "Email", ValueBefore = user.Email, ValueAfter = input.Email });
            }

            if (!string.IsNullOrWhiteSpace(input.ProfileImageUrl))
            {
                if (input.ProfileImageUrl != user.ProfileImageUrl)
                    fields.Add(new AuditChanges() { FieldName = "ProfileImageUrl", ValueBefore = user.ProfileImageUrl, ValueAfter = input.ProfileImageUrl });
                user.ProfileImageUrl = input.ProfileImageUrl;
            }

            var updateResult = await userManager.UpdateAsync(user);

            DoAudit(httpContextAccessor, repoFactory, fields, id);

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
          [Service] IHttpContextAccessor httpContextAccessor,
          IGenericRepositoryFactory repoFactory,
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
            DoAudit(httpContextAccessor, repoFactory, null, id);
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

        private bool DoAudit([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory, 
            List<AuditChanges> changes,string id, string changeType = "Update")
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var auditInsertRepo = repoFactory.CreateRepository<IntegrationAudit>(userContext: uId);
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
                        UserId = uId,
                        RelatedId = id,
                    });
                    break;
                case "Insert":
                    auditInsertRepo.Insert(new IntegrationAudit()
                    {
                        ChangeType = changeType,
                        Entity = "ApplicationUser",
                        UserId = uId,
                        RelatedId = id,
                    });
                    break;
                default:
                    if (changes != null)
                    {
                        List<IntegrationAudit> changesList = new List<IntegrationAudit>();
                        foreach (var prop in changes)
                        {
                            changesList.Add(new IntegrationAudit()
                            {
                                ChangeType = changeType,
                                Entity = "ApplicationUser",
                                Property = prop.FieldName,
                                ValueBefore = prop.ValueBefore,
                                ValueAfter = prop.ValueAfter,
                                UserId = uId,
                                RelatedId = id
                            });
                        }

                        foreach (var auditItem in changesList)
                        {
                            auditInsertRepo.Insert(auditItem);
                        }
                    }
                    break;
            }
            return true;
        }
    }
}
