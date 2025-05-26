using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.ChildProgress
{
    public class PractitionerProgressReportSummaryModel
    {
        public string ReportingPeriod { get; set; }
        public List<PractitionerClassProgressReportSummaryModel> ClassSummaries { get; set; }

    }

    public class PractitionerClassProgressReportSummaryModel
    {
        public string ClassName { get; set; }
        public int ChildCount { get; set; }
        public Guid PractitionerUserId { get; set; }
        public string PractitionerFullName { get; set; }
        public List<PractitionerClassProgressReportCategorySummary> Categories { get; set; }
    }

    public class PractitionerClassProgressReportCategorySummary
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string Color { get; set; }
        public List<PractitionerClassProgressReportSubCategorySummary> SubCategories { get; set; }
    }

    public class PractitionerClassProgressReportSubCategorySummary
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public List<PractitionerClassProgressReportSkillSummary> ChildrenPerSkill { get; set; }
    }

    public class PractitionerClassProgressReportSkillSummary
    {
        public int Id { get; set; }
        public string Skill { get; set; }
        public int ChildCount { get; set; }
    }
}
