using System;
using System.Collections.Generic;

namespace ECDLink.SmartStart.Reports.ChildProgressReport
{
    public class ChildProgressReportSummaryModel
    {
        public string  ChildId { get; set; }
        public string ChildFirstname { get; set; }

        public string ChildSurname { get; set; }
        public Guid ReportId { get; set; }

        public string ReportDate { get; set; }

        public string ClassroomName { get; set; }

        public List<ObservationCategorySummary> Categories { get; set; }
    }

    public class ObservationCategorySummary
    {
        public int CategoryId { get; set; }

        public int AchievedLevelId { get; set; }
    }
}
