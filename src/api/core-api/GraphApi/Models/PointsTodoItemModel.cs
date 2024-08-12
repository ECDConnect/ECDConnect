namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class PointsToDoItemModel
    {
        public PhaseOne PhaseOne { get; set; }
    }

    public class PhaseOne
    {
        public bool NotPartOfPreschool { get; set; } = false;
        public bool SavedIncomeOrExpense { get; set; } = false;
        public bool PlannedOneDay { get; set; } = false;
        public bool ViewedCommunitySection { get; set; } = false;
    }
}
