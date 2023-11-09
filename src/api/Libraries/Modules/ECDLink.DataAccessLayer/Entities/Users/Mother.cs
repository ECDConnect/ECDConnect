using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Mother))]
    [EntityPermission(PermissionGroups.USER)]
    public class Mother : Mother<Guid>
    {

    }

    public class Mother<TKey> : EntityBase<TKey>,
        SiteAddressJoin<Guid?>,
        HealthCareWorkerJoin<Guid?>,
        ApplicationUserJoin
         where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(SiteAddressId))]
        public virtual SiteAddress SiteAddress { get; set; }
        public Guid? SiteAddressId { get; set; }

        [ForeignKey(nameof(HealthCareWorkerId))]
        public virtual HealthCareWorker HealthCareWorker { get; set; }
        public Guid? HealthCareWorkerId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid UserId { get; set; }

        public DateTime? ExpectedDateOfDelivery { get; set; }

        public string Age { get; set; }

        public string WhatsAppNumber { get; set; }

        [ForeignKey(nameof(LinkedCaregiverId))]
        public virtual Caregiver.Caregiver Caregiver { get; set; }
        public Guid? LinkedCaregiverId { get; set; }
        public Boolean? ClickedVisitTab { get; set; }
        public Boolean? ClickedProgressTab { get; set; }
        public Boolean? ClickedReferralsTab { get; set; }
        public Boolean? ClickedContactTab { get; set; }

        [NotMapped]
        public virtual DisplaySet StatusInfo { get; set; }
        
        [NotMapped]
        public DateTime? NextVisitDate { get; set; }

    }

    public interface MotherJoin<TKey>
    {
        [ForeignKey(nameof(MotherId))]
        public Mother Mother { get; set; }
        public TKey MotherId { get; set; }
    }
}
