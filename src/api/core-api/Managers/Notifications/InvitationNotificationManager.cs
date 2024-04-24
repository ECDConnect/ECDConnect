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

            var invitationUrl = $"{_options.Value.Signup}?token={encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.Invitation)
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

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.AdminPortalInvitation)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }

        public async Task SendTeamLeadInvitationAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var invitationUrl = $"{_options.Value.TeamLeadSignup}{encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.TeamLeadInvitation)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }

        public async Task SendSMSAsync(ApplicationUserManager userManager, ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var userIsTL = await userManager.IsInRoleAsync(user, RolesGG.TEAM_LEAD);

            var invitationUrl = userIsTL ? $"{_options.Value.TeamLeadSignup}/{encodedToken}" : $"{_options.Value.AdminSignup}/{encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.AdminPortalInvitation)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }


    }
}
