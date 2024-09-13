namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class PractitionerStats
    {
        public string SchoolName { get; set; }
        public int TotalPractitionersForSchool { get; set; }
        public int TotalChildrenForSchool { get; set; }
        public int TotalClassesForSchool { get; set; }
        public int TotalAttendanceRegistersCompleted { get; set; }
        public int TotalAttendanceRegistersNotCompleted { get; set; }
        public int TotalProgressReportsCompleted { get; set; }
        public int TotalProgressReportsNotCompleted { get; set; }
        public int TotalIncomeStatementsDownloaded { get; set; }
        public int TotalIncomeStatementsWithNoItems { get; set; }


    }
}
