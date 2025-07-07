using ECDLink.Notifications.Model;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace ECDLink.Notifications.SMSPortal
{
    public class SMSPortalMessage : IMessage
    {
        [JsonProperty("destination")]
        public string To { get; set; }

        [JsonProperty("content")]
        public string MessageBody { get; set; }
    }

    public class SMSPortalMessages
    {
        [JsonProperty("messages")]
        public List<SMSPortalMessage> Messages = new List<SMSPortalMessage>();
    }
}
