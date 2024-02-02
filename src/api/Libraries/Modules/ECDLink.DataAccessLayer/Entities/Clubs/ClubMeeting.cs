using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
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

        // Coaching circle meeting fields - start
        public int? ContentValueId { get; set; } // this link to the Coaching Circle Topic in CMS
        public Guid? MeetingTypeId { get; set; }
        public virtual MeetingType MeetingType { get; set; }
        public string? MeetingNotes { get; set; }
        // Coaching circle meeting fields - end
        public virtual ICollection<ClubMeetingRegister> ClubMeetingRegister { get; set; }

        public TKey ClubId { get; set; }
        [ForeignKey(nameof(ClubId))]
        public virtual Club Club { get; set; }
        public bool CoachAttended { get; set; }
        public string? OtherDescription { get; set; }
        public int TotalCaregiversAttended { get; set; }
        public Guid? EventId { get; set; }
        public bool ClubLeaderContacted { get; set; }
    }

    public interface ClubMeetingJoin<TKey>
    {
        [ForeignKey(nameof(ClubMeetingId))]
        public ClubMeeting ClubMeeting { get; set; }
        public TKey ClubMeetingId { get; set; }
    }
}
