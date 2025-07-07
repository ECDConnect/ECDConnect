using ECDLink.Notifications.Model;
using Newtonsoft.Json;

namespace ECDLink.Notifications.BulkSms
{
    public class BulkSmsMessage : IMessage
    {
        [JsonProperty("to")]
        public string To { get; set; }

        [JsonProperty("body")]
        public string MessageBody { get; set; }
    }
}
