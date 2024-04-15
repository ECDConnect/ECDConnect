using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.MessageLogs;
using ECDLink.Notifications.Model;
using ECDLink.Notifications.Templates;
using MailKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Notifications.Smtp
{
    public class EmailSmtpSender : NotificationBase<ApplicationUser>, INotificationProvider<ApplicationUser>
    {
        private readonly IMessageFactory _messageFactory;
        private readonly TemplateProcessor _templateProcessor;
        private readonly ILogger<EmailSmtpSender> _logger;
        private readonly EmailSmtpOptions _optionsAccessor;
        private EmailMessage _message;
        private IWebHostEnvironment _currentEnvironment;
        private bool _smtpDisabled;
        private readonly IMessageLogger<IEmailMessage> _messageLogger;

        public EmailSmtpSender(
            IMessageFactory messageFactory,
            IConfiguration configuration,
            TemplateProcessor templateProcessor,
            ISystemSetting<EmailSmtpOptions> optionsAccessor,
            IWebHostEnvironment environment,
            ILogger<EmailSmtpSender> logger,
            IMessageLogger<IEmailMessage> messageLogger)
        {
            _messageFactory = messageFactory;
            _templateProcessor = templateProcessor;
            _logger = logger;
            _optionsAccessor = optionsAccessor?.Value;
            _smtpDisabled = _optionsAccessor is null || _optionsAccessor.Disabled;
            _messageLogger = messageLogger;

            _fieldTransform = new Dictionary<string, string>();
            _message = new EmailMessage();
            _currentEnvironment = environment;
        }

        public async Task SendMessageAsync(CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(_optionsAccessor.SmtpServerAddress))
            {
                _logger.LogWarning("SMTP Server not configured");
                throw new Exception("SMTP Server not configured");
            }
            if (string.IsNullOrEmpty(_message.To))
            {
                throw new KeyNotFoundException("No receiver address specified");
            }

            if (string.IsNullOrEmpty(_message.MessageBody))
            {
                throw new KeyNotFoundException("No message template found");
            }

            if (!_smtpDisabled)
            {
                _templateProcessor.SetUserContext(_model)
                            .SetMessageTemplate(_messageTemplate)
                            .SetMessageBody(_message.MessageBody)
                            .SetMessageSubject(_message.Subject)
                            .ParseMessageFilters(_fieldTransform);

                var emailMessage = _templateProcessor.ProcessBody();
                var processedSubject = _templateProcessor.ProcessSubject();

                // Specify the email sender.
                MailboxAddress from = new MailboxAddress(
                    _optionsAccessor?.FromEmailDisplayName ?? "ECD Connect",
                    _optionsAccessor?.FromEmail);

                MailboxAddress to;
                if (string.IsNullOrWhiteSpace(_optionsAccessor.DevOverrideEmailAddress))
                {
                    to = new MailboxAddress(
                        _message.ToDisplayName ?? _message.To,
                        _message.To);
                }
                else
                {
                    to = new MailboxAddress((_message.ToDisplayName ?? _message.To) + " (Override)", _optionsAccessor.DevOverrideEmailAddress);
                }

                var builder = new BodyBuilder();
                builder.TextBody = emailMessage;
                builder.HtmlBody = emailMessage;

                var message = new MimeMessage();
                message.From.Add(from);
                message.To.Add(to);
                message.Subject = processedSubject;
                message.Body = builder.ToMessageBody();

                // Create the client and send email.
                using var client = new SmtpClient();
                try
                {
                    await client.ConnectAsync(_optionsAccessor.SmtpServerAddress, _optionsAccessor.SmtpServerPort, _optionsAccessor.SmtpServerUseTLS ? SecureSocketOptions.Auto : SecureSocketOptions.None, cancellationToken);
                }
                catch (Exception exception)
                {
                    _logger.LogError(exception, "Could not connect to STMP Server {0}. Mail not sent.", _optionsAccessor.SmtpServerAddress);
                    throw;
                }

                // AuthenticateAsync only needed if the SMTP server requires authentication
                if (!string.IsNullOrEmpty(_optionsAccessor?.Username)
                    && !string.IsNullOrEmpty(_optionsAccessor?.Password))
                {
                    try
                    {
                        await client.AuthenticateAsync(_optionsAccessor.Username, _optionsAccessor.Password, cancellationToken);
                    }
                    catch (Exception exception)
                    {
                        _logger.LogError(exception, "Could not authenticate using {0} with STMP Server {1}. Mail not sent.", _optionsAccessor?.Username, _optionsAccessor.SmtpServerAddress);
                        throw;
                    }
                }

                var emailRetryWaitMs = _optionsAccessor?.RetryWaitMiliseconds ?? 300;

                string messageTo = message?.To?.FirstOrDefault().ToString();
                // Send message
                try
                {
                    _logger.LogDebug("Sending email to {0} using {1} ", messageTo, _optionsAccessor.SmtpServerAddress);
                    var mailServerResponse = await client.SendAsync(message, cancellationToken);
                    _logger.LogInformation("Sending email to {0} using {1}, response: {2}", message?.To.FirstOrDefault(), _optionsAccessor.SmtpServerAddress, mailServerResponse);
                }
                catch (IOException ioException)
                {
                    _logger.LogWarning(ioException, "Failed sending email to {0} using {1}, retrying in: {2}ms", messageTo, _optionsAccessor.SmtpServerAddress, emailRetryWaitMs);
                    await Task.Delay(emailRetryWaitMs);
                    _logger.LogDebug("Retry sending email to {0} using {1} ", messageTo, _optionsAccessor.SmtpServerAddress);
                    var mailServerResponse = await client.SendAsync(message, cancellationToken);
                    _logger.LogInformation("Sending email to {0} using {1}, response: {2}", message?.To.FirstOrDefault(), _optionsAccessor.SmtpServerAddress, mailServerResponse);
                }
                catch (ProtocolException protocolException)
                {
                    _logger.LogWarning(protocolException, "Failed (protocol exception) sending email to {0} using {1}, retrying in: {2}ms", messageTo, _optionsAccessor.SmtpServerAddress, emailRetryWaitMs);
                    await Task.Delay(emailRetryWaitMs);

                    if (client.IsConnected)
                    {
                        _logger.LogDebug("Retry sending email to {0} using {1} ", messageTo, _optionsAccessor.SmtpServerAddress);
                        var mailServerResponse = await client.SendAsync(message, cancellationToken);
                        _logger.LogInformation("Sending email to {0} using {1}, response: {2}", message?.To.FirstOrDefault(), _optionsAccessor.SmtpServerAddress, mailServerResponse);
                    }
                    else
                    {
                        _logger.LogInformation("Reconnecting to {0}.", _optionsAccessor.SmtpServerAddress);
                        await client.ConnectAsync(_optionsAccessor.SmtpServerAddress, _optionsAccessor.SmtpServerPort, _optionsAccessor.SmtpServerUseTLS);
                        _logger.LogDebug("Retry sending email to {0} using {1} ", messageTo, _optionsAccessor.SmtpServerAddress);
                        var mailServerResponse = await client.SendAsync(message, cancellationToken);
                        _logger.LogInformation("Sending email to {0} using {1}, response: {2}", message?.To.FirstOrDefault(), _optionsAccessor.SmtpServerAddress, mailServerResponse);
                    }
                }
                catch (Exception exception)
                {
                    _logger.LogError(exception, "Fatal error sending email to {0} via {1}. Giving up.", messageTo, _optionsAccessor.SmtpServerAddress);
                }

                // Close client (TODO: should this be pooled)
                await client.DisconnectAsync(true, cancellationToken);
                try
                {
                    _messageLogger.Log(_message, _messageTemplate?.TemplateType);
                } catch (Exception exception)
                {
                    _logger.LogError(exception, "Error logging email message: TemplateType: {templateType}", _messageTemplate?.TemplateType);
                }
            }
        }

        public INotificationProvider<ApplicationUser> AddReceiver(ApplicationUser receiver)
        {
            _message.To = receiver.Email;
            _message.ToDisplayName = receiver.FullName;
            _model = receiver;
            return this;
        }

        public INotificationProvider<ApplicationUser> SetMessageTemplate(TemplateTypeEnum template)
        {
            var messageTemplate = GetTemplate(template);
            _message.MessageBody = messageTemplate.Message;
            _message.Subject = messageTemplate.Subject;

            _messageTemplate = messageTemplate;

            base.AddUserFieldOverrides(messageTemplate.Message);

            return this;
        }

        public INotificationProvider<ApplicationUser> SetMessageMapped(TemplateTypeEnum template, string subject, string message)
        {
            var messageTemplate = GetTemplate(template);
            _message.MessageBody = message;
            _message.Subject = subject;

            _messageTemplate = messageTemplate;

            return this;
        }

        public INotificationProvider<ApplicationUser> AddOrUpdateFieldReplacement(string key, string value)
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
            return _messageFactory.GetMessageTemplate(MessageProtocolEnum.Email, template);
        }

        public INotificationProvider<ApplicationUser> OverrideSender(string sender)
        {
            _message.From = sender;

            return this;
        }

        public INotificationProvider<ApplicationUser> UsePendingReceiver(ApplicationUser receiver)
        {
            _message.To = receiver.PendingEmail; 

            return this;
        }
        
        public INotificationProvider<ApplicationUser> SetMessageMetaData<T>(T type) where T : IMessageMetaData
        {
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetSubject(string messageSubject)
        {
            _message.Subject = messageSubject;

            return this;
        }
    }
}
