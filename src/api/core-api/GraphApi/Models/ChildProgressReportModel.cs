using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ChildProgressReportModel
    {
        public Guid Id { get; set; }

        public Guid ChildId { get; set; }

        public DateTime? DateCompleted { get; set; }

        public DateTime DateCreated { get; set; }

        public string Notes { get; set; }

        public Guid ChildProgressReportPeriodId { get; set; }

        public List<SkillObservation> SkillObservations { get; set; }

        public List<SkillToWorkOn> SkillsToWorkOn { get; set; }

        public string HowToSupport { get; set; }
        
        public DateTime? ObservationsCompleteDate { get; set; }
        
        public string ChildEnjoys { get; set; }

        public string GoodProgressWith { get; set; }

        public string HowCanCaregiverSupport { get; set; }
    }

    public class SkillObservation
    {
        public int SkillId { get; set; }

        public string Value { get; set; }
    }

    public class SkillToWorkOn
    {
        public int SkillId { get; set; }

        public string HowToSupport { get; set; }
    }
}
