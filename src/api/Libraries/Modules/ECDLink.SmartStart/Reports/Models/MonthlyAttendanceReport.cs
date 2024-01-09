namespace ECDLink.SmartStart.Reports.Models
{
    public class MonthlyAttendanceReportModel
    {
        public string Month { get; set; }

        public int MonthOfYear { get; set; }

        public int Year { get; set; }

        public int PercentageAttendance { get; set; }

        public int NumberOfSessions { get; set; }
        public int TotalScheduledSessions { get; set; }
    }
}
