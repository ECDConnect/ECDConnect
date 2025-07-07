using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.Model;
using ECDLink.Notifications.Templates;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Notifications.Sms
{
    public class SmsSenderBase : NotificationBase<ApplicationUser>, INotificationProvider<ApplicationUser>
    {
        protected readonly IMessageFactory _messageFactory;
        protected readonly TemplateProcessor _templateProcessor;
        protected IMessage _message;
        protected ILogger<SmsSenderBase> _logger;

        public SmsSenderBase(IMessageFactory messageFactory, TemplateProcessor templateProcessor, IMessage message, ILogger<SmsSenderBase> logger)
        {
            _messageFactory = messageFactory;
            _templateProcessor = templateProcessor;
            _message = message;
            _fieldTransform = new Dictionary<string, string>();
            _logger = logger;
        }

        virtual public async Task SendMessageAsync(CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        virtual public INotificationProvider<ApplicationUser> AddReceiver(ApplicationUser receiver)
        {
            _message.To = receiver.PhoneNumber;
            _model = receiver;
            return this;
        }

        virtual public INotificationProvider<ApplicationUser> SetMessageTemplate(TemplateTypeEnum template)
        {
            var messageTemplate = GetTemplate(template);
            _message.MessageBody = messageTemplate.Message;

            _messageTemplate = messageTemplate;

            base.AddUserFieldOverrides(messageTemplate.Message);

            return this;
        }

        public INotificationProvider<ApplicationUser> SetMessageMapped(TemplateTypeEnum template, string subject, string message)
        {
            var messageTemplate = GetTemplate(template);
            _message.MessageBody = message;

            _messageTemplate = messageTemplate;

            return this;
        }


        virtual public INotificationProvider<ApplicationUser> AddOrUpdateFieldReplacement(string key, string value)
        {
            if (_fieldTransform.ContainsKey(key))
            {
                _fieldTransform[key] = value;
            }
            else
            {
                _fieldTransform.Add(key, value);
            }

            return this;
        }

        virtual protected IMessageTemplate GetTemplate(TemplateTypeEnum template)
        {
            return _messageFactory.GetMessageTemplate(MessageProtocolEnum.Sms, template);
        }

        virtual public INotificationProvider<ApplicationUser> OverrideSender(string sender)
        {
            throw new NotImplementedException();
        }

        virtual public INotificationProvider<ApplicationUser> SetMessageMetaData<T>(T type) where T : IMessageMetaData
        {
            throw new NotImplementedException();
        }

        virtual public INotificationProvider<ApplicationUser> SetSubject(string sender)
        {
            throw new NotImplementedException();
        }

        // TODO: Should phone number be verified before being changed?
        virtual public INotificationProvider<ApplicationUser> UsePendingReceiver(ApplicationUser receiver)
        {
            _message.To = receiver.PendingPhoneNumber;
            _model = receiver;

            return this;
        }
    }
}
