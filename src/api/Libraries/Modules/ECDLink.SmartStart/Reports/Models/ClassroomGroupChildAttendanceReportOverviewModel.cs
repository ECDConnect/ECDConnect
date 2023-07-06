using System.Collections.Generic;

namespace ECDLink.SmartStart.Reports.Models
{
    public class ClassroomGroupChildAttendanceReportOverviewModel
    {
        public List<ClassroomGroupChildAttendanceReportModel> ClassroomAttendanceReport { get; set; }
        public SortedDictionary<int, int> TotalAttendance { get; set; }
        public TotalAttendanceStatsReport TotalAttendanceStatsReport { get; set; }

    }
}
