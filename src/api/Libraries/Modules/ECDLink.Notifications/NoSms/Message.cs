using ECDLink.Notifications.Model;
using Newtonsoft.Json;

namespace ECDLink.Notifications.NoSms
{
    public class Message : IMessage
    {
        [JsonProperty("to")]
        public string To { get; set; }

        [JsonProperty("body")]
        public string MessageBody { get; set; }
    }
}
