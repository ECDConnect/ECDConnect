namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class PointsToDoItemModel
    {
        public bool? SignedUpForApp { get; set; } = true;
        public bool? NotPartOfPreschool { get; set; }
        public bool? SavedIncomeOrExpense { get; set; }
        public bool? PlannedOneDay { get; set; }
        public bool? ViewedCommunitySection { get; set; }
    }

}
