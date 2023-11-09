using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Licenses
{
    [Table(nameof(License))]
    public class License : License<Guid>
    {
    }

    public class License<TKey> : EntityBase<TKey>, ApplicationUserJoin, LicenseTypeJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public TKey LicenseTypeId { get; set; }

        [ForeignKey(nameof(LicenseTypeId))]
        public virtual LicenseType LicenseType { get; set; }

        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public DateTime? LicenseDate { get; set; }
        public DateTime? DelicensedDate { get; set; }
        public string? DelicensedComment { get; set; }

        public bool? CollectedSSPlaykit { get; set; }
        public bool? CollectedSSHandbook { get; set; }

        public DateTime? DeclinedDate { get; set; }
        public string? DeclinedCommentsSteps { get; set; }
    }

    public interface LicenseJoin<TKey>
    {
        [ForeignKey(nameof(LicenseId))]
        public License License { get; set; }
        public TKey LicenseId { get; set; }
    }
}
