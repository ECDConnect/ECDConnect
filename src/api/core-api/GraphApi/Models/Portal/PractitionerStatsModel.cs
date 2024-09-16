namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class PractitionerStatsModel
    {
        public string SchoolName { get; set; } = "";
        public int TotalPractitionersForSchool { get; set; } = 0;
        public int TotalChildrenForSchool { get; set; } = 0;
        public int TotalClassesForSchool { get; set; } = 0;
        public int TotalAttendanceRegistersCompleted { get; set; } = 0;
        public int TotalAttendanceRegistersNotCompleted { get; set; } = 0;
        public int TotalProgressReportsCompleted { get; set; } = 0;
        public int TotalProgressReportsNotCompleted { get; set; } = 0;
        public int TotalIncomeStatementsDownloaded { get; set; } = 0;
        public int TotalIncomeStatementsWithNoItems { get; set; } = 0;

    }
}
