namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class TeamStandingModel
    {
        public int PercentageMembersWithMorePointsForCurrentMonth { get; set; }
        public int PercentageMembersWithMorePointsForCurrentYear { get; set; }
        public int PercentageMembersWithFewerPointsForCurrentMonth { get; set; }
        public int PercentageMembersWithFewerPointsForCurrentYear { get; set; }
    }
}
