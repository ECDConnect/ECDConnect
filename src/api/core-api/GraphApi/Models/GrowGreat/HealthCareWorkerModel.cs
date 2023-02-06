using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class HealthCareWorkerModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public TeamLead TeamLead { get; set; }
        public Guid? TeamLeadId { get; set; }

        public Guid? LanguageId { get; set; }

        public bool IsRegistered { get; set; }
    }
}
