using System;
using System.Collections.Generic;
using System.Text;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ChildrenMetricReport
    {
        public int UnverifiedDocuments { get; set; }        
        public int TotalChildren { get; set; }
        public int TotalChildProgressReports { get; set; }
        public List<MetricReportStatItem> StatusData { get; set; }        
        public List<MetricReportStatItem> ChildAttendacePerMonthData { get; set; }

    }
}
