using System;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class HealthCareWorkerModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public TeamLead TeamLead { get; set; }
        public Guid? TeamLeadId { get; set; }

        public Guid? LangaugeId { get; set; }

        public bool IsRegistered { get; set; }
    }
}
