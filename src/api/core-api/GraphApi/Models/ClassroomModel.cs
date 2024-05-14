using ECDLink.DataAccessLayer.Entities.Classroom;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ClassroomModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }

        public int? NumberOfPractitioners { get; set; }
        public int? NumberOfAssistants { get; set; }
        public int? NumberOfOtherAssistants { get; set; }

        public double? PreschoolFeeAmount { get; set; }
        public DateTime? PreschoolFeeAmountLastUpdateDate { get; set; }

        public BaseSiteAddressModel SiteAddress { get; set; }
        public BasePractitionerModel Principal { get; set; }
    }
}
