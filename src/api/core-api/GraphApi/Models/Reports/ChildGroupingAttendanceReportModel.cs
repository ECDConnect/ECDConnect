using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ChildGroupingAttendanceReportModel
    {
        public Guid ClassroomGroupId { get; set; }

        public string ClassroomGroupName { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int ExpectedAttendance { get; set; }

        public int ActualAttendance { get; set; }

        public int AttendancePercentage { get; set; }

        public IEnumerable<ChildAttendanceMonthlyReportModel> MonthlyAttendance { get; set; }
    }
}
