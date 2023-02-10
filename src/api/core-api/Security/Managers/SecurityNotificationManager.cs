using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security.Helpers;
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

            await provider.SetMessageTemplate(TemplateTypeEnum.AuthCode)
                .AddFieldReplacement("code", otp)
                .SendMessageAsync();
        }

        public async Task SendForgotPasswordMessageAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var forgotPasswordCallback = $"{_options.Value.ForgotPassword}?username={user.UserName}&token={encodedToken}";

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.ForgotPassword)
              .AddFieldReplacement("callback", forgotPasswordCallback)
              .SendMessageAsync();
        }
    }
}
