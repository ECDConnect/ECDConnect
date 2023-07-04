
namespace ECDLink.Notifications.Model
{
    public interface IMessage
    {
        public string To { get; set; }

        public string MessageBody { get; set; }
    }
}
