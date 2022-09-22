using System;
using System.Collections.Generic;
using System.Text;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClassroomMetricReport
    {
        public int childCount { get; set; }
        public int attendancePercentage { get; set; }

        public Guid classroomId { get; set; }
    }
}
