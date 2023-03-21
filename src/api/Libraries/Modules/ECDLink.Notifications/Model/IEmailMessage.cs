
namespace ECDLink.Notifications.Model
{
    internal interface IEmailMessage : IMessage
    {
        public string From { get; set; }
        public string FromDisplayName { get; set; }

        public string ToDisplayName { get; set; }

        public string Cc { get; set; }
        public string Bcc { get; set; }

        public string Subject { get; set; }
    }
}
