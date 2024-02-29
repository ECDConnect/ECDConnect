using ECDLink.DataAccessLayer.Entities.Users;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class HealthCareWorkerModel
    {
        public Guid Id { get; set; }
        public UserModel User { get; set; }
        public Guid UserId { get; set; }
        public bool? ConsentForPhoto { get; set; }
        public bool? IsRegistered { get; set; }
        public string Language { get; set; }
        public Guid LanguageId { get; set; }

        public bool ClickedDashboardClientsTab { get; set; }
        public bool ClickedDashboardVisitsTab { get; set; }
        public bool ClickedDashboardHighlightsTab { get; set; }
        public bool ClickedVisitTab { get; set; }
        public bool ClickedProgressTab { get; set; }
        public bool ClickedReferralsTab { get; set; }
        public bool ClickedContactTab { get; set; }
        public bool ClickedTeamTab { get; set; }
        public Guid? ClinicId { get; set; } // TODO - Can we make this non-nullable once we have the data set up?
        public string WelcomeMessage { get; set; }
        public bool ShareContactInfo { get; set; }
        public bool IsNewAtClinic { get; set; }

        public HealthCareWorkerModel(HealthCareWorker entity)
        {
            Id = entity.Id;
            User = new UserModel(entity.User);
            UserId = entity.UserId.Value;
            ConsentForPhoto = entity.ConsentForPhoto;
            IsRegistered = entity.IsRegistered;
            LanguageId = entity.LanguageId.Value;
            Language = entity.Language != null ? entity.Language.Description : null;
            ClickedContactTab = entity.ClickedContactTab;
            ClickedDashboardClientsTab = entity.ClickedDashboardClientsTab;
            ClickedDashboardHighlightsTab = entity.ClickedDashboardHighlightsTab;
            ClickedDashboardVisitsTab = entity.ClickedDashboardVisitsTab;
            ClickedProgressTab = entity.ClickedProgressTab;
            ClickedReferralsTab = entity.ClickedReferralsTab;
            ClickedTeamTab = entity.ClickedTeamTab;
            ClickedVisitTab = entity.ClickedVisitTab;
            ClinicId = entity.ClinicId;
            WelcomeMessage = entity.WelcomeMessage;
            ShareContactInfo = entity.ShareContactInfo;
            IsNewAtClinic = entity.IsNewAtClinic;
        }
    }
}
