namespace EcdLink.Api.CoreApi.GraphApi.Models.Points
{
    public class PointsToDoItemModel
    {
        public bool? SignedUpForApp { get; set; } = true;
        public bool? IsPartOfPreschool { get; set; }
        public bool? SavedIncomeOrExpense { get; set; }
        public bool? PlannedOneDay { get; set; }
        public bool? ViewedCommunitySection { get; set; }
    }

}
