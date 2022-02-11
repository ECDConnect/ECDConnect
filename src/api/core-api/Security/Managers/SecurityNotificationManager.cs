using EcdLink.Api.CoreApi.Security.Models;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security.Helpers;
using Microsoft.Extensions.Options;

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

        public void SendAuthenticationCode(ApplicationUser user, string otp)
        {
            var provider = _notificationProviderFactory.Create(user);

            provider.SetMessageTemplate(TemplateTypeEnum.AuthCode)
                .AddFieldReplacement("code", otp)
                .SendMessage()
                .Wait();
        }

        public void SendForgotPasswordMessage(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var forgotPasswordCallback = $"{_options.Value.ForgotPassword}?username={user.UserName}&token={encodedToken}";

            var notificationProvider = _notificationProviderFactory.Create(user);

            notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.ForgotPassword)
              .AddFieldReplacement("callback", forgotPasswordCallback)
              .SendMessage()
              .Wait();
        }
    }
}
