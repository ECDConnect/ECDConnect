using Newtonsoft.Json;

namespace ECDLink.Notifications.BulkSms
{
    public class BulkSmsMessage
    {
        [JsonProperty("to")]
        public string To { get; set; }

        [JsonProperty("body")]
        public string MessageBody { get; set; }
    }
}
