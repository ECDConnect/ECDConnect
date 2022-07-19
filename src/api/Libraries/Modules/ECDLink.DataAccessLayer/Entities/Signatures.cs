

using ECDLink.Security.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Signatures))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Signatures : Signatures<Guid>
    {
    }

    public class Signatures<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Signature { get; set; }
        public string UserId { get; set; }
    }

    public interface SignaturesJoin<TKey>
    {
        [ForeignKey(nameof(SignaturesId))]
        public Signatures Signature { get; set; }
        public TKey SignaturesId { get; set; }
    }
}
