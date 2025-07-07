using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(UserHelp))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class UserHelp : UserHelp<Guid>
    {
    }

    public class UserHelp<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Subject { get; set; }
        public string Description { get; set; }
        public string ContactPreference { get; set; }
        public string CellNumber { get; set; }
        public string Email { get; set; }
        public bool IsLoggedIn { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

    }

    public interface UserHelpJoin<TKey>
    {
        [ForeignKey(nameof(UserHelpId))]
        public UserHelp UserHelp { get; set; }
        public TKey UserHelpId { get; set; }
    }
}
