using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Notifications;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.BulkSms;
using ECDLink.Notifications.SendGrid;
using ECDLink.Notifications.Smtp;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Notifications.Factories
{
    public class NotificationProviderFactory : INotificationProviderFactory<ApplicationUser>
    {
        private readonly IEnumerable<INotificationProvider<ApplicationUser>> _providers;

        public NotificationProviderFactory(IEnumerable<INotificationProvider<ApplicationUser>> providers)
        {
            _providers = providers;
        }

        public INotificationProvider<ApplicationUser> Create(ApplicationUser user)
        {
            switch (user.ContactPreference)
            {
                case MessageTypeConstants.SMS:
                    {
                        var smsProvider = _providers.FirstOrDefault(p => p.GetType() == typeof(SmsSender));
                        smsProvider.AddReceiver(user);

                        return smsProvider;
                    }
                case MessageTypeConstants.EMAIL:
                    {
                        var smsProvider = _providers.FirstOrDefault(p => p.GetType() == typeof(EmailSmtpSender));
                        smsProvider.AddReceiver(user);
                        return smsProvider;
                    }
                default:
                    {
                        var emailProvider = _providers.FirstOrDefault(p => p.GetType() == typeof(EmailSmtpSender));
                        emailProvider.AddReceiver(user);

                        return emailProvider;
                    }
            }
        }
    }
}
