using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.Notifications.Sms;
using ECDLink.Notifications.Templates;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Notifications.iTouch
{
    public class SmsSender : SmsSenderBase
    {
        private HttpClient _smsClient;
        private ISystemSetting<iTouchOptions> _smsOptions;

        private HttpClient GetSmsClient
        {
            get
            {
                if (_smsClient == null)
                {
                    _smsClient = new HttpClient();
                }

                return _smsClient;
            }
        }

        public SmsSender(ISystemSetting<iTouchOptions> optionsAccessor, IMessageFactory messageFactory, TemplateProcessor templateProcessor)
            :base(messageFactory, templateProcessor, new iTouchMessage())
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

            var response = await GetSmsClient.PostAsync(
                $"{_smsOptions.Value.BaseUrl}/Logon",
                new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("UserId", _smsOptions.Value.Username),
                    new KeyValuePair<string, string>("Password", _smsOptions.Value.Password)
                }),
                cancellationToken);

            var responseBody = "";
            var success = false;
            if (response.IsSuccessStatusCode)
            {
                responseBody = await response.Content.ReadAsStringAsync();
                var parts = responseBody.Split("&");
                if (parts.Length > 1 && parts[0] == "Success")
                {
                    var sessionId = parts[1].Split('=')[1];

                    response = await GetSmsClient.PostAsync(
                        $"{_smsOptions.Value.BaseUrl}/Submit",
                        new FormUrlEncodedContent(new[]
                        {
                            new KeyValuePair<string, string>("SessionID", sessionId),
                            new KeyValuePair<string, string>("PhoneNumber", _message.To),
                            new KeyValuePair<string, string>("MessageText", _message.MessageBody)
                        }),
                        cancellationToken);
                    if (response.IsSuccessStatusCode)
                    {
                        responseBody = await response.Content.ReadAsStringAsync();
                        parts = responseBody.Split("&");
                        if (parts.Length > 1 && parts[0] == "Success")
                        {
                            success = true;
                        }
                    }
                    await GetSmsClient.PostAsync(
                        $"{_smsOptions.Value.BaseUrl}/Logoff",
                        new FormUrlEncodedContent(new[]
                        {
                            new KeyValuePair<string, string>("SessionID", sessionId),
                        }),
                        cancellationToken);
                }
            }

            if (success)
            {
                var message = JsonConvert.SerializeObject(_message);
                Console.Error.WriteLine("Error sending SMS: {0}", message);
                Console.Error.WriteLine("Error sending SMS - Response Code: {0}", response.StatusCode);
                Console.Error.WriteLine("Error sending SMS - Response Content: {0}", responseBody);
                throw new HttpRequestException();
            }
        }
    }
}
