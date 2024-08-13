using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class UserRankingPointsModel
    {
        public Guid UserId { get; set; }
        public int UserRanking { get; set; }
        public int PointsTotal { get; set; }
        public int MaxMonthlyTotal { get; set; }
        public int MaxYearlyTotal { get; set; }
    }

}
