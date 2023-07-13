using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(ReasonForPractitionerLeaving))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ReasonForPractitionerLeaving : ReasonForLeavingPractitioner<Guid>
    {

    }

    public class ReasonForLeavingPractitioner<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface ReasonForLeavingPractitionerJoin<TKey>
    {
        [ForeignKey(nameof(ReasonForLeavingPractionerId))]
        public ReasonForPractitionerLeaving ReasonForLeaving { get; set; }
        public TKey ReasonForLeavingPractionerId { get; set; }
    }
}
