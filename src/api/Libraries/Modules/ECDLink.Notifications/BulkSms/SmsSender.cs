using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.Notifications.Managers;
using ECDLink.Notifications.MessageLogs;
using ECDLink.Notifications.Sms;
using ECDLink.Notifications.Templates;
using ECDLink.Security.Api.Constants;
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
        private ISystemSetting<BulkSmsOptions> _smsOptions;
        private readonly ShortUrlManager _shortUrlManager;
        private readonly MessageLogManager _messageLogManager;

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
            MessageLogManager messageLogManager
            )
               : base(messageFactory, templateProcessor, new BulkSmsMessage(), logger)
        {
            _smsOptions = optionsAccessor;
            _messageLogger = messageLogger;
            _fieldTransform = new Dictionary<string, string>();
            _shortUrlManager = shortUrlManager;
            _messageLogManager = messageLogManager;
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

            _message.MessageBody = _templateProcessor
                                        .SetUserContext(_model)
                                        .SetMessageBody(_message.MessageBody)
                                        .SetMessageTemplate(_messageTemplate)
                                        .ParseMessageFilters(_fieldTransform)
                                        .ProcessBody();

            // build the request based on the supplied settings
            var request = new HttpRequestMessage(HttpMethod.Post, "messages");
            var message = JsonConvert.SerializeObject(_message);
            var requestContent = new StringContent(message, Encoding.UTF8, "application/json");
            var requestContentAsString = await requestContent.ReadAsStringAsync();
            request.Content = requestContent;

            var response = await GetSmsClient.SendAsync(request, cancellationToken);
            
            _messageLogger.Log(_message as BulkSmsMessage, _messageTemplate.TemplateType);

            if (response.IsSuccessStatusCode)
            {
                _shortUrlManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.SUCCESS);
                _messageLogManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.SUCCESS);
                _logger.LogInformation("{0}", requestContentAsString);
            }
            else
            {
                var responseContentAsString = await response.Content.ReadAsStringAsync();
                var resultModel = JsonConvert.DeserializeObject<BulkSMSResultWrapperModel>(responseContentAsString);

                if (resultModel.Status.StartsWith("5")) 
                {
                    _shortUrlManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_CONNECTION);
                    _messageLogManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_CONNECTION);
                } 
                else if (resultModel.Title == NotificationsConstants.BULKSMS_AUTH)
                {
                    _shortUrlManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_AUTHENTICATION);
                    _messageLogManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_AUTHENTICATION);
                } 
                else if (resultModel.Title == NotificationsConstants.BULKSMS_CREDITS)
                {
                    _shortUrlManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_INSUFFICIENT_CREDITS);
                    _messageLogManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_INSUFFICIENT_CREDITS);
                } 
                else
                {
                    _shortUrlManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_OPTED_OUT);
                    _messageLogManager.UpdateMessageNotificationResult(_model.Id, _messageTemplate.TemplateType, NotificationsConstants.FAILED_OPTED_OUT);
                }
                
                _logger.LogError("{0}: {1}", requestContentAsString, responseContentAsString);
                throw new HttpRequestException();
            }
        }
    }
}
