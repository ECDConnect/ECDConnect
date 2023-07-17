using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.Notifications.Sms;
using ECDLink.Notifications.Templates;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Notifications.SMSPortal
{
    public class SmsSender : SmsSenderBase
    {
        private HttpClient _smsClient;
        private ISystemSetting<SMSPortalOptions> _smsOptions;

        private HttpClient GetSmsClient
        {
            get
            {
                if (_smsClient == null)
                {
                    _smsClient = new HttpClient();
                    _smsClient.BaseAddress = new Uri(_smsOptions.Value.BaseUrl);

                    _smsClient.DefaultRequestHeaders.Add("Accept", "application/json");

                    var apiCredentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_smsOptions.Value.ApiKey}:{_smsOptions.Value.ApiSecret}"));
                    _smsClient.DefaultRequestHeaders.Add("Authorization", $"Basic {apiCredentials}");
                }

                return _smsClient;
            }
        }

        public SmsSender(ISystemSetting<SMSPortalOptions> optionsAccessor, IMessageFactory messageFactory, TemplateProcessor templateProcessor)
            :base(messageFactory, templateProcessor, new SMSPortalMessage())
        {
            _smsOptions = optionsAccessor;
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

            var data = new SMSPortalMessages();
            data.Messages.Add(_message as SMSPortalMessage);

            // build the request based on the supplied settings
            var request = new HttpRequestMessage(HttpMethod.Post, "BulkMessages");
            var requestContent = JsonConvert.SerializeObject(data);
            request.Content = new StringContent(requestContent, Encoding.UTF8, "application/json");

            var response = await GetSmsClient.SendAsync(request, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                // TODO: Something with the SMS reply
            }
            else
            {
                Console.Error.WriteLine("Error sending SMS: {0}", requestContent);
                Console.Error.WriteLine("Error sending SMS - Response Code: {0}", response.StatusCode);
                var responseContent = await response.Content.ReadAsStringAsync();
                Console.Error.WriteLine("Error sending SMS - Response Content: {0}", responseContent);
                throw new HttpRequestException();
            }
        }
    }
}
