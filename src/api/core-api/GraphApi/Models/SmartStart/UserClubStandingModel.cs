namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart
{
    public class UserClubStandingModel
    {
        public int PercentageMembersWithMorePointsForCurrentMonth { get; set; }
        public int PercentageMembersWithMorePointsForCurrentYear { get; set; }
        public int PercentageMembersWithFewerPointsForCurrentMonth { get; set; }
        public int PercentageMembersWithFewerPointsForCurrentYear { get; set; }
    }
}
