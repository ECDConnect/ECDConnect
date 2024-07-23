using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClassroomModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ClassroomImageUrl { get; set; }
        public string PreschoolCode { get; set; }

        public int? NumberPractitioners { get; set; }
        public int? NumberOfAssistants { get; set; }
        public int? NumberOfOtherAssistants { get; set; }

        public bool? IsDummySchool { get; set; }

        public BaseSiteAddressModel SiteAddress { get; set; }
        public BasePractitionerModel Principal { get; set; }

        public List<ChildProgressReportPeriodModel> ChildProgressReportPeriods { get; set; }
    }
}
