using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Permission))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Permission : Permission<Guid>
    {
    }

    public class Permission<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        [Column("Name")]
        [Required]
        public string Name { get; set; }

        [Column("NormalizedName")]
        public string NormalizedName { get; set; }

        [Column("Grouping")]
        public string Grouping { get; set; }
    }

    public interface PermissionJoin<TKey>
    {
        [ForeignKey(nameof(PermissionId))]
        public Permission Permission { get; set; }
        public TKey PermissionId { get; set; }
    }
}
