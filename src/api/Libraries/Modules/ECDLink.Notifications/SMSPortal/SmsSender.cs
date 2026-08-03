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
using ECDLink.UrlShortner.Model;
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
        private readonly ISystemSetting<SMSPortalOptions> _smsOptions;
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

                    var apiCredentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_smsOptions.Value.ApiKey}:{_smsOptions.Value.ApiSecret}"));
                    _smsClient.DefaultRequestHeaders.Add("Authorization", $"Basic {apiCredentials}");
                }

                return _smsClient;
            }
        }

        public SmsSender(
            ISystemSetting<SMSPortalOptions> optionsAccessor, 
            IMessageFactory messageFactory, 
            TemplateProcessor templateProcessor, 
            ILogger<SmsSenderBase> logger,
            ShortUrlManager shortUrlManager,
            MessageLogManager messageLogManager,
            AppLogManager appLogManager
            )
            :base(messageFactory, templateProcessor, new SMSPortalMessage(), logger)
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

            var data = new SMSPortalMessages();
            data.Messages.Add(_message as SMSPortalMessage);

            // build the request based on the supplied settings
            var request = new HttpRequestMessage(HttpMethod.Post, "BulkMessages");
            var requestContent = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            var requestContentAsString = await requestContent.ReadAsStringAsync();
            request.Content = requestContent;

            var response = await GetSmsClient.SendAsync(request, cancellationToken);
            var responseContentAsString = await response.Content.ReadAsStringAsync();
            var resultModel = JsonConvert.DeserializeObject<PortalSMSResultWrapperModel>(responseContentAsString);

            int notificationResult;
            if (response.IsSuccessStatusCode)
            {
                notificationResult = NotificationsConstants.SUCCESS;
            }
            else
            {
                if (resultModel.ErrorReport.OptedOuts > 0)
                {
                    notificationResult = NotificationsConstants.FAILED_OPTED_OUT;
                }
                else if (resultModel.Messages == 0 && resultModel.RemainingBalance == 0)
                {
                    notificationResult = NotificationsConstants.FAILED_INSUFFICIENT_CREDITS;
                }
                else
                {
                    notificationResult = NotificationsConstants.FAILED_AUTHENTICATION;
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
