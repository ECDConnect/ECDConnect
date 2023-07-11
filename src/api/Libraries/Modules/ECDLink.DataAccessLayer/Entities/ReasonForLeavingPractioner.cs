using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(ReasonForLeavingPractioner))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ReasonForLeavingPractioner : ReasonForLeavingPractioner<Guid>
    {

    }

    public class ReasonForLeavingPractioner<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface ReasonForLeavingPractionerJoin<TKey>
    {
        [ForeignKey(nameof(ReasonForLeavingPractionerId))]
        public ReasonForLeavingPractioner ReasonForLeaving { get; set; }
        public TKey ReasonForLeavingPractionerId { get; set; }
    }
}
