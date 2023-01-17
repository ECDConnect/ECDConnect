using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class PractitionerMetricReport
    {
        public int OutstandingSyncs { get; set; }
        public int CompletedProfiles { get; set; }
        public int AvgChildren { get; set; }
        public int AllChildren { get; set; }
        public int AllClassrooms { get; set; }
        public int AllClassroomGroups { get; set; }

        public List<MetricReportStatItem> StatusData { get; set; }
        public List<MetricReportStatItem> ProgramTypesData { get; set; }

    }
}
