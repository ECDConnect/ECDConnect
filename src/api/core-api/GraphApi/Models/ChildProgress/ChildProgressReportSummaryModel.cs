using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.ChildProgress
{
    public class ChildProgressReportSummaryModel
    {
        public string ChildId { get; set; }
        public string ChildFirstname { get; set; }

        public string ChildSurname { get; set; }
        public Guid ReportId { get; set; }

        public string ReportDate { get; set; }

        public string ReportPeriod { get; set; }

        public string ReportDateCreated { get; set; }

        public string ReportDateCompleted { get; set;  }

        public string ClassroomName { get; set; }

        public List<ObservationCategorySummary> Categories { get; set; }
    }

    public class ObservationCategorySummary
    {
        public int CategoryId { get; set; }

        public int AchievedLevelId { get; set; }

        public List<ObservationCategoryTaskSummary> Tasks { get; set; }
    }

    public class ObservationCategoryTaskSummary
    {
        public int LevelId { get; set; }

        public int SkillId { get; set; }

        public string Value { get; set; }

    }
}
