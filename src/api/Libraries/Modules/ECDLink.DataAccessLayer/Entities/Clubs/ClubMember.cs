using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(ClubMember))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClubMember : ClubMember<Guid>
    {

    }

    public class ClubMember<TKey> : EntityBase<TKey>, ClubJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        public TKey ClubId { get; set; }
        [ForeignKey(nameof(ClubId))]
        public virtual Club Club { get; set; }
        public Guid PractitionerId { get; set; }
        public virtual Practitioner Practitioner { get; set; }
        public bool? IsNewInClub { get; set; }
        public DateTime? DateClubJoined { get; set; }
        public string WelcomeMessage { get; set; }
    }

    public interface ClubMemberJoin<TKey>
    {
        [ForeignKey(nameof(ClubMemberId))]
        public ClubMember ClubMember { get; set; }
        public TKey ClubMemberId { get; set; }
    }
}
