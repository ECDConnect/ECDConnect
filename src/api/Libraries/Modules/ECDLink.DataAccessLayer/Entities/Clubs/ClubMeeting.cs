using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(ClubMeeting))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClubMeeting : ClubMeeting<Guid>
    {

    }

    public class ClubMeeting<TKey> : EntityBase<TKey>, ClubJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        public DateTime? MeetingDate { get; set; }
        public string Name { get; set; }

        public TKey ClubId { get; set; }
        [ForeignKey(nameof(ClubId))]
        public virtual Club Club { get; set; }
    }

    public interface ClubMeetingJoin<TKey>
    {
        [ForeignKey(nameof(ClubMeetingId))]
        public ClubMeeting ClubMeeting { get; set; }
        public TKey ClubMeetingId { get; set; }
    }
}
