using ECDLink.DataAccessLayer.Entities.PointsEngine;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Points
{
    public class PointsActivityModel
    {
        public Guid PointsActivityId { get; set; }
        public int PointsTotal { get; set; }
        public int TimesScored { get; set; }
        public string ActivityName { get; set; }
        public string TodoDescription { get; set; }
        public int? MaxMonthlyPoints { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public PointsActivityModel(PointsUserSummary summary)
        {
            PointsActivityId = summary.PointsActivityId;
            PointsTotal = summary.PointsTotal;
            TimesScored = summary.TimesScored;
            ActivityName = summary.PointsActivity.Name;
            Month = summary.DateScored.Month;
            Year = summary.DateScored.Year;
            TodoDescription = "TODO?";
            MaxMonthlyPoints = summary.PointsActivity.MaxPointsIndividualMonthly;
        }
    }
}
