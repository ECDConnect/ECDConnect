using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
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
        TeamLeadJoin<Guid?>
         where TKey : IEquatable<TKey>
    {
        public bool ConsentForPhoto { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }

        [ForeignKey(nameof(LanguageId))]
        public virtual Language Language { get; set; }
        public Guid? LanguageId { get; set; }

        [ForeignKey(nameof(TeamLeadId))]
        public virtual TeamLead TeamLead { get; set; }
        public Guid? TeamLeadId { get; set; }

        public bool IsRegistered { get; set; }
    }

    public interface HealthCareWorkerJoin<TKey>
    {
        [ForeignKey(nameof(HealthCareWorkerId))]
        public HealthCareWorker HealthCareWorker { get; set; }
        public TKey HealthCareWorkerId { get; set; }
    }

    public class HCWVisitStatus
    {
        public int MotherOverDueVisits { get; set; }
        public int MotherDueVisits { get; set; }
        public int ChildDueVisits { get; set; }
    }
}
