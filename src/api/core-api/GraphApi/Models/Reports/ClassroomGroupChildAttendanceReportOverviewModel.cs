using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClassroomGroupChildAttendanceReportOverviewModel
    {
        public List<ClassroomGroupChildAttendanceReportModel> ClassroomAttendanceReport { get; set; }
        public SortedDictionary<int, int?> TotalAttendance { get; set; }
        public TotalAttendanceStatsReport TotalAttendanceStatsReport { get; set; }

    }
}
