using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Notifications.SendGrid
{
    public class EmailSendgridSender : INotificationProvider<ApplicationUser>
    {
        public SendGridOptions Options { get; } //set only via Secret Manager

        public EmailSendgridSender(IOptions<SendGridOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public Task SendEmailAsync(string email, string subject, string message)
        {
            return Execute(Options.SendGridKey, subject, message, email);
        }

        public Task Execute(string apiKey, string subject, string message, string email)
        {
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(Options.SenderEmail, Options.SendGridUser),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));

            // Disable click tracking.
            // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.SetClickTracking(false, false);

            return client.SendEmailAsync(msg);
        }

        public INotificationProvider<ApplicationUser> AddReceiver(ApplicationUser receiver)
        {
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetMessageTemplate(TemplateTypeEnum type)
        {
            throw new NotImplementedException();
        }
        public INotificationProvider<ApplicationUser> SetMessageMapped(TemplateTypeEnum template, string subject, string message)
        {
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> AddOrUpdateFieldReplacement(string key, string value)
        {
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> OverrideSender(string sender)
        {
            throw new NotImplementedException();
        }

        public Task SendMessageAsync(CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetMessageMetaData<T>(T type) where T : IMessageMetaData
        {
            throw new NotImplementedException();
        }

        public INotificationProvider<ApplicationUser> SetSubject(string sender)
        {
            return this;
        }

        public INotificationProvider<ApplicationUser> UsePendingReceiver(ApplicationUser receiver)
        {
            throw new NotImplementedException();
        }
    }
}
