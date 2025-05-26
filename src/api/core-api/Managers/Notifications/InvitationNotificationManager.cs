using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Security;
using ECDLink.Security.Helpers;
using ECDLink.Tenancy.Context;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Managers.Notifications
{
    public class InvitationNotificationManager
    {
        private INotificationProviderFactory<ApplicationUser> _notificationProviderFactory;
        private ISystemSetting<InvitationOptions> _options;

        public InvitationNotificationManager(INotificationProviderFactory<ApplicationUser> notificationProviderFactory, ISystemSetting<InvitationOptions> optionAccessor)
        {
            _notificationProviderFactory = notificationProviderFactory;
            _options = optionAccessor;
        }

        public async Task SendInvitationAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);
            var invitationEnum = TemplateTypeEnum.Invitation;
            var invitationUrl = $"{_options.Value.Signup}?token={encodedToken}";

            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(invitationEnum)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }

        public async Task SendAdminInvitationAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var invitationUrl = $"{_options.Value.AdminSignup}/{encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user, MessageTypeConstants.EMAIL);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.AdminPortalInvitation)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }

        public async Task SendPreSchoolInvitationAsync(ApplicationUser user, string principalFirstName, string preSchoolName, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);
            var tenantInfo = TenantExecutionContext.Tenant;
            var invitationEnum = TemplateTypeEnum.PreSchoolInvitation;
            var invitationUrl = $"{_options.Value.PreSchoolInvitation}?token={encodedToken}";
            
            var applicationName = tenantInfo.ApplicationName;
            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(invitationEnum)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, principalFirstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.PreSchoolName, preSchoolName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .SendMessageAsync();
        }

        public async Task SendPrincipalInvitationAsync(ApplicationUser principalUser, string practitionerFirstName, string encodedToken)
        {
            var invitationEnum = TemplateTypeEnum.PrincipalInvitation;
            var invitationUrl = $"{_options.Value.PrincipalSignup}?token={encodedToken}";

            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var notificationProvider = _notificationProviderFactory.Create(principalUser);

            await notificationProvider
              .SetMessageTemplate(invitationEnum)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, practitionerFirstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .SendMessageAsync();
        }


    }
}
