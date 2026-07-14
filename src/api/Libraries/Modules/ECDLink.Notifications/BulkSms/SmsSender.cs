using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.Notifications.Managers;
using ECDLink.Notifications.MessageLogs;
using ECDLink.Notifications.Sms;
using ECDLink.Notifications.Templates;
using ECDLink.Security.Api.Constants;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Enums;
using ECDLink.UrlShortner.Managers;
using ECDLink.UrlShortner.Model;
using Microsoft.Extensions.Logging;
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
        private readonly ISystemSetting<BulkSmsOptions> _smsOptions;
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
                    _smsClient.BaseAddress = new Uri(_smsOptions.Value.BaseUrl);
                    _smsClient.DefaultRequestHeaders.Add("Accept", "application/json");
                    var basicAuthToken = _smsOptions.Value.BasicAuthToken;
                    if (basicAuthToken.StartsWith("Basic "))
                    {
                      _smsClient.DefaultRequestHeaders.Add("Authorization", basicAuthToken);
                    }
                    else
                    {
                      _smsClient.DefaultRequestHeaders.Add("Authorization", $"Basic {basicAuthToken}");
                    }
                }

                return _smsClient;
            }
        }

        public SmsSender(
            ISystemSetting<BulkSmsOptions> optionsAccessor, 
            IMessageFactory messageFactory, 
            TemplateProcessor templateProcessor, 
            IMessageLogger<BulkSmsMessage> messageLogger, 
            ILogger<SmsSenderBase> logger,
            ShortUrlManager shortUrlManager,
            MessageLogManager messageLogManager,
            AppLogManager appLogManager
            )
               : base(messageFactory, templateProcessor, new BulkSmsMessage(), logger)
        {
            _smsOptions = optionsAccessor;
            _messageLogger = messageLogger;
            _fieldTransform = new Dictionary<string, string>();
            _shortUrlManager = shortUrlManager;
            _messageLogManager = messageLogManager;
            _appLogManager = appLogManager;
        }

        override public async Task SendMessageAsync(CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(_message.To))
            {
                _logger.LogError("No receiver address specified");
                throw new KeyNotFoundException("No receiver address specified");
            }

            if (string.IsNullOrEmpty(_message.MessageBody))
            {
                _logger.LogError("No message template found");
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

            // build the request based on the supplied settings
            var request = new HttpRequestMessage(HttpMethod.Post, "messages");
            var message = JsonConvert.SerializeObject(_message);
            var requestContent = new StringContent(message, Encoding.UTF8, "application/json");
            var requestContentAsString = await requestContent.ReadAsStringAsync();
            request.Content = requestContent;

            var response = await GetSmsClient.SendAsync(request, cancellationToken);
            await _messageLogger.LogAsync(_message as BulkSmsMessage, _messageTemplate.TemplateType, messageLogId);
            var responseContentAsString = await response.Content.ReadAsStringAsync();

            int notificationResult;
            if (response.IsSuccessStatusCode)
            {
                notificationResult = NotificationsConstants.SUCCESS;
            }
            else
            {
                var resultModel = JsonConvert.DeserializeObject<BulkSMSResultWrapperModel>(responseContentAsString);

                if (resultModel.Status.StartsWith("5"))
                {
                    notificationResult = NotificationsConstants.FAILED_CONNECTION;
                }
                else if (resultModel.Title == NotificationsConstants.BULKSMS_AUTH)
                {
                    notificationResult = NotificationsConstants.FAILED_AUTHENTICATION;
                }
                else if (resultModel.Title == NotificationsConstants.BULKSMS_CREDITS)
                {
                    notificationResult = NotificationsConstants.FAILED_INSUFFICIENT_CREDITS;
                }
                else
                {
                    notificationResult = NotificationsConstants.FAILED_OPTED_OUT;
                }

                _logger.LogError("{0}: {1}", requestContentAsString, responseContentAsString);

                if (TenantExecutionContext.Tenant.TenantType == TenantType.OpenAccess)
                {
                    await _appLogManager.LogErrorAsync(
                        "sms",
                        $"Failed to send SMS: {resultModel.Title ?? responseContentAsString}",
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
