using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.MessageLogs;
using ECDLink.Notifications.Model;
using ECDLink.Notifications.Sms;
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
    public class SmsSender : SmsSenderBase
    {
        private readonly IMessageLogger<BulkSmsMessage> _messageLogger;
        private HttpClient _smsClient;
        private ISystemSetting<BulkSmsOptions> _smsOptions;


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
               : base(messageFactory, templateProcessor, new BulkSmsMessage())
        {
            _smsOptions = optionsAccessor;
            _messageLogger = messageLogger;
            _fieldTransform = new Dictionary<string, string>();
        }

        override public async Task SendMessageAsync(CancellationToken cancellationToken = default)
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
            var message = JsonConvert.SerializeObject(_message);
            request.Content = new StringContent(message, Encoding.UTF8, "application/json");

            var response = await GetSmsClient.SendAsync(request, cancellationToken);
            
            _messageLogger.Log(_message as BulkSmsMessage, _messageTemplate.TemplateType);

            if (response.IsSuccessStatusCode)
            {
                // TODO: Something with the SMS reply
            }
            else
            {
                Console.Error.WriteLine("Error sending SMS: {0}", message);
                Console.Error.WriteLine("Error sending SMS - Response Code: {0}", response.StatusCode);
                var responseContent = await response.Content.ReadAsStringAsync();
                Console.Error.WriteLine("Error sending SMS - Response Content: {0}", responseContent);
                throw new HttpRequestException();
            }
        }
    }
}
