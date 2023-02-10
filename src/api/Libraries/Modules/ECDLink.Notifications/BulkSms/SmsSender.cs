using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.Model;
using ECDLink.Notifications.Templates;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.Notifications.BulkSms
{
    public class SmsSender : NotificationBase<ApplicationUser>, INotificationProvider<ApplicationUser>
    {
        private readonly IMessageFactory _messageFactory;
        private readonly TemplateProcessor _templateProcessor;
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

        public SmsSender(ISystemSetting<BulkSmsOptions> optionsAccessor, IMessageFactory messageFactory, TemplateProcessor templateProcessor)
        {
            _smsOptions = optionsAccessor;
            _messageFactory = messageFactory;
            _templateProcessor = templateProcessor;
            _message = new BulkSmsMessage();
            _fieldTransform = new Dictionary<string, string>();
        }

        public async Task SendMessageAsync()
        {
            if (string.IsNullOrEmpty(_message.To))
            {
                throw new KeyNotFoundException("No receiver address specified");
            }

            if (string.IsNullOrEmpty(_message.MessageBody))
            {
                throw new KeyNotFoundException("No message template found");
            }

            _message.MessageBody = _templateProcessor
                                        .SetUserContext(_model)
                                        .SetMessageBody(_message.MessageBody)
                                        .SetMessageTemplate(_messageTemplate)
                                        .ParseMessageFilters(_fieldTransform)
                                        .Process();

            // build the request based on the supplied settings
            var request = new HttpRequestMessage(HttpMethod.Post, "messages");

            request.Content = new StringContent(JsonConvert.SerializeObject(_message), Encoding.UTF8, "application/json");

            var response = await GetSmsClient.SendAsync(request);

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

        public INotificationProvider<ApplicationUser> AddFieldReplacement(string key, string value)
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
            return _messageFactory.GetMessage(MessageTypeEnum.Sms, template);
        }

        public INotificationProvider<ApplicationUser> OverrideSender(string sender)
        {
            throw new System.NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetMessageMetaData<T>(T type) where T : IMessageMetaData
        {
            throw new System.NotImplementedException();
        }
    }
}
