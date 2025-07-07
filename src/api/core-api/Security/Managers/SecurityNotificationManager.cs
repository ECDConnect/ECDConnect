using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security.Helpers;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
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
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider.SetMessageTemplate(TemplateTypeEnum.AuthCode)
                .AddOrUpdateFieldReplacement(MessageTemplateConstants.PasswordResetLink, otp)
                .AddOrUpdateFieldReplacement(MessageTemplateConstants.OTPCode, otp)
                .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
                .SendMessageAsync();
        }

        public async Task SendOAWLAuthenticationCodeAsync(ApplicationUser user, string otp)
        {
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider.SetMessageTemplate(TemplateTypeEnum.OAWLAuthCode)
                .AddOrUpdateFieldReplacement(MessageTemplateConstants.PasswordResetLink, otp)
                .AddOrUpdateFieldReplacement(MessageTemplateConstants.OTPCode, otp)
                .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
                .SendMessageAsync();
        }

        public async Task SendForgotPasswordMessageAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var forgotPasswordCallback = $"{_options.Value.ForgotPassword}?username={user.UserName}&token={encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;

            var notificationProvider = _notificationProviderFactory.Create(user);
            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.ForgotPassword)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.PasswordResetLink, forgotPasswordCallback)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, user.FirstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.Username, user.UserName)
              .SendMessageAsync();
        }

        public async Task SendPortalForgotPasswordMessageAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            //var forgotPasswordCallback = $"{_options.Value.ForgotPasswordPortal}{encodedToken}?username={user.UserName}";
            var forgotPasswordCallback = $"{_options.Value.ForgotPasswordPortal}?username={user.UserName}&token={encodedToken}";
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

        public async Task RequestVerifyCellphoneNumberAsync(ApplicationUser user, Uri hostUrl)
        {
            var token = await _userManager.GenerateChangePhoneNumberTokenAsync(user, user.PendingPhoneNumber);

            var encodedToken = TokenHelper.EncodeToken(token);
            var defaultVerificationUrl = new Uri(hostUrl, "/" + TemplateTypeConstants.VerifyCellphoneNumber.ToString()).ToString();
            var verificationUrl = $"{_options?.Value?.VerifyCellphoneNumberUrl ?? defaultVerificationUrl}";
            var verifyCellphoneNumberCallback = $"{verificationUrl}?username={user.UserName}&token={encodedToken}";
            var organisationName = TenantExecutionContext.Tenant.ApplicationName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.VerifyCellphoneNumber)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.VerifyCellphoneLink, verifyCellphoneNumberCallback)
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

        public async Task SendHelpFormSubmissionToAdministratorAsync(Guid adminUserId, UserHelp userHelp)
        {
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            var organisationEmail = TenantExecutionContext.Tenant.OrganisationEmail;

            var helpLoginStatus = userHelp.IsLoggedIn  ? "Yes" : "No";
            var helpContactDetail = userHelp.ContactPreference == "email" ? userHelp.Email : userHelp.CellNumber;
            var adminUser = _userManager.FindByIdAsync(adminUserId).Result;
            var adminEmail = adminUser.Email;

            if (organisationEmail != null)
            {
                // We need to update the user's email with the organisationEmail, send the mail and then revert
                adminUser.Email = organisationEmail;
                await _userManager.UpdateNormalizedEmailAsync(adminUser);
            }

            var affectedUserFullName = "anonymous";
            if (userHelp.UserId != null)
            {
                var user = _userManager.FindByIdAsync(userHelp.UserId).Result;
                affectedUserFullName = user.FullName;
            }

            var notificationProvider = _notificationProviderFactory.Create(adminUser, MessageTypeConstants.EMAIL);
            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.AdminUserHelpForm)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.AffectedUserFullName, affectedUserFullName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.HelpContactDetail, helpContactDetail)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.HelpCategory, userHelp.Subject)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.HelpDescription, userHelp.Description)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.HelpLoginStatus, helpLoginStatus)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();

            if (organisationEmail != null)
            {
                // revert email address to previous
                adminUser.Email = adminEmail;
                await _userManager.UpdateNormalizedEmailAsync(adminUser);
            }
        }

        public async Task SendNewTenantSetupToAdministratorAsync(Guid adminUserId, TenantOrgDetailModel tenantOrgDetail)
        {
            var adminUser = _userManager.FindByIdAsync(adminUserId).Result;
            var adminEmail = adminUser.Email;

            if (TenantExecutionContext.Tenant.OrganisationEmail != null)
            {
                // We need to update the user's email with the organisationEmail, send the mail and then revert
                adminUser.Email = TenantExecutionContext.Tenant.OrganisationEmail;
                await _userManager.UpdateNormalizedEmailAsync(adminUser);
            
                var notificationProvider = _notificationProviderFactory.Create(adminUser, MessageTypeConstants.EMAIL);
                await notificationProvider
                  .SetMessageTemplate(TemplateTypeEnum.NewTenantSetupInfoReceived)
                  .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, tenantOrgDetail.ApplicationName)
                  .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, tenantOrgDetail.OrganisationName)
                  .SendMessageAsync();

                // revert email address to previous
                adminUser.Email = adminEmail;
                await _userManager.UpdateNormalizedEmailAsync(adminUser);
            }
        }

        public async Task SendWelcomeEmailToNewSuperAdminAsync(Guid adminUserId, string firstName, string email)
        {
            var adminUser = _userManager.FindByIdAsync(adminUserId).Result;
            var adminEmail = adminUser.Email;

            adminUser.Email = email;
            await _userManager.UpdateNormalizedEmailAsync(adminUser);

            var notificationProvider = _notificationProviderFactory.Create(adminUser, MessageTypeConstants.EMAIL);
            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.WelcomeEmailToNewSuperAdmin)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .SendMessageAsync();

            // revert email address to previous
            adminUser.Email = adminEmail;
            await _userManager.UpdateNormalizedEmailAsync(adminUser);
        }

    }
}
