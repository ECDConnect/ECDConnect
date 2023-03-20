
namespace ECDLink.Notifications.Model
{
    internal interface IMessage
    {
        public string To { get; set; }

        public string MessageBody { get; set; }
    }
}
