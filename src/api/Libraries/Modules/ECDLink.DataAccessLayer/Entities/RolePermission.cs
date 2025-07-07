using ECDLink.Core.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(RolePermission))]
    public class RolePermission : RolePermission<Guid>
    {

    }

    public class RolePermission<TKey> : PermissionJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        // Part of PK
        [ForeignKey(nameof(RoleId))]
        public virtual ApplicationIdentityRole Role { get; set; }

        public Guid RoleId { get; set; }

        // Part of PK
        [ForeignKey(nameof(PermissionId))]
        public virtual Permission Permission { get; set; }

        public TKey PermissionId { get; set; }
    }

    public interface RolePermissionJoin<TKey>
    {
        [ForeignKey(nameof(RolePermissionId))]
        public RolePermission RolePermission { get; set; }
        public TKey RolePermissionId { get; set; }
    }
}
