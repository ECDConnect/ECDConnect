using ECDLink.Notifications.Model;
using Newtonsoft.Json;


namespace ECDLink.Notifications.iTouch
{
    public class iTouchMessage : IMessage
    {
        [JsonProperty("PhoneNumber")]
        public string To { get; set; }

        [JsonProperty("MessageText")]
        public string MessageBody { get; set; }
    }
}
