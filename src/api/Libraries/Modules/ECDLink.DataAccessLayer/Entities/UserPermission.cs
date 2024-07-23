using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(UserPermission))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class UserPermission : UserPermission<Guid>
    {
    }

    public class UserPermission<TKey> : EntityBase<TKey>, PermissionJoin<Guid>, ApplicationUserJoin
        where TKey : IEquatable<TKey>
    {
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(PermissionId))]
        public virtual Permission Permission { get; set; }
        public Guid PermissionId { get; set; }
    }

    public interface UserPermissionJoin<TKey>
    {
        [ForeignKey(nameof(UserPermissionId))]
        public UserPermission UserPermission { get; set; }
        public TKey UserPermissionId { get; set; }
    }
}
