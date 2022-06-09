using System.Collections.Generic;

namespace ECDLink.SmartStart.Reports.Models
{
    public class ChildAttendanceReportModel
    {
        public int TotalExpectedAttendance { get; set; }

        public int TotalActualAttendance { get; set; }

        public IEnumerable<ChildGroupingAttendanceReportModel> ClassGroupAttendance { get; set; }

        public decimal AttendancePercentage { get; set; }
    }
}
