namespace ECDLink.Notifications.SMSPortal
{
    public class Submission
    {
        public string id { get; set; }
        public string date { get; set; }
    }

    public class Status
    {
        public string id { get; set; }
        public string type { get; set; }
        public string subtype { get; set; }
    }

    public class SMSPortalResponse
    {
        public string id { get; set; }
        public string type { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string body { get; set; }
        public string encoding { get; set; }
        public int protocolId { get; set; }
        public int messageClass { get; set; }
        public int numberOfParts { get; set; }
        public int creditCost { get; set; }
        public string relatedSentMessageId { get; set; }
        public string userSuppliedId { get; set; }
        public Submission submission { get; set; }
        public Status status { get; set; }
    }
}
