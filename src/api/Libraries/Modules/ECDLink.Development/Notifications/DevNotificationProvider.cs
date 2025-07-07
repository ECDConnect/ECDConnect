using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.MessageLogs;
using ECDLink.Notifications.Model;
using ECDLink.Notifications.Smtp;
using ECDLink.Notifications.Templates;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Development.Notifications
{
    public class DevNotificationProvider : NotificationBase<ApplicationUser>, INotificationProvider<ApplicationUser>
    {
        private readonly IMessageFactory _messageFactory;
        private readonly TemplateProcessor _templateProcessor;
        private readonly IConfigurationSection _configuration;

        private IDictionary<string, string> _dropModel;
        private readonly IMessageLogger<IEmailMessage> _messageLogger;

        public DevNotificationProvider(
            IMessageFactory messageFactory,
            IConfiguration configuration,
            TemplateProcessor templateProcessor,
            IMessageLogger<IEmailMessage> messageLogger)
        {
            _messageFactory = messageFactory;
            _templateProcessor = templateProcessor;
            _configuration = configuration.GetSection("Development");
            _fieldTransform = new Dictionary<string, string>();
            _dropModel = new Dictionary<string, string>();
            _messageLogger = messageLogger;
        }

        public Task SendMessageAsync(CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(_dropModel["To"]))
            {
                throw new KeyNotFoundException("No receiver address specified");
            }

            if (string.IsNullOrEmpty(_dropModel["Body"]))
            {
                throw new KeyNotFoundException("No message template found");
            }

            _dropModel["Body"] = _templateProcessor
                                        .SetUserContext(_model)
                                        .SetMessageTemplate(_messageTemplate)
                                        .SetMessageBody(_dropModel["Body"])
                                        .ParseMessageFilters(_fieldTransform)
                                        .ProcessBody();

            if (cancellationToken.IsCancellationRequested)
                return Task.CompletedTask;

            SmtpClient client = new SmtpClient();
            client.DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory;

            string dropLocation = _configuration["DropFolder"] ?? string.Empty;

            if (string.IsNullOrWhiteSpace(dropLocation))
            {
                var appRoute = DirectoryHelper.GetApplicationRoot();
                dropLocation = $"{appRoute}{Path.DirectorySeparatorChar}notification_drop";
            }

            if (!Directory.Exists(dropLocation))
            {
                Directory.CreateDirectory(dropLocation);
            }

            client.PickupDirectoryLocation = dropLocation;

            // Specify the email sender.
            // Create a mailing address that includes a UTF8 character
            // in the display name.
            MailAddress from = new MailAddress("dgmt-developer-drop-folder@dgmt.com",
               "No " + (char)0xD8 + " Reply",
            System.Text.Encoding.UTF8);

            // Set destinations for the email message.
            MailAddress to = new MailAddress(_dropModel["To"]);

            // Specify the message content.
            using (MailMessage message = new MailMessage(from, to))
            {
                message.Body = _dropModel["Body"];
                message.BodyEncoding = System.Text.Encoding.UTF8;

                message.Subject = _dropModel.ContainsKey("Subject") ? _dropModel["Subject"] : "";
                message.SubjectEncoding = System.Text.Encoding.UTF8;

                // The userState can be any object that allows your callback
                // method to identify this send operation.
                // For this example, the userToken is a string constant.
                string userState = "test message1";

                client.SendAsync(message, userState);
                _messageLogger.Log(new EmailMessage()
                {
                    From = "System",
                    FromDisplayName = "System",
                    To = _dropModel["To"],
                    ToDisplayName = "",
                    Cc = "",
                    Bcc = "",
                    Subject = _dropModel.ContainsKey("Subject") ? _dropModel["Subject"] : "",
                MessageBody = _dropModel["Body"]
                },
                _messageTemplate?.TemplateType);
                return Task.CompletedTask;
            }
        }

        public INotificationProvider<ApplicationUser> AddReceiver(ApplicationUser receiver)
        {
            _dropModel["To"] = receiver.Email;
            _model = receiver;
            return this;
        }

        public INotificationProvider<ApplicationUser> SetMessageTemplate(TemplateTypeEnum template)
        {
            var messageTemplate = GetTemplate(template);
            _dropModel["Body"] = messageTemplate.Message;
            _messageTemplate = messageTemplate;

            base.AddUserFieldOverrides(messageTemplate.Message);

            return this;
        }
        public INotificationProvider<ApplicationUser> SetMessageMapped(TemplateTypeEnum template, string subject, string message)
        {
            var messageTemplate = GetTemplate(template);
            _dropModel["Body"] = message;
            _messageTemplate = messageTemplate;

            base.AddUserFieldOverrides(message);

            return this;
        }


        public INotificationProvider<ApplicationUser> AddOrUpdateFieldReplacement(string key, string value)
        {
            if (_fieldTransform.ContainsKey(key))
                _fieldTransform[key] = value;
            else
                _fieldTransform.Add(key, value);

            return this;
        }

        private IMessageTemplate GetTemplate(TemplateTypeEnum template)
        {
            return _messageFactory.GetMessageTemplate(MessageProtocolEnum.Sms, template);
        }

        public INotificationProvider<ApplicationUser> OverrideSender(string sender)
        {
            throw new System.NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetMessageMetaData<T>(T type) where T : IMessageMetaData
        {
            throw new System.NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetSubject(string subject)
        {
            _dropModel["Subject"] = subject;

            return this;
        }

        public INotificationProvider<ApplicationUser> UsePendingReceiver(ApplicationUser receiver)
        {
            _dropModel["To"] = receiver.PendingEmail;
            _model = receiver;
            return this;
        }
    }
}
