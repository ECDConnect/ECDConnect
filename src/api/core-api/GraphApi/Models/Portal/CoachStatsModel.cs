namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class CoachStatsModel
    {
        public int TotalPractitioners { get; set; }
        public int TotalNewPractitioners { get; set; }
        public int TotalSiteVisits { get; set; }
        public int TotalWithNoIncomeExpense { get; set; }
        public int TotalWithIncomeExpense { get; set; }
        public int TotalLessThan75AttendanceRegisters { get; set; }
        public int TotalMoreThan75hAttendanceRegisters { get; set; }
        public int TotalWithNoProgressReports{ get; set; }
        public int TotalWithProgressReports { get; set; }

    }
}
