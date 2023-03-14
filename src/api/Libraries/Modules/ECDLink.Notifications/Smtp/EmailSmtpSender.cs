using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.Model;
using ECDLink.Notifications.Templates;
using MailKit;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Notifications.Smtp
{
    public class EmailSmtpSender : NotificationBase<ApplicationUser>, INotificationProvider<ApplicationUser>
    {
        private readonly IMessageFactory _messageFactory;
        private readonly TemplateProcessor _templateProcessor;
        private readonly EmailSmtpOptions _optionsAccessor;
        private readonly string _testingEmailAddress = "test@ecdconnect.co.za";
        private readonly int emailRetryWaitMs = 300;
        private EmailMessage _message;
        private IWebHostEnvironment _currentEnvironment;
        private bool _smtpDisabled;

        public EmailSmtpSender(
            IMessageFactory messageFactory,
            IConfiguration configuration,
            TemplateProcessor templateProcessor,
            ISystemSetting<EmailSmtpOptions> optionsAccessor,
            IWebHostEnvironment environment)
        {
            _messageFactory = messageFactory;
            _templateProcessor = templateProcessor;
            _optionsAccessor = optionsAccessor?.Value;
            _smtpDisabled = _optionsAccessor is null || _optionsAccessor.Disabled;

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

                // TODO: Get Tenant Address
                // Specify the email sender.
                MailboxAddress from = new MailboxAddress("ECD Connect", "no-reply@dgmt.com");

                // TODO: Set Name of Sender?
                // TODO: multiple "to" recipients?
                // Set destinations for the email message.
                MailboxAddress to;
                if (_currentEnvironment.IsProduction())
                    to = new MailboxAddress(
                        _message.ToDisplayName ?? _message.To,
                        _message.To);
                else
                    to = new MailboxAddress("Testing Email", _testingEmailAddress);

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

                var processedSubject = _templateProcessor.ProcessSubject();

                var message = new MimeMessage();
                message.From.Add(from);
                message.To.Add(to);
                message.Subject = processedSubject;
                // ToMessageBody() adds attachments if defined
                message.Body = builder.ToMessageBody();

                // Create the client and send email.
                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(_optionsAccessor.SmtpServerAddress, _optionsAccessor.SmtpServerPort, _optionsAccessor.SmtpServerUseTLS, cancellationToken);

                    // Note: only needed if the SMTP server requires authentication
                    if (!string.IsNullOrEmpty(_optionsAccessor?.Username) 
                        && !string.IsNullOrEmpty(_optionsAccessor?.Password))
                        await client.AuthenticateAsync(_optionsAccessor.Username, _optionsAccessor.Password, cancellationToken);

                    // TODO: Clean up retry code
                    // Send message
                    try
                    {
                        await client.SendAsync(message, cancellationToken);

                    } catch (IOException ioException)
                    {
                        // TODO: Add logger
                        // _logger.LogWarning("Smtp Email Send: IO Exception, retrying", ioException);
                        await Task.Delay(emailRetryWaitMs);
                        await client.SendAsync(message, cancellationToken);
                    }
                    catch (ProtocolException protocolException)
                    {
                        // TODO: Add logger
                        // _logger.LogWarning("Smtp Email Send: Protocol Exception, retrying", protocolException);
                        await Task.Delay(emailRetryWaitMs);

                        if (client.IsConnected)
                        {
                            await client.SendAsync(message, cancellationToken);
                        } else
                        {
                            await client.ConnectAsync(_optionsAccessor.SmtpServerAddress, _optionsAccessor.SmtpServerPort, _optionsAccessor.SmtpServerUseTLS);
                            await client.SendAsync(message, cancellationToken);
                        }
                    }

                    await client.DisconnectAsync(true);
                }
            }
        }

        public INotificationProvider<ApplicationUser> AddReceiver(ApplicationUser receiver)
        {
            _message.To = receiver.Email;
            _model = receiver;
            return this;
        }

        public INotificationProvider<ApplicationUser> SetMessageTemplate(TemplateTypeEnum template)
        {
            var messageTemplate = GetTemplate(template);
            _message.MessageBody = messageTemplate.Message;

            _messageTemplate = messageTemplate;

            base.AddUserFieldOverrides(messageTemplate.Message);

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
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetMessageMetaData<T>(T type) where T : IMessageMetaData
        {
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetSubject(string sender)
        {
            throw new NotImplementedException();
        }
    }
}
