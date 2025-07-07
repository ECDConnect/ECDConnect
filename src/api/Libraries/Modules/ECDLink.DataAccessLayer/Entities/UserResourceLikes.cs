using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(UserResourceLikes))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class UserResourceLikes : UserResourceLikes<Guid>
    {
    }

    public class UserResourceLikes<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public Guid UserId { get; set; }
        public int ContentId { get; set; }
    }

    public interface UserResourceLikesJoin<TKey>
    {
        [ForeignKey(nameof(UserResourceLikesId))]
        public UserResourceLikes UserResourceLikes { get; set; }
        public TKey UserResourceLikesId { get; set; }
    }
}
