using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.Notifications.Managers;
using ECDLink.Notifications.Sms;
using ECDLink.Notifications.Templates;
using ECDLink.Security.Api.Constants;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Enums;
using ECDLink.UrlShortner.Managers;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Notifications.iTouch
{
    public class SmsSender : SmsSenderBase
    {
        private HttpClient _smsClient;
        private readonly ISystemSetting<iTouchOptions> _smsOptions;
        private readonly ShortUrlManager _shortUrlManager;
        private readonly MessageLogManager _messageLogManager;
        private readonly AppLogManager _appLogManager;

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
            MessageLogManager messageLogManager,
            AppLogManager appLogManager
            )
            :base(messageFactory, templateProcessor, new iTouchMessage(), logger)
        {
            _smsOptions = optionsAccessor;
            _shortUrlManager = shortUrlManager;
            _messageLogManager = messageLogManager;
            _appLogManager = appLogManager;
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

            var messageLogId = Guid.NewGuid();
            _message.MessageBody = await _templateProcessor
                                        .SetUserContext(_model)
                                        .SetMessageBody(_message.MessageBody)
                                        .SetMessageTemplate(_messageTemplate)
                                        .ParseMessageFilters(_fieldTransform, messageLogId)
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

            var responseContentAsString = (await response.Content.ReadAsStringAsync()).TrimEnd('\n');
            var parts = !string.IsNullOrEmpty(responseContentAsString) ? responseContentAsString.Split("&") : [];
            int notificationResult = NotificationsConstants.FAILED_OPTED_OUT;
            if (response.IsSuccessStatusCode && parts.Contains("Success"))
            {
                notificationResult = NotificationsConstants.SUCCESS;
            }
            else if (parts.Length >= 1 && parts[0] == NotificationsConstants.ITOUCH_ERROR)
            {
                if (parts[1] == NotificationsConstants.ITOUCH_ERROR_CODE_3)
                {
                    notificationResult = NotificationsConstants.FAILED_AUTHENTICATION;
                }
                else if (parts[1] == NotificationsConstants.ITOUCH_ERROR_CODE_8)
                {
                    notificationResult = NotificationsConstants.FAILED_INSUFFICIENT_CREDITS;
                }
                _logger.LogError("{0}: {1}", requestContentAsString, responseContentAsString);

                if (TenantExecutionContext.Tenant.TenantType == TenantType.OpenAccess)
                {
                    await _appLogManager.LogErrorAsync(
                        "sms",
                        $"Failed to send SMS: {responseContentAsString}",
                        _model.Id,
                        payload: responseContentAsString,
                        requestPayload: requestContentAsString);
                }
            }
            await _shortUrlManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, notificationResult, messageLogId);
            await _messageLogManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, notificationResult, ((int)response.StatusCode).ToString(), responseContentAsString, messageLogId);
            if (notificationResult != NotificationsConstants.SUCCESS)
            {
                throw new HttpRequestException();
            }
        }
    }
}
