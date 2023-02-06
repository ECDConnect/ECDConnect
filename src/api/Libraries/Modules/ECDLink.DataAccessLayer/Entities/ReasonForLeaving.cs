using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(ReasonForLeaving))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ReasonForLeaving : ReasonForLeaving<Guid>
    {

    }

    public class ReasonForLeaving<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface ReasonForLeavingJoin<TKey>
    {
        [ForeignKey(nameof(ReasonForLeavingId))]
        public ReasonForLeaving ReasonForLeaving { get; set; }
        public TKey ReasonForLeavingId { get; set; }
    }
}
