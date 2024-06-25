
namespace ECDLink.UrlShortner.Model
{
    public class PortalSMSResultWrapperModel
    {
        public decimal RemainingBalance { get; set; }
        public int Messages { get; set; }
        public PortalSMSErrorReport ErrorReport { get; set; }
    }

    public class PortalSMSErrorReport
    {
        public int NoNetwork { get; set; }
        public int NoContents { get; set; }
        public int ContentToLong { get; set; }
        public int Duplicates { get; set; }
        public int OptedOuts { get; set; }
    }
}

