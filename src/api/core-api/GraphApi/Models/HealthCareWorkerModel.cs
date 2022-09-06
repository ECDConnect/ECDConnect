using System;
using ECDLink.DataAccessLayer.Entities;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class HealthCareWorkerModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public Guid? LangaugeId { get; set; }
        public Guid? SiteAddressId { get; set; }
        public SiteAddress SiteAddress { get; set; }
        public string TeamLeadId { get; set; }
    }
}
