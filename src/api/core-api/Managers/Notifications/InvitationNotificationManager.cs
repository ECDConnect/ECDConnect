using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security.Helpers;

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

        public void SendInvitation(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var invitationUrl = $"{_options.Value.Signup}?token={encodedToken}";

            var notificationProvider = _notificationProviderFactory.Create(user);

            notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.Invitation)
              .AddFieldReplacement("callback", invitationUrl)
              .SendMessage()
              .Wait();
        }

    }
}
