using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Points
{
    public class PointsUserDateSummary
    {
        public int Total { get; set; }
        public int TotalChildren { get; set; }
        public List<ActivityDetail> ActivityDetail { get; set; }
        public UserRankingPointsModel UserRankingData { get; set; }

        public PointsUserDateSummary(int total, int totalChildren, List<ActivityDetail> activityDetail, UserRankingPointsModel userRankingData)
        {
            Total = total;
            TotalChildren = totalChildren;
            ActivityDetail = activityDetail;
            UserRankingData = userRankingData;
        }
    }


    public class PointsUserYearMonthSummary
    {
        public int Total { get; set; }
        public List<MonthSummary> MonthSummary { get; set; }

        public PointsUserYearMonthSummary(int total, List<MonthSummary> monthSummary)
        {
            Total = total;
            MonthSummary = monthSummary;
        }
    }

    public class MonthSummary
    {
        public string Month { get; set; }
        public int Total { get; set; }
        public List<ActivityDetail> ActivityDetail { get; set; }

        public MonthSummary(string month, int total, List<ActivityDetail> activityDetail)
        {
            Month = month;
            Total = total;
            ActivityDetail = activityDetail;
        }
    }

    public class ActivityDetail
    {
        public string Activity {  get; set; }
        public int TimesScored { get; set; }
        public int PointsTotal { get; set; }
        public ActivityDetail(string activity, int timesScored, int pointsTotal) 
        { 
            Activity = activity;
            TimesScored = timesScored;
            PointsTotal = pointsTotal;
        }
    }

}
