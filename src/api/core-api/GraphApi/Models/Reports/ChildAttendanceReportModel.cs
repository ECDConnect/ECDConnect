using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ChildAttendanceReportModel
    {
        public int TotalExpectedAttendance { get; set; }

        public int TotalActualAttendance { get; set; }

        public IEnumerable<ChildGroupingAttendanceReportModel> ClassGroupAttendance { get; set; }

        public int AttendancePercentage { get; set; }
    }
}
