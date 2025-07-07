using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(ReasonForPractitionerLeaving))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ReasonForPractitionerLeaving : ReasonForPractitionerLeaving<Guid>
    {

    }

    public class ReasonForPractitionerLeaving<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface ReasonForPractitionerLeavingJoin<TKey>
    {
        [ForeignKey(nameof(ReasonForPractionerLeavingId))]
        public ReasonForPractitionerLeaving ReasonForLeaving { get; set; }
        public TKey ReasonForPractionerLeavingId { get; set; }
    }
}
