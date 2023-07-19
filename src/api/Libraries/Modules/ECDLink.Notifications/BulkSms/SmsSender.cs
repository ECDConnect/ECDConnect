using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.MessageLogs;
using ECDLink.Notifications.Model;
using ECDLink.Notifications.Templates;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Notifications.BulkSms
{
    public class SmsSender : NotificationBase<ApplicationUser>, INotificationProvider<ApplicationUser>
    {
        private readonly IMessageFactory _messageFactory;
        private readonly TemplateProcessor _templateProcessor;
        private readonly IMessageLogger<BulkSmsMessage> _messageLogger;
        private HttpClient _smsClient;

        private ISystemSetting<BulkSmsOptions> _smsOptions;

        private BulkSmsMessage _message;

        private HttpClient GetSmsClient
        {
            get
            {
                if (_smsClient == null)
                {
                    _smsClient = new HttpClient();
                    _smsClient.BaseAddress = new Uri(_smsOptions.Value.BaseUrl);

                    _smsClient.DefaultRequestHeaders.Add("Accept", "application/json");
                    _smsClient.DefaultRequestHeaders.Add("Authorization", $"Basic {_smsOptions.Value.BasicAuthToken}");
                }

                return _smsClient;
            }
        }

        public SmsSender(ISystemSetting<BulkSmsOptions> optionsAccessor, IMessageFactory messageFactory, TemplateProcessor templateProcessor, IMessageLogger<BulkSmsMessage> messageLogger)
        {
            _smsOptions = optionsAccessor;
            _messageFactory = messageFactory;
            _templateProcessor = templateProcessor;
            _messageLogger = messageLogger;
            _message = new BulkSmsMessage();
            _fieldTransform = new Dictionary<string, string>();
        }

        public async Task SendMessageAsync(CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(_message.To))
            {
                throw new KeyNotFoundException("No receiver address specified");
            }

            if (string.IsNullOrEmpty(_message.MessageBody))
            {
                throw new KeyNotFoundException("No message template found");
            }

            if (cancellationToken.IsCancellationRequested)
                return;

            _message.MessageBody = _templateProcessor
                                        .SetUserContext(_model)
                                        .SetMessageBody(_message.MessageBody)
                                        .SetMessageTemplate(_messageTemplate)
                                        .ParseMessageFilters(_fieldTransform)
                                        .ProcessBody();

            // build the request based on the supplied settings
            var request = new HttpRequestMessage(HttpMethod.Post, "messages");

            request.Content = new StringContent(JsonConvert.SerializeObject(_message), Encoding.UTF8, "application/json");

            var response = await GetSmsClient.SendAsync(request, cancellationToken);
            
            _messageLogger.Log(_message, _messageTemplate.TemplateType);

            if (response.IsSuccessStatusCode)
            {
                // TODO: Something with the SMS reply
            }
            else
            {
                throw new HttpRequestException();
            }
        }

        public INotificationProvider<ApplicationUser> AddReceiver(ApplicationUser receiver)
        {
            _message.To = receiver.PhoneNumber;
            _model = receiver;
            return this;
        }

        public INotificationProvider<ApplicationUser> SetMessageTemplate(TemplateTypeEnum template)
        {
            var messageTemplate = GetTemplate(template);
            _message.MessageBody = messageTemplate.Message;

            _messageTemplate = messageTemplate;

            base.AddUserFieldOverrides(messageTemplate.Message);

            return this;
        }

        public INotificationProvider<ApplicationUser> AddOrUpdateFieldReplacement(string key, string value)
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

        private IMessageTemplate GetTemplate(TemplateTypeEnum template)
        {
            return _messageFactory.GetMessageTemplate(MessageProtocolEnum.Sms, template);
        }

        public INotificationProvider<ApplicationUser> OverrideSender(string sender)
        {
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetMessageMetaData<T>(T type) where T : IMessageMetaData
        {
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetSubject(string sender)
        {
            throw new NotImplementedException();
        }

        // TODO: Should phone number be verified before being changed?
        public INotificationProvider<ApplicationUser> UsePendingReceiver(ApplicationUser receiver)
        {
            _message.To = receiver.PendingPhoneNumber ?? receiver.PhoneNumber ?? receiver.WhatsAppNumber;
            _model = receiver;

            return this;
        }
    }
}
