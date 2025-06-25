using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClassroomGroupChildAttendanceReportModel
    {
        public int TotalExpectedAttendance { get; set; }

        public int TotalActualAttendance { get; set; }

        public int AttendancePercentage { get; set; }

        public string ChildUserId { get; set; }

        public Guid ClassgroupId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public string ChildFullName { get; set; }
        public string ChildIdNumber { get; set; }

        public SortedDictionary<int, int?> Attendance { get; set; }
    }
}
