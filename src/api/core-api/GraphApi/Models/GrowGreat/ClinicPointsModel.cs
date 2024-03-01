using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class ClinicPointsModel
    {
        public int LeagueRanking { get; set; }
        public int PointsTotal { get; set; }
        public int MaxPointsTotal { get; set; }
        public List<PointsActivityModel> Points { get; set; }
    }
}
