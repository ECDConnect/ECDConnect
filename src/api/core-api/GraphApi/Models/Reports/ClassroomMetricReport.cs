using System;
using System.Collections.Generic;
using System.Text;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClassroomMetricReport
    {
        public string practitionerId { get; set; }
        public int childCount { get; set; }
        public int attendancePercentage { get; set; }
        public int month { get; set; }
        public int year { get; set; }
        public int weekOfYear { get; set; }
        public string classroomGroupId { get; set; }
        public string classroomId { get; set; }
    }
}
