using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class UserRankingPointsModel
    {
        public Guid UserId { get; set; }
        public int PointsTotal { get; set; }
        public int MessageNr { get; set; }
        public int RankingNr { get; set; }
        public string ComparativePrimaryMessage { get; set; }
        public string ComparativeSecondaryMessage { get; set; }
        public double ComparativeTargetPercentage { get; set; }
        public string ComparativeTargetPercentageColor { get; set; }
        public string NonComparativePrimaryMessage { get; set; }
        public string NonComparativeSecondaryMessage { get; set; }
        public double NonComparativeTargetPercentage { get; set; }
        public string NonComparativeTargetPercentageColor { get; set; }
    }

}
