using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security.Helpers;
using ECDLink.Tenancy.Context;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Security.Managers
{
    public class SecurityNotificationManager
    {
        private INotificationProviderFactory<ApplicationUser> _notificationProviderFactory;
        private ISystemSetting<SecurityNotificationOptions> _options;

        public SecurityNotificationManager(INotificationProviderFactory<ApplicationUser> notificationProviderFactory, ISystemSetting<SecurityNotificationOptions> optionAccessor)
        {
            _notificationProviderFactory = notificationProviderFactory;
            _options = optionAccessor;
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

        public async Task RequestVerifyEmailAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var verifyEmailCallback = $"{_options.Value.VerifyEmail}?username={user.UserName}&token={encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.ApplicationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.ForgotPassword)
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
        }

        public async Task SendPasswordChangedByAdminMessageAsync(ApplicationUser user, string nameOfAdminUserWhoMadeChange)
        {
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.ApplicationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.PasswordChangedByAdmin)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.AdminUserFullName, nameOfAdminUserWhoMadeChange ?? "an Administrator")
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }
    }
}
