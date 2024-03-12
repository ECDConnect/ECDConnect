using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(HealthCareWorker))]
    [EntityPermission(PermissionGroups.USER)]
    public class HealthCareWorker : HealthCareWorker<Guid>
    {

    }

    public class HealthCareWorker<TKey> : EntityBase<TKey>,
        ApplicationUserJoin,
        LanguageJoin<Guid?>,
        ClinicJoin<Guid?>
         where TKey : IEquatable<TKey>
    {
        public bool ConsentForPhoto { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(LanguageId))]
        public virtual Language Language { get; set; }
        public Guid? LanguageId { get; set; }

        [ForeignKey(nameof(ClinicId))]
        public virtual Clinic Clinic { get; set; }
        public Guid? ClinicId { get; set; }

        public bool IsRegistered { get; set; }
        public bool ClickedVisitTab { get; set; }
        public bool ClickedProgressTab { get; set; }
        public bool ClickedReferralsTab { get; set; }
        public bool ClickedContactTab { get; set; }
        public bool ClickedDashboardClientsTab { get; set; }
        public bool ClickedDashboardVisitsTab { get; set; }
        public bool ClickedDashboardHighlightsTab { get; set; }
        public bool ClickedTeamTab { get; set; }
        public bool IsNewAtClinic { get; set; }
        public bool ShareContactInfo { get; set; }
        public string WelcomeMessage { get; set; }
        public virtual ICollection<Mother> Mothers { get; set; }
        public virtual ICollection<Caregiver> Caregivers { get; set; }
    }

    public interface HealthCareWorkerJoin<TKey>
    {
        [ForeignKey(nameof(HealthCareWorkerId))]
        public HealthCareWorker HealthCareWorker { get; set; }
        public TKey HealthCareWorkerId { get; set; }
    }
}
