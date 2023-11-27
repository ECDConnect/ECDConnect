using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(ClubSupport))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClubSupport : ClubSupport<Guid>
    {

    }

    public class ClubSupport<TKey> : EntityBase<TKey>, ClubJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        public TKey ClubId { get; set; }
        [ForeignKey(nameof(ClubId))]
        public virtual Club Club { get; set; }
        public Guid PractitionerId { get; set; }
        public virtual Practitioner Practitioner { get; set; }
        public DateTime? DateAssigned { get; set; }
        public DateTime? DateAccepted { get; set; }
        public bool IsNewInSupportRole { get; set; }
    }

    public interface ClubSupportJoin<TKey>
    {
        [ForeignKey(nameof(ClubSupportId))]
        public ClubSupport ClubSupport { get; set; }
        public TKey ClubSupportId { get; set; }
    }
}
