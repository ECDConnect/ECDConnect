using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.Notifications.Sms;
using ECDLink.Notifications.Templates;
using Microsoft.Extensions.Logging;
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

        public SmsSender(ISystemSetting<SMSPortalOptions> optionsAccessor, IMessageFactory messageFactory, TemplateProcessor templateProcessor, ILogger<SmsSenderBase> logger)
            :base(messageFactory, templateProcessor, new SMSPortalMessage(), logger)
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
            var requestContent = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            var requestContentAsString = await requestContent.ReadAsStringAsync();
            request.Content = requestContent;

            var response = await GetSmsClient.SendAsync(request, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("{0}", requestContentAsString);
            }
            else
            {
                var responseContentAsString = await response.Content.ReadAsStringAsync();
                _logger.LogError("{0}: {1}", requestContentAsString, responseContentAsString);
                throw new HttpRequestException();
            }
        }
    }
}
