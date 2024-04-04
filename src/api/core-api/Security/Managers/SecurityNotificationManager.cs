using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security.Helpers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Security.Managers
{
    public class SecurityNotificationManager
    {
        private INotificationProviderFactory<ApplicationUser> _notificationProviderFactory;
        private ISystemSetting<SecurityNotificationOptions> _options;
        private readonly ApplicationUserManager _userManager;

        public SecurityNotificationManager(
            INotificationProviderFactory<ApplicationUser> notificationProviderFactory,
            ISystemSetting<SecurityNotificationOptions> optionAccessor,
            ApplicationUserManager userManager)
        {
            _notificationProviderFactory = notificationProviderFactory;
            _options = optionAccessor;
            _userManager = userManager;
        }

        public async Task SendAuthenticationCodeAsync(ApplicationUser user, string otp)
        {
            var provider = _notificationProviderFactory.Create(user);

            var applicationName = TenantExecutionContext.Tenant.ApplicationName;

            await provider.SetMessageTemplate(TemplateTypeEnum.AuthCode)
                .AddOrUpdateFieldReplacement(MessageTemplateConstants.OTPCode, otp)
                .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
                .SendMessageAsync();
        }

        public async Task SendForgotPasswordMessageAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var forgotPasswordCallback = $"{_options.Value.ForgotPassword}?username={user.UserName}&token={encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.ApplicationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.ForgotPassword)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.PasswordResetLink, forgotPasswordCallback)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }

        public async Task SendPortalForgotPasswordMessageAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var forgotPasswordCallback = $"{_options.Value.ForgotPasswordPortal}{encodedToken}/{user.UserName}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.ApplicationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.ForgotPasswordPortal)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.PasswordResetLink, forgotPasswordCallback)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }

        public async Task RequestVerifyEmailAsync(ApplicationUser user, Uri hostUrl)
        {
            var token = await _userManager.GenerateChangeEmailTokenAsync(user, user.PendingEmail);

            var encodedToken = TokenHelper.EncodeToken(token);
            var defaultVerificationUrl = new Uri(hostUrl, "/api/authentication/" + TemplateTypeConstants.VerifyEmailAddress.ToString()).ToString();
            var verificationUrl = $"{_options?.Value?.VerifyEmailUrl ?? defaultVerificationUrl}";
            var verifyEmailCallback = $"{verificationUrl}?username={user.UserName}&token={encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.ApplicationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user, MessageTypeConstants.EMAIL);

            await notificationProvider
              .UsePendingReceiver(user)
              .SetMessageTemplate(TemplateTypeEnum.VerifyEmailAddress)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.VerifyEmailAddressLink, verifyEmailCallback)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }

        public async Task SendPasswordChangedMessageAsync(ApplicationUser user)
        {
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.ApplicationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.PasswordChangedBySelf)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();

            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles.Contains("admin"))
            {
                var adminNotificationProvider = _notificationProviderFactory.Create(user, MessageTypeConstants.EMAIL);
                await adminNotificationProvider
                    .SetMessageTemplate(TemplateTypeEnum.SuperadminNotifyEmailChanged)
                    .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
                    .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
                    .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
                    .SendMessageAsync();
            }
        }

        public async Task SendPasswordChangedByAdminMessageAsync(ApplicationUser user, string nameOfAdminUserWhoMadeChange)
        {
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.ApplicationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user, MessageTypeConstants.EMAIL);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.PasswordChangedByAdmin)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.AdminUserFullName, nameOfAdminUserWhoMadeChange ?? "an Administrator")
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }
        public async Task SendAdminPasswordChangedMessageAsync(ApplicationUser user)
        {
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.ApplicationName;
            string affectedUserFullName = user.FullName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.AdminPasswordChanged)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.AffectedUserFullName, affectedUserFullName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }
    }
}
