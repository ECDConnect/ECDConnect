using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.Model;
using ECDLink.Notifications.Smtp;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Notifications.Factories
{
    public class NotificationProviderFactory : INotificationProviderFactory<ApplicationUser>
    {
        private readonly IServiceProvider _services;
        private readonly ISystemSetting<SmsOptions> _options;

        public NotificationProviderFactory(IServiceProvider services, ISystemSetting<SmsOptions> options)
        {
            _services = services;
            _options = options;
        }

        public INotificationProvider<ApplicationUser> Create(ApplicationUser user, string overrideMessageType = null)
        {
            var actualMessageType = string.IsNullOrWhiteSpace(overrideMessageType) 
                ? user.ContactPreference?.ToLower()
                : overrideMessageType?.ToLower();

            INotificationProvider<ApplicationUser> provider = null;
            switch (actualMessageType)
            {
                case MessageTypeConstants.SMS:
                    {
                        provider = GetSmsProvider();
                        break;
                    }
                case MessageTypeConstants.EMAIL:
                    {
                        provider = _services.GetService<EmailSmtpSender>();
                        break;
                    }   
                default:
                    {
                        provider = _services.GetService<EmailSmtpSender>();
                        break;
                    }
            }
            if (provider != null) provider.AddReceiver(user);
            return provider;
        }

        private INotificationProvider<ApplicationUser> GetSmsProvider()
        {
            switch (_options.Value.Provider)
            {
                case "Notifications.SMSProviders.BulkSms":
                case "BulkSms":
                    return _services.GetService<BulkSms.SmsSender>();
                case "Notifications.SMSProviders.SMSPortal":
                case "SMSPortal":
                    return _services.GetService<SMSPortal.SmsSender>();
                case "Notifications.SMSProviders.iTouch":
                case "iTouch":
                    return _services.GetService<iTouch.SmsSender>();
                default:
                    return _services.GetService<NoSms.SmsSender>();
            }
        }

    }
}
