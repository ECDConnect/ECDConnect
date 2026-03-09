using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security.Attributes;
using ECDLink.Security;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Invite))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Invite : Invite<Guid>
    {
    }

    public class Invite<TKey> : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        public bool? IsAccepted { get; set; }
        public string Status { get; set; }
        public DateTime? AcceptedDate { get; set; }
        public DateTime? RejectedDate { get; set; }

        [ForeignKey(nameof(PractitionerId))]
        public virtual Practitioner Practitioner { get; set; }
        public Guid? PractitionerId { get; set; }

        [ForeignKey(nameof(PrincipalId))]
        public virtual Practitioner Principal { get; set; }
        public TKey PrincipalId { get; set; }
        
        [ForeignKey(nameof(UserId))]
        public virtual ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }

    }

    public interface InviteJoin<TKey>
    {
        [ForeignKey(nameof(InviteId))]
        public Invite Invite { get; set; }
        public TKey InviteId { get; set; }
    }
}
