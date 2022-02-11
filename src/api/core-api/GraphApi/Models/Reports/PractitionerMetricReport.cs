using System;
using System.Collections.Generic;
using System.Text;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class PractitionerMetricReport
    {
        public int OutstandingSyncs { get; set; }
        public int CompletedProfiles { get; set; }        
        public int AvgChildren { get; set; }
        public List<MetricReportStatItem> StatusData { get; set; }
        public List<MetricReportStatItem> ProgramTypesData { get; set; }        

    }
}
