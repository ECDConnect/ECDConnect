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
using Microsoft.Extensions.Hosting;
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
        private const string FallbackFromEmailAddress = "info@ecdconnect.co.za";
        private const string _testingCatchAllEmailAddress = "ruald@ecdconnect.co.za";

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
                    _optionsAccessor?.FromEmail ?? FallbackFromEmailAddress);

                // TODO: multiple "to" recipients?
                MailboxAddress to;
                if (_currentEnvironment.IsProduction())
                    to = new MailboxAddress(
                        _message.ToDisplayName ?? _message.To,
                        _message.To);
                else
                    to = new MailboxAddress("Testing Email", _testingCatchAllEmailAddress);

                var builder = new BodyBuilder();
                builder.TextBody = emailMessage;
                builder.HtmlBody = emailMessage;

                // TODO: Add attachment support, still need mime type inference/detection?
                //var attachment = new MimePart("image", "gif")
                //{
                //    Content = new MimeContent(attachmentStream),
                //    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                //    ContentTransferEncoding = ContentEncoding.Base64,
                //    FileName = attachmentFileName
                //};
                // await builder.Attachments.AddAsync(attachment);


                var message = new MimeMessage();
                message.From.Add(from);
                message.To.Add(to);
                message.Subject = processedSubject;
                // ToMessageBody() adds attachments if defined
                message.Body = builder.ToMessageBody();

                // Create the client and send email.
                using var client = new SmtpClient();
                try
                {
                    // TODO: Singleton email client.
                    await client.ConnectAsync(_optionsAccessor.SmtpServerAddress, _optionsAccessor.SmtpServerPort, _optionsAccessor.SmtpServerUseTLS ? SecureSocketOptions.Auto : SecureSocketOptions.None, cancellationToken);
                }
                catch (Exception exception)
                {
                    _logger.LogError("Could not connect to Mail Server. Mail not sent.", exception);
                    throw;
                }

                // AuthenticateAsync only needed if the SMTP server requires authentication
                if (!string.IsNullOrEmpty(_optionsAccessor?.Username)
                    && !string.IsNullOrEmpty(_optionsAccessor?.Password))
                {
                    await client.AuthenticateAsync(_optionsAccessor.Username, _optionsAccessor.Password, cancellationToken);
                }

                var emailRetryWaitMs = _optionsAccessor?.RetryWaitMiliseconds ?? 300;

                // TODO: Clean up retry code, e.g. use Polly?
                // Send message
                try
                {
                    _logger.LogDebug("Sending email from:{fromAddress}, to: {toAddress}", message?.From?.FirstOrDefault(), message?.To?.FirstOrDefault());
                    var mailServerResponse = await client.SendAsync(message, cancellationToken);
                    _logger.LogInformation(mailServerResponse);
                }
                catch (IOException ioException)
                {
                    _logger.LogWarning(ioException, "Warning: Smtp Email: Failed to send mail, retrying in: {emailRetryWaitMs}ms", emailRetryWaitMs);
                    await Task.Delay(emailRetryWaitMs);
                    _logger.LogInformation("Retrying mail send.");
                    var mailServerResponse = await client.SendAsync(message, cancellationToken);
                    _logger.LogInformation(mailServerResponse);
                }
                catch (ProtocolException protocolException)
                {
                    _logger.LogWarning(protocolException, "Smtp Email Send: Protocol Exception, retrying in {emailRetryWaitMs}ms", emailRetryWaitMs);
                    await Task.Delay(emailRetryWaitMs);

                    if (client.IsConnected)
                    {
                        _logger.LogInformation("Retrying mail send.");
                        var mailServerResponse = await client.SendAsync(message, cancellationToken);
                        _logger.LogInformation(mailServerResponse);
                    }
                    else
                    {
                        _logger.LogInformation("Reconnecting mail client.");
                        await client.ConnectAsync(_optionsAccessor.SmtpServerAddress, _optionsAccessor.SmtpServerPort, _optionsAccessor.SmtpServerUseTLS);
                        _logger.LogInformation("Retrying mail send.");
                        var mailServerResponse = await client.SendAsync(message, cancellationToken);
                        _logger.LogInformation(mailServerResponse);
                    }
                }
                catch (Exception exception)
                {
                    _logger.LogError(exception, "Fatal error sending email. Giving up.");
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
