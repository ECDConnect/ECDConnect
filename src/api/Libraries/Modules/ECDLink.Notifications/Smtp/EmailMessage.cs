using ECDLink.Notifications.Model;

namespace ECDLink.Notifications.Smtp
{
    public class EmailMessage : IEmailMessage
    {
        public string From { get; set; }
        public string FromDisplayName { get; set; }

        public string To { get; set; }
        public string ToDisplayName { get; set; }

        public string Cc { get; set; }
        public string Bcc { get; set; }

        public string Subject { get; set; }
        public string MessageBody { get; set; }
    }
}