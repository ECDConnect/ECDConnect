
namespace ECDLink.Notifications.Model
{
    public interface IEmailMessage : IMessage
    {
        public string From { get; set; }
        public string FromDisplayName { get; set; }

        public string ToDisplayName { get; set; }

        public string Cc { get; set; }
        public string Bcc { get; set; }

        public string Subject { get; set; }
    }
}
