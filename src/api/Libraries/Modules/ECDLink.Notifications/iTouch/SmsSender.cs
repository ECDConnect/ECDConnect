using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.Notifications.Managers;
using ECDLink.Notifications.MessageLogs;
using ECDLink.Notifications.Sms;
using ECDLink.Notifications.Templates;
using ECDLink.Security.Api.Constants;
using ECDLink.UrlShortner.Managers;
using Microsoft.Extensions.Logging;
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
        private readonly ShortUrlManager _shortUrlManager;
        private readonly MessageLogManager _messageLogManager;

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

        public SmsSender(
            ISystemSetting<iTouchOptions> optionsAccessor, 
            IMessageFactory messageFactory, 
            TemplateProcessor templateProcessor, 
            ILogger<SmsSenderBase> logger,
            ShortUrlManager shortUrlManager,
            MessageLogManager messageLogManager
            )
            :base(messageFactory, templateProcessor, new iTouchMessage(), logger)
        {
            _smsOptions = optionsAccessor;
            _shortUrlManager = shortUrlManager;
            _messageLogManager = messageLogManager;
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

            var requestContent = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("UserId", _smsOptions.Value.Username),
                    new KeyValuePair<string, string>("Password", _smsOptions.Value.Password),
                    new KeyValuePair<string, string>("PhoneNumber", _message.To),
                    new KeyValuePair<string, string>("MessageText", _message.MessageBody)
                });
            var requestContentAsString = await requestContent.ReadAsStringAsync();

            var response = await GetSmsClient.PostAsync(
                $"{_smsOptions.Value.BaseUrl}/Submit",
                requestContent,
                cancellationToken);

            var responseContentAsString = "";
            var success = false;
            var parts = new string[1];
            if (response.IsSuccessStatusCode)
            {
                responseContentAsString = (await response.Content.ReadAsStringAsync()).TrimEnd('\n');
                parts = responseContentAsString.Split("&");
                if (parts.Length >= 1 && parts[0] == "Success")
                {
                    success = true;
                }
            }
            if (success)
            {
                _shortUrlManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.SUCCESS);
                _messageLogManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.SUCCESS);
                _logger.LogInformation("{0}: {1}", requestContentAsString, responseContentAsString);
            }
            else
            {
                if (parts.Length >= 1 && parts[0] == NotificationsConstants.ITOUCH_ERROR)
                {
                    if (parts[1] == NotificationsConstants.ITOUCH_ERROR_CODE_3)
                    {
                        _shortUrlManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_AUTHENTICATION);
                        _messageLogManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_AUTHENTICATION);
                    }
                    else if (parts[1] == NotificationsConstants.ITOUCH_ERROR_CODE_8)
                    {
                        _shortUrlManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_INSUFFICIENT_CREDITS);
                        _messageLogManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_INSUFFICIENT_CREDITS);
                    }
                }
                _logger.LogError("{0}: {1}", requestContentAsString, responseContentAsString);
                throw new HttpRequestException();
            }
           
        }
    }
}
