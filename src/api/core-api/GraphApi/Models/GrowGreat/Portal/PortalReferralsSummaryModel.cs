using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class PortalReferralsSummaryModel
    {
        public Guid TypeId { get; set; }
        public string Type { get; set; }
        public int ReferralsRaised { get; set; }
        public int ReferralsMade { get; set; }
        public int BackReferralsMade { get; set; }
    }
}
