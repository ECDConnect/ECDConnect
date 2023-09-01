using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(ClubLeader))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClubLeader : ClubLeader<Guid>
    {

    }

    public class ClubLeader<TKey> : EntityBase<TKey>, ClubJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        public TKey ClubId { get; set; }
        [ForeignKey(nameof(ClubId))]
        public virtual Club Club { get; set; }
        public Guid PractitionerId { get; set; }
        public virtual Practitioner Practitioner { get; set; }
        public DateTime? DateAssigned { get; set; }
        public DateTime? DateAccepted { get; set; }
    }

    public interface ClubLeaderJoin<TKey>
    {
        [ForeignKey(nameof(ClubLeaderId))]
        public ClubLeader ClubLeader { get; set; }
        public TKey ClubLeaderId { get; set; }
    }
}
