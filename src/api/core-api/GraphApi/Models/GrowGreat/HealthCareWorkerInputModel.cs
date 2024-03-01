using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class HealthCareWorkerInputModel
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public TeamLead TeamLead { get; set; }
        public Guid? TeamLeadId { get; set; }

        public Guid? LanguageId { get; set; }

        public bool IsRegistered { get; set; }
        public bool IsNewAtClinic { get; set; }
        public Boolean? ClickedVisitTab { get; set; }
        public Boolean? ClickedProgressTab { get; set; }
        public Boolean? ClickedReferralsTab { get; set; }
        public Boolean? ClickedContactTab { get; set; }
        public Boolean? ClickedDashboardClientsTab { get; set; }
        public Boolean? ClickedDashboardVisitsTab { get; set; }
        public Boolean? ClickedDashboardHighlightsTab { get; set; }

    }
}
