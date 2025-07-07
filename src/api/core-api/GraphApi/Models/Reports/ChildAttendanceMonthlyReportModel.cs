namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ChildAttendanceMonthlyReportModel
    {
        public string Month { get; set; }

        public int Year { get; set; }

        public int MonthNumber { get; set; }

        public int ActualAttendance { get; set; }

        public int ExpectedAttendance { get; set; }

        public int AttendancePercentage { get; set; }
    }
}
