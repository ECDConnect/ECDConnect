using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users
{
    [Table(nameof(Infant))]
    [EntityPermission(PermissionGroups.USER)]
    public class Infant : Infant<Guid>
    {

    }

    public class Infant<TKey> : EntityBase<TKey>,
        GenderJoin<Guid?>,
        CaregiverJoin<Guid?>,
        ApplicationUserJoin
         where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(GenderId))]
        public virtual Gender Gender { get; set; }
        public Guid? GenderId { get; set; }

        //[ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid UserId { get; set; }

        [ForeignKey(nameof(CaregiverId))]
        public virtual Caregiver.Caregiver Caregiver { get; set; }
        public Guid? CaregiverId { get; set; }

        [ForeignKey(nameof(MotherCaregiverId))]
        public virtual Mother Mother { get; set; }
        public Guid? MotherCaregiverId { get; set; }
        public decimal? WeightAtBirth { get; set; }

        public decimal? LengthAtBirth { get; set; }
        public Boolean? Completed24MonthVisits { get; set; }
        public Boolean? ClickedVisitTab { get; set; }
        public Boolean? ClickedProgressTab { get; set; }
        public Boolean? ClickedReferralsTab { get; set; }
        public Boolean? ClickedContactTab { get; set; }

        [NotMapped]
        public virtual DisplaySet StatusInfo { get; set; }

        [NotMapped]
        public DateTime? NextVisitDate { get; set; }

    }

    public interface InfantJoin<TKey>
    {
        [ForeignKey(nameof(InfantId))]
        public Infant Infant { get; set; }
        public TKey InfantId { get; set; }
    }
}
