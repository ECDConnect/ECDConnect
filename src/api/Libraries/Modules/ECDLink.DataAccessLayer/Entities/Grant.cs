

using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Grant))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Grant : Grant<Guid>
    {
    }

    public class Grant<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface GrantJoin<TKey>
    {
        [ForeignKey(nameof(GrantId))]
        public Grant Grant { get; set; }
        public TKey GrantId { get; set; }
    }
}
